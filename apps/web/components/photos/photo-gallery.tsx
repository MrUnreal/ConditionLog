'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { deletePhoto, updatePhoto } from '@/actions/photos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PhotoItem {
  id: string;
  storage_path: string;
  thumbnail_path: string | null;
  caption: string | null;
  sort_order: number;
  signedUrl: string;
}

interface PhotoGalleryProps {
  photos: PhotoItem[];
  reportId: string;
  onPhotoDeleted?: () => void;
}

export function PhotoGallery({ photos, reportId, onPhotoDeleted }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [caption, setCaption] = useState('');
  const [isPending, startTransition] = useTransition();

  function openPhoto(photo: PhotoItem) {
    setSelectedPhoto(photo);
    setCaption(photo.caption ?? '');
  }

  function handleSaveCaption() {
    if (!selectedPhoto) return;

    startTransition(async () => {
      const result = await updatePhoto(selectedPhoto.id, reportId, { caption });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Caption saved');
        setSelectedPhoto(null);
      }
    });
  }

  function handleDelete(photo: PhotoItem) {
    startTransition(async () => {
      const result = await deletePhoto(photo.id, reportId, photo.storage_path);
      if (result?.error) {
        toast.error(result.error);
      } else {
        setSelectedPhoto(null);
        onPhotoDeleted?.();
      }
    });
  }

  if (photos.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">No photos yet</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => openPhoto(photo)}
            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted min-h-[44px]"
          >
            <Image
              src={photo.signedUrl}
              alt={photo.caption ?? 'Property photo'}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 33vw, 25vw"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-black/60 px-1.5 py-0.5 text-xs text-white">
                {photo.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-2xl max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Photo Detail</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] sm:aspect-video overflow-hidden rounded-lg bg-muted">
                <Image
                  src={selectedPhoto.signedUrl}
                  alt={selectedPhoto.caption ?? 'Property photo'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>

              <div className="flex gap-2">
                <Input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption…"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveCaption}
                  disabled={isPending}
                >
                  Save
                </Button>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(selectedPhoto)}
                  disabled={isPending}
                >
                  Delete Photo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
