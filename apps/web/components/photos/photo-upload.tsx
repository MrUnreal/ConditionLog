'use client';

import { useRef, useState, useTransition, useCallback, useImperativeHandle, forwardRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { createPhoto } from '@/actions/photos';
import { validateImageFile, compressImage, extractExif } from '@/lib/image-utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PhotoUploadProps {
  roomId: string;
  reportId: string;
  userId: string;
  existingCount: number;
  onUploadComplete?: () => void;
}

export interface PhotoUploadHandle {
  triggerCamera: () => void;
  triggerBrowse: () => void;
}

interface UploadProgress {
  fileName: string;
  status: 'validating' | 'compressing' | 'uploading' | 'done' | 'error';
  error?: string;
  originalSize?: number;
  compressedSize?: number;
}

export const PhotoUpload = forwardRef<PhotoUploadHandle, PhotoUploadProps>(function PhotoUpload(
  {
    roomId,
    reportId,
    userId,
    existingCount,
    onUploadComplete,
  },
  ref,
) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [, startTransition] = useTransition();

  useImperativeHandle(ref, () => ({
    triggerCamera: () => cameraInputRef.current?.click(),
    triggerBrowse: () => fileInputRef.current?.click(),
  }));

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      setUploading(true);

      // Init progress
      setProgress(
        fileArray.map((f) => ({
          fileName: f.name,
          status: 'validating' as const,
          originalSize: f.size,
        })),
      );

      const supabase = createClient();
      let sortOrder = existingCount;
      let successCount = 0;

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]!;

        // 1. Validate
        setProgress((prev) =>
          prev.map((p, j) => (j === i ? { ...p, status: 'validating' } : p)),
        );

        const validation = validateImageFile(file);
        if (!validation.valid) {
          setProgress((prev) =>
            prev.map((p, j) =>
              j === i ? { ...p, status: 'error', error: validation.error } : p,
            ),
          );
          toast.error(validation.error);
          continue;
        }

        // 2. Extract EXIF
        const exif = await extractExif(file);

        // 3. Compress
        setProgress((prev) =>
          prev.map((p, j) => (j === i ? { ...p, status: 'compressing' } : p)),
        );

        let processedFile: File;
        try {
          processedFile = await compressImage(file);
        } catch {
          // If compression fails, use original (with size check)
          if (file.size > 10 * 1024 * 1024) {
            setProgress((prev) =>
              prev.map((p, j) =>
                j === i ? { ...p, status: 'error', error: 'File too large and compression failed' } : p,
              ),
            );
            continue;
          }
          processedFile = file;
        }

        // 4. Upload
        setProgress((prev) =>
          prev.map((p, j) =>
            j === i
              ? { ...p, status: 'uploading', compressedSize: processedFile.size }
              : p,
          ),
        );

        try {
          const ext = processedFile.name.split('.').pop() ?? 'jpg';
          const timestamp = Date.now();
          const storagePath = `${userId}/${reportId}/${roomId}/${timestamp}_${i}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from('photos')
            .upload(storagePath, processedFile, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) {
            setProgress((prev) =>
              prev.map((p, j) =>
                j === i ? { ...p, status: 'error', error: uploadError.message } : p,
              ),
            );
            toast.error(`Failed to upload ${file.name}`);
            continue;
          }

          // 5. Create photo record with EXIF data
          startTransition(async () => {
            const result = await createPhoto({
              room_id: roomId,
              report_id: reportId,
              storage_path: storagePath,
              taken_at: exif.dateTaken ?? new Date().toISOString(),
              latitude: exif.latitude,
              longitude: exif.longitude,
              sort_order: sortOrder,
            });

            if (result?.error) {
              toast.error(result.error);
            }
          });

          setProgress((prev) =>
            prev.map((p, j) => (j === i ? { ...p, status: 'done' } : p)),
          );

          sortOrder++;
          successCount++;
        } catch {
          setProgress((prev) =>
            prev.map((p, j) =>
              j === i ? { ...p, status: 'error', error: 'Upload failed' } : p,
            ),
          );
        }
      }

      setUploading(false);

      if (successCount > 0) {
        const saved = fileArray.reduce((acc, f, i) => {
          const p = progress[i];
          if (p?.compressedSize && p.originalSize) {
            return acc + (p.originalSize - p.compressedSize);
          }
          return acc;
        }, 0);

        const savedStr = saved > 0 ? ` (saved ${formatBytes(saved)})` : '';
        toast.success(`${successCount} photo${successCount > 1 ? 's' : ''} uploaded${savedStr}`);
        onUploadComplete?.();
      }

      // Clear progress after a moment
      setTimeout(() => setProgress([]), 3000);

      // Reset file inputs
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    },
    [roomId, reportId, userId, existingCount, onUploadComplete, startTransition, progress],
  );

  // Drag & drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles],
  );

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-muted-foreground/25 hover:border-primary/50'
        } ${uploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}`}
        onClick={() => !uploading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload photos by clicking, dragging, or using camera"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <div className="flex flex-col items-center gap-2">
          {/* Upload icon */}
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
            isDragOver ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M12 12v9" />
              <path d="m16 16-4-4-4 4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium">
              {isDragOver ? 'Drop photos here' : 'Drag photos here or tap to browse'}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              JPEG, PNG, WebP up to 20MB — auto-compressed for fast uploads
            </p>
          </div>
        </div>
      </div>

      {/* Camera + Browse buttons */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          className="hidden"
          onChange={(e) => processFiles(e.target.files!)}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="hidden"
          onChange={(e) => processFiles(e.target.files!)}
        />

        <Button
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
          className="flex-1 sm:flex-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5" aria-hidden="true">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
          Camera
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          className="flex-1 sm:flex-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5" aria-hidden="true">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
          </svg>
          Browse
        </Button>
      </div>

      {/* Progress indicators */}
      {progress.length > 0 && (
        <div className="space-y-1.5 rounded-lg border bg-card p-3">
          {progress.map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {/* Status indicator */}
              {p.status === 'done' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
              )}
              {p.status === 'error' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-destructive shrink-0"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
              )}
              {(p.status === 'validating' || p.status === 'compressing' || p.status === 'uploading') && (
                <div className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}

              {/* File name */}
              <span className="truncate flex-1 text-muted-foreground">{p.fileName}</span>

              {/* Status text */}
              <span className={`shrink-0 ${p.status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>
                {p.status === 'validating' && 'Checking…'}
                {p.status === 'compressing' && 'Compressing…'}
                {p.status === 'uploading' && 'Uploading…'}
                {p.status === 'done' && p.compressedSize && p.originalSize && p.compressedSize < p.originalSize
                  ? `Done (${formatBytes(p.originalSize)} → ${formatBytes(p.compressedSize)})`
                  : p.status === 'done' ? 'Done' : ''}
                {p.status === 'error' && (p.error ?? 'Failed')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
