'use client';

import { useRef, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { createPhoto } from '@/actions/photos';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PhotoUploadProps {
  roomId: string;
  reportId: string;
  userId: string;
  existingCount: number;
  onUploadComplete?: () => void;
}

export function PhotoUpload({
  roomId,
  reportId,
  userId,
  existingCount,
  onUploadComplete,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    const supabase = createClient();

    let sortOrder = existingCount;

    for (const file of Array.from(files)) {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 10MB limit`);
          continue;
        }

        // Generate unique storage path
        const ext = file.name.split('.').pop() ?? 'jpg';
        const timestamp = Date.now();
        const storagePath = `${userId}/${reportId}/${roomId}/${timestamp}.${ext}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }

        // Create photo record
        startTransition(async () => {
          const result = await createPhoto({
            room_id: roomId,
            report_id: reportId,
            storage_path: storagePath,
            taken_at: new Date().toISOString(),
            sort_order: sortOrder,
          });

          if (result?.error) {
            toast.error(result.error);
          }
        });

        sortOrder++;
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    onUploadComplete?.();

    // Reset file inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }

  return (
    <div className="flex gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <Button
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => cameraInputRef.current?.click()}
      >
        {uploading ? 'Uploading…' : '📷 Camera'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? 'Uploading…' : '📁 Browse'}
      </Button>
    </div>
  );
}
