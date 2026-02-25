'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ROOM_PHOTO_HINTS, ROOM_TYPE_LABELS, type RoomType } from '@conditionlog/shared';
import { updateRoom } from '@/actions/rooms';
import { getSignedPhotoUrl } from '@/actions/photos';
import { PhotoUpload, type PhotoUploadHandle } from '@/components/photos/photo-upload';
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

  // Swipe gesture tracking
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const photoUploadRef = useRef<PhotoUploadHandle>(null);

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

  // Swipe gesture handlers for room navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const SWIPE_THRESHOLD = 80;

      // Only handle horizontal swipes (not vertical scrolling)
      if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0 && currentIndex < rooms.length - 1) {
          // Swipe left → next room
          goToRoom(currentIndex + 1);
        } else if (deltaX > 0 && currentIndex > 0) {
          // Swipe right → previous room
          goToRoom(currentIndex - 1);
        }
      }
      touchStartRef.current = null;
    },
    [currentIndex, rooms.length], // eslint-disable-line react-hooks/exhaustive-deps
  );

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
    <div
      ref={containerRef}
      className="space-y-4 pb-20 sm:space-y-6 sm:pb-0"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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

      {/* Room navigation pills — horizontally scrollable on mobile */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 pb-1 sm:flex-wrap">
          {rooms.map((room, i) => (
            <button
              key={room.id}
              onClick={() => goToRoom(i)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors min-h-[36px] ${
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
      </div>

      {/* Swipe hint — mobile only, shows once */}
      <p className="text-center text-xs text-muted-foreground sm:hidden">
        Swipe left/right to switch rooms
      </p>

      {/* Current room */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">
            {currentRoom.room_label ??
              ROOM_TYPE_LABELS[roomType] ??
              currentRoom.room_type}
          </CardTitle>
          <CardDescription>
            Take photos of this room. Use the checklist below as a guide.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Photo hints checklist */}
          <div>
            <Label className="mb-2 block text-sm font-medium">Photo Checklist</Label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {hints.map((hint) => (
                <Badge key={hint} variant="outline" className="text-xs py-1">
                  {hint}
                </Badge>
              ))}
            </div>
          </div>

          {/* Photo upload */}
          <div>
            <Label className="mb-2 block text-sm font-medium">Photos</Label>
            <PhotoUpload
              ref={photoUploadRef}
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
              className="text-base sm:text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Desktop navigation */}
      <div className="hidden justify-between sm:flex">
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

      {/* Mobile fixed bottom navigation bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden">
        <div className="flex items-center gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Button
            variant="outline"
            size="sm"
            disabled={currentIndex === 0}
            onClick={() => goToRoom(currentIndex - 1)}
            className="min-h-[44px] min-w-[44px] px-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
            <span className="sr-only">Previous</span>
          </Button>

          <div className="flex flex-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => photoUploadRef.current?.triggerCamera()}
              className="flex-1 min-h-[44px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
            </Button>
          </div>

          {currentIndex < rooms.length - 1 ? (
            <Button
              size="sm"
              onClick={() => goToRoom(currentIndex + 1)}
              className="min-h-[44px] px-4"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleFinish}
              className="min-h-[44px] px-4"
            >
              Review
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
