import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getReport } from '@/actions/reports';
import { getRooms } from '@/actions/rooms';
import { getSignedPhotoUrl } from '@/actions/photos';
import { Button } from '@/components/ui/button';
import { ReviewClient } from './review-client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReviewPage({ params }: Props) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) {
    notFound();
  }

  const rooms = await getRooms(id);
  const property = report.properties as Record<string, unknown> | null;
  const propertyAddress = property
    ? `${property.address_line1 as string}${property.unit_number ? `, Unit ${property.unit_number as string}` : ''}`
    : '';

  // Build room summaries with signed photo URLs
  const roomSummaries = await Promise.all(
    rooms.map(async (room: Record<string, unknown>) => {
      const photos = (room.photos as { id: string; storage_path: string; caption: string | null }[]) ?? [];
      const photosWithUrls = await Promise.all(
        photos.map(async (photo) => ({
          id: photo.id,
          caption: photo.caption,
          signedUrl: (await getSignedPhotoUrl(photo.storage_path)) ?? '',
        })),
      );

      return {
        id: room.id as string,
        room_type: room.room_type as string,
        room_label: room.room_label as string | null,
        notes: room.notes as string | null,
        photos: photosWithUrls,
      };
    }),
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href={`/reports/${id}/walkthrough`}>
          <Button variant="ghost" size="sm">
            ← Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Review Report</h1>
          <p className="text-sm text-muted-foreground">{propertyAddress}</p>
        </div>
      </div>

      <ReviewClient
        reportId={id}
        rooms={roomSummaries}
        reportType={report.report_type}
        propertyAddress={propertyAddress}
      />
    </div>
  );
}
