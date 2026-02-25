'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ROOM_TYPE_LABELS, type RoomType } from '@conditionlog/shared';
import { completeReport } from '@/actions/reports';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Photo {
  id: string;
  caption: string | null;
  signedUrl: string;
}

interface RoomSummary {
  id: string;
  room_type: string;
  room_label: string | null;
  notes: string | null;
  photos: Photo[];
}

interface ReviewClientProps {
  reportId: string;
  rooms: RoomSummary[];
  reportType: string;
  propertyAddress: string;
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  move_in: 'Move-In',
  move_out: 'Move-Out',
  maintenance: 'Maintenance',
};

export function ReviewClient({ reportId, rooms, reportType }: ReviewClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const totalPhotos = rooms.reduce((sum, room) => sum + room.photos.length, 0);
  const roomsWithPhotos = rooms.filter((r) => r.photos.length > 0).length;

  function handleComplete() {
    startTransition(async () => {
      const result = await completeReport(reportId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Report completed!');
        router.push(`/reports/${reportId}`);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Report Type</CardDescription>
            <CardTitle className="text-lg">
              {REPORT_TYPE_LABELS[reportType] ?? reportType}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rooms Documented</CardDescription>
            <CardTitle className="text-lg">
              {roomsWithPhotos} / {rooms.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Photos</CardDescription>
            <CardTitle className="text-lg">{totalPhotos}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {rooms.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No rooms have been set up. Go back and add rooms first.
          </CardContent>
        </Card>
      )}

      {/* Room summaries */}
      {rooms.map((room) => (
        <Card key={room.id}>
          <CardHeader>
            <CardTitle className="text-base">
              {room.room_label ?? ROOM_TYPE_LABELS[room.room_type as RoomType] ?? room.room_type}
            </CardTitle>
            <CardDescription>
              {room.photos.length} photo{room.photos.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {room.photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {room.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square overflow-hidden rounded-md border bg-muted"
                  >
                    <Image
                      src={photo.signedUrl}
                      alt={photo.caption ?? 'Photo'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 25vw, 16vw"
                    />
                  </div>
                ))}
              </div>
            )}
            {room.notes && (
              <>
                <Separator />
                <p className="text-sm text-muted-foreground">{room.notes}</p>
              </>
            )}
            {room.photos.length === 0 && !room.notes && (
              <p className="text-sm text-muted-foreground italic">
                No photos or notes for this room
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          ← Back to Walkthrough
        </Button>
        <Button onClick={handleComplete} disabled={isPending || (totalPhotos === 0 && roomsWithPhotos === 0 && !rooms.some((r) => r.notes))}>
          {isPending ? 'Completing…' : 'Complete Report ✓'}
        </Button>
      </div>
    </div>
  );
}
