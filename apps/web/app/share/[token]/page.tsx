import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Props {
  params: Promise<{ token: string }>;
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  move_in: 'Move-In Inspection',
  move_out: 'Move-Out Inspection',
  maintenance: 'Maintenance Inspection',
};

export default async function SharePage({ params }: Props) {
  const { token } = await params;
  const supabase = await createClient();

  // Fetch report by share token (RLS policy allows this)
  const { data: report } = await supabase
    .from('reports')
    .select('*, properties(*)')
    .eq('share_token', token)
    .is('deleted_at', null)
    .single();

  if (!report) {
    notFound();
  }

  const property = report.properties as Record<string, unknown>;
  const address = `${property.address_line1 as string}${property.unit_number ? `, Unit ${property.unit_number as string}` : ''}`;
  const fullAddress = `${address}, ${property.city as string}, ${property.state as string} ${property.zip as string}`;

  // Fetch rooms with photos
  const { data: rooms } = await supabase
    .from('rooms')
    .select('*, photos(id, storage_path, caption, sort_order)')
    .eq('report_id', report.id)
    .order('sort_order', { ascending: true });

  const roomsData = rooms ?? [];

  // Get signed URLs for all photos
  const roomsWithUrls = await Promise.all(
    roomsData.map(async (room: Record<string, unknown>) => {
      const photos = (room.photos as { id: string; storage_path: string; caption: string | null }[]) ?? [];
      const photosWithUrls = await Promise.all(
        photos.map(async (photo) => {
          const { data } = await supabase.storage
            .from('photos')
            .createSignedUrl(photo.storage_path, 3600);
          return {
            ...photo,
            signedUrl: data?.signedUrl ?? '',
          };
        }),
      );
      return { ...room, photos: photosWithUrls };
    }),
  );

  const totalPhotos = roomsWithUrls.reduce(
    (sum: number, r: Record<string, unknown>) =>
      sum + ((r.photos as unknown[]) ?? []).length,
    0,
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <h1 className="text-3xl font-bold">
            {REPORT_TYPE_LABELS[report.report_type] ?? 'Condition Report'}
          </h1>
          <Badge variant="secondary">{report.status}</Badge>
        </div>
        <p className="text-lg text-muted-foreground">{fullAddress}</p>
        <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
          <span>
            Created {new Date(report.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          {report.completed_at && (
            <span>
              Completed {new Date(report.completed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          )}
          <span>
            {roomsData.length} room{roomsData.length !== 1 ? 's' : ''} · {totalPhotos} photo{totalPhotos !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Property info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm sm:grid-cols-2 md:grid-cols-3">
            <div>
              <span className="text-muted-foreground">Address</span>
              <p className="font-medium">{fullAddress}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Type</span>
              <p className="font-medium capitalize">{property.property_type as string}</p>
            </div>
            {property.landlord_name ? (
              <div>
                <span className="text-muted-foreground">Landlord</span>
                <p className="font-medium">{String(property.landlord_name)}</p>
              </div>
            ) : null}
            {property.deposit_amount ? (
              <div>
                <span className="text-muted-foreground">Security Deposit</span>
                <p className="font-medium">
                  ${Number(property.deposit_amount).toLocaleString()}
                </p>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Separator className="mb-8" />

      {/* Rooms */}
      <div className="space-y-8">
        {roomsWithUrls.map((room: Record<string, unknown>) => {
          const photos = (room.photos as { id: string; caption: string | null; signedUrl: string }[]) ?? [];
          return (
            <Card key={room.id as string}>
              <CardHeader>
                <CardTitle>
                  {(room.room_label as string) || (room.room_type as string)}
                </CardTitle>
                <CardDescription>
                  {photos.length} photo{photos.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="space-y-1">
                        <div className="relative aspect-square overflow-hidden rounded-md border bg-muted">
                          <Image
                            src={photo.signedUrl}
                            alt={photo.caption ?? 'Property photo'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          />
                        </div>
                        {photo.caption && (
                          <p className="text-xs text-muted-foreground">{photo.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {room.notes ? (
                  <div>
                    <Separator className="mb-3" />
                    <p className="text-sm text-muted-foreground">{String(room.notes)}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
        <p>
          Generated by{' '}
          <span className="font-semibold text-foreground">ConditionLog</span> — Rental
          Property Condition Documentation
        </p>
        <p className="mt-1">
          All photos are timestamped and unaltered. This report serves as a photographic record
          of the property&apos;s condition at the time of inspection.
        </p>
      </div>
    </div>
  );
}
