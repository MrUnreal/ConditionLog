import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getReport } from '@/actions/reports';
import { getRooms } from '@/actions/rooms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShareReportButton } from './share-button';
import { EmailReportButton } from './email-button';

interface Props {
  params: Promise<{ id: string }>;
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  move_in: 'Move-In',
  move_out: 'Move-Out',
  maintenance: 'Maintenance',
};

export default async function ReportDetailPage({ params }: Props) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) {
    notFound();
  }

  const rooms = await getRooms(id);
  const property = report.properties as Record<string, unknown> | null;
  const totalPhotos = rooms.reduce(
    (sum: number, room: Record<string, unknown>) =>
      sum + ((room.photos as unknown[]) ?? []).length,
    0,
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/properties/${report.property_id}`}>
          <Button variant="ghost" size="sm">
            ← Back to Property
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {REPORT_TYPE_LABELS[report.report_type] ?? report.report_type} Report
          </h1>
          {property && (
            <p className="text-muted-foreground">
              {property.address_line1 as string}
              {property.unit_number ? `, Unit ${property.unit_number as string}` : ''}
            </p>
          )}
        </div>
        <Badge
          variant={report.status === 'completed' ? 'default' : 'outline'}
          className="text-sm"
        >
          {report.status}
        </Badge>
      </div>

      {report.status === 'draft' && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <h2 className="text-xl font-semibold">Report in progress</h2>
            <p className="text-muted-foreground">
              Continue documenting your property condition.
            </p>
            <div className="flex gap-3">
              <Link href={`/reports/${id}/rooms`}>
                <Button variant="outline">Edit Rooms</Button>
              </Link>
              <Link href={`/reports/${id}/walkthrough`}>
                <Button>Continue Walkthrough</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {report.status === 'completed' && (
        <div className="flex gap-3">
          <Link href={`/reports/${id}/pdf`}>
            <Button>Download PDF</Button>
          </Link>
          <EmailReportButton reportId={id} />
          <ShareReportButton reportId={id} existingToken={report.share_token ?? undefined} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rooms</CardDescription>
            <CardTitle className="text-2xl">{rooms.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Photos</CardDescription>
            <CardTitle className="text-2xl">{totalPhotos}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Created</CardDescription>
            <CardTitle className="text-2xl">
              {new Date(report.created_at).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="mb-4 text-2xl font-semibold">Rooms</h2>
        {rooms.length === 0 ? (
          <p className="text-muted-foreground">No rooms documented yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room: Record<string, unknown>) => {
              const photos = (room.photos as unknown[]) ?? [];
              return (
                <Card key={room.id as string}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {(room.room_label as string) || (room.room_type as string)}
                    </CardTitle>
                    <CardDescription>
                      {photos.length} photo{photos.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  {room.notes ? (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{String(room.notes)}</p>
                    </CardContent>
                  ) : null}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
