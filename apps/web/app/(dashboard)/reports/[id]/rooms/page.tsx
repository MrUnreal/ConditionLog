import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getReport } from '@/actions/reports';
import { getRooms } from '@/actions/rooms';
import type { PropertyType } from '@conditionlog/shared';
import { Button } from '@/components/ui/button';
import { RoomSetupClient } from './room-setup-client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RoomSetupPage({ params }: Props) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) {
    notFound();
  }

  const existingRooms = await getRooms(id);
  const property = report.properties as Record<string, unknown> | null;
  const propertyType = ((property?.property_type as string) ?? 'apartment') as PropertyType;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/reports/${id}`}>
          <Button variant="ghost" size="sm">
            ← Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Set Up Rooms</h1>
          <p className="text-muted-foreground">
            Choose which rooms to include in your condition report
          </p>
        </div>
      </div>

      <RoomSetupClient
        reportId={id}
        propertyType={propertyType}
        existingRooms={existingRooms.map(
          (r: { id: string; room_type: string; room_label: string | null; sort_order: number }) => ({
            id: r.id,
            room_type: r.room_type,
            room_label: r.room_label,
            sort_order: r.sort_order,
          }),
        )}
      />
    </div>
  );
}
