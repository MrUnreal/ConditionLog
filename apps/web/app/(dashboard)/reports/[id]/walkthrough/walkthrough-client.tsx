'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROOM_PHOTO_HINTS, ROOM_TYPE_LABELS, type RoomType } from '@conditionlog/shared';
import { updateRoom } from '@/actions/rooms';
import { getSignedPhotoUrl } from '@/actions/photos';
import { PhotoUpload } from '@/components/photos/photo-upload';
import { PhotoGallery } from '@/components/photos/photo-gallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Photo {
  id: string;
  storage_path: string;
  thumbnail_path: string | null;
  caption: string | null;
  sort_order: number;
}

interface RoomData {
  id: string;
  room_type: string;
  room_label: string | null;
  notes: string | null;
  sort_order: number;
  photos: Photo[];
}

interface WalkthroughClientProps {
  reportId: string;
  rooms: RoomData[];
  userId: string;
}

export function WalkthroughClient({ reportId, rooms, userId }: WalkthroughClientProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const room of rooms) {
      initial[room.id] = room.notes ?? '';
    }
    return initial;
  });
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  const currentRoom = rooms[currentIndex];

  const loadPhotoUrls = useCallback(
    async (photos: Photo[]) => {
      const urls: Record<string, string> = { ...photoUrls };
      for (const photo of photos) {
        if (!urls[photo.id]) {
          const url = await getSignedPhotoUrl(photo.storage_path);
          if (url) urls[photo.id] = url;
        }
      }
      setPhotoUrls(urls);
    },
    [photoUrls],
  );

  // Load signed URLs for current room's photos
  useEffect(() => {
    if (currentRoom && currentRoom.photos.length > 0) {
      const missingUrls = currentRoom.photos.filter((p) => !photoUrls[p.id]);
      if (missingUrls.length > 0) {
        loadPhotoUrls(currentRoom.photos);
      }
    }
  }, [currentRoom, loadPhotoUrls, photoUrls]);

  if (!currentRoom) return null;

  const roomType = currentRoom.room_type as RoomType;
  const hints = ROOM_PHOTO_HINTS[roomType] ?? ROOM_PHOTO_HINTS.other;
  const progress = ((currentIndex + 1) / rooms.length) * 100;

  async function saveNotes() {
    const roomNotes = notes[currentRoom.id] ?? '';
    if (roomNotes !== (currentRoom.notes ?? '')) {
      const result = await updateRoom(currentRoom.id, reportId, { notes: roomNotes });
      if (result?.error) {
        toast.error(result.error);
      }
    }
  }

  async function goToRoom(index: number) {
    await saveNotes();
    setCurrentIndex(index);
  }

  async function handleFinish() {
    await saveNotes();
    router.push(`/reports/${reportId}/review`);
  }

  const photosWithUrls = currentRoom.photos.map((p) => ({
    ...p,
    signedUrl: photoUrls[p.id] ?? '',
  }));

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Room {currentIndex + 1} of {rooms.length}
          </span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Room navigation pills */}
      <div className="flex flex-wrap gap-2">
        {rooms.map((room, i) => (
          <button
            key={room.id}
            onClick={() => goToRoom(i)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              i === currentIndex
                ? 'bg-primary text-primary-foreground'
                : room.photos.length > 0
                  ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {room.room_label ?? ROOM_TYPE_LABELS[room.room_type as RoomType] ?? room.room_type}
            {room.photos.length > 0 && ` (${room.photos.length})`}
          </button>
        ))}
      </div>

      {/* Current room */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {currentRoom.room_label ??
              ROOM_TYPE_LABELS[roomType] ??
              currentRoom.room_type}
          </CardTitle>
          <CardDescription>
            Take photos of this room. Use the checklist below as a guide.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo hints checklist */}
          <div>
            <Label className="mb-2 block text-sm font-medium">Photo Checklist</Label>
            <div className="flex flex-wrap gap-2">
              {hints.map((hint) => (
                <Badge key={hint} variant="outline" className="text-xs">
                  {hint}
                </Badge>
              ))}
            </div>
          </div>

          {/* Photo upload */}
          <div>
            <Label className="mb-2 block text-sm font-medium">Photos</Label>
            <PhotoUpload
              roomId={currentRoom.id}
              reportId={reportId}
              userId={userId}
              existingCount={currentRoom.photos.length}
              onUploadComplete={() => setRefreshKey((k) => k + 1)}
            />
          </div>

          {/* Photo gallery */}
          <PhotoGallery
            key={refreshKey}
            photos={photosWithUrls}
            reportId={reportId}
            onPhotoDeleted={() => setRefreshKey((k) => k + 1)}
          />

          {/* Room notes */}
          <div className="space-y-2">
            <Label htmlFor="room-notes">Notes</Label>
            <Textarea
              id="room-notes"
              value={notes[currentRoom.id] ?? ''}
              onChange={(e) =>
                setNotes((prev) => ({ ...prev, [currentRoom.id]: e.target.value }))
              }
              placeholder="Describe any existing damage, wear, or notable conditions…"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => goToRoom(currentIndex - 1)}
        >
          ← Previous Room
        </Button>
        {currentIndex < rooms.length - 1 ? (
          <Button onClick={() => goToRoom(currentIndex + 1)}>Next Room →</Button>
        ) : (
          <Button onClick={handleFinish}>Review & Complete →</Button>
        )}
      </div>
    </div>
  );
}
