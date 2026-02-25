import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getReport } from '@/actions/reports';
import { getRooms } from '@/actions/rooms';
import { createClient } from '@/lib/supabase/server';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PrintButton } from './print-button';

interface Props {
  params: Promise<{ id: string }>;
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  move_in: 'Move-In Inspection',
  move_out: 'Move-Out Inspection',
  maintenance: 'Maintenance Inspection',
};

export default async function ReportViewPage({ params }: Props) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report || report.status !== 'completed') {
    notFound();
  }

  const rooms = await getRooms(id);
  const property = report.properties as Record<string, unknown>;
  const address = `${property.address_line1 as string}${property.unit_number ? `, Unit ${property.unit_number as string}` : ''}`;
  const fullAddress = `${address}, ${property.city as string}, ${property.state as string} ${property.zip as string}`;

  // Get signed URLs for all photos
  const supabase = await createClient();
  const roomsWithUrls = await Promise.all(
    (rooms as Record<string, unknown>[]).map(async (room) => {
      const photos =
        (room.photos as { id: string; storage_path: string; caption: string | null; notes: string | null; sort_order: number }[]) ?? [];
      const photosWithUrls = await Promise.all(
        photos.map(async (photo) => {
          const { data } = await supabase.storage
            .from('photos')
            .createSignedUrl(photo.storage_path, 3600);
          return { ...photo, signedUrl: data?.signedUrl ?? '' };
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

  const completedDate = report.completed_at
    ? new Date(report.completed_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const createdDate = new Date(report.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Print-specific styles */}
      <style>{`
        @media print {
          nav, header, footer, .print\\:hidden, [data-radix-scroll-area-viewport] { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-page { padding: 0 !important; max-width: 100% !important; }
          .print-break { page-break-before: always; }
          .photo-grid img { break-inside: avoid; }
        }
      `}</style>

      <div className="print-page mx-auto max-w-4xl space-y-8">
        {/* Action bar - hidden in print */}
        <div className="flex items-center gap-3 print:hidden">
          <Link href={`/reports/${id}`}>
            <Button variant="ghost" size="sm">← Back to Report</Button>
          </Link>
          <div className="flex-1" />
          <PrintButton />
          <Link href={`/api/reports/${id}/pdf`}>
            <Button variant="outline">📄 Download PDF</Button>
          </Link>
        </div>

        {/* Cover / Header */}
        <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-slate-50 p-8 dark:from-blue-950/30 dark:to-slate-950/30 print:border-0 print:bg-white print:p-0">
          <div className="mb-1 text-sm font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Condition Report
          </div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            {REPORT_TYPE_LABELS[report.report_type] ?? 'Condition Report'}
          </h1>
          <p className="text-xl text-muted-foreground">{fullAddress}</p>

          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Report Date</span>
              <p className="font-semibold">{completedDate ?? createdDate}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Property Type</span>
              <p className="font-semibold capitalize">{property.property_type as string}</p>
            </div>
            {property.landlord_name ? (
              <div>
                <span className="text-muted-foreground">Landlord</span>
                <p className="font-semibold">{String(property.landlord_name)}</p>
              </div>
            ) : null}
            {property.deposit_amount ? (
              <div>
                <span className="text-muted-foreground">Security Deposit</span>
                <p className="font-semibold">${Number(property.deposit_amount).toLocaleString()}</p>
              </div>
            ) : null}
            {property.lease_start ? (
              <div>
                <span className="text-muted-foreground">Lease Period</span>
                <p className="font-semibold">
                  {new Date(property.lease_start as string).toLocaleDateString()}
                  {property.lease_end ? ` — ${new Date(property.lease_end as string).toLocaleDateString()}` : ''}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex gap-3">
            <Badge variant="secondary" className="text-sm">
              {roomsWithUrls.length} Room{roomsWithUrls.length !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {totalPhotos} Photo{totalPhotos !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="default" className="text-sm">
              {report.status === 'completed' ? '✓ Completed' : report.status}
            </Badge>
          </div>
        </div>

        {/* Table of Contents */}
        {roomsWithUrls.length > 4 && (
          <div className="rounded-lg border p-6">
            <h2 className="mb-3 text-lg font-semibold">Table of Contents</h2>
            <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-3">
              {roomsWithUrls.map((room: Record<string, unknown>, i: number) => {
                const photos = (room.photos as unknown[]) ?? [];
                return (
                  <a
                    key={room.id as string}
                    href={`#room-${i}`}
                    className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-muted"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="font-medium">
                      {(room.room_label as string) || (room.room_type as string)}
                    </span>
                    <span className="ml-auto text-muted-foreground">{photos.length} 📷</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <Separator />

        {/* Rooms */}
        {roomsWithUrls.map((room: Record<string, unknown>, i: number) => {
          const photos =
            (room.photos as {
              id: string;
              caption: string | null;
              notes: string | null;
              signedUrl: string;
            }[]) ?? [];

          return (
            <section
              key={room.id as string}
              id={`room-${i}`}
              className={`space-y-4 rounded-xl border p-6 ${i > 0 ? 'print-break' : ''}`}
            >
              {/* Room header */}
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <h2 className="text-2xl font-bold">
                    {(room.room_label as string) || (room.room_type as string)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {photos.length} photo{photos.length !== 1 ? 's' : ''} documented
                  </p>
                </div>
              </div>

              {/* Photo grid */}
              {photos.length > 0 && (
                <div className="photo-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {photos.map((photo, photoIdx) => (
                    <figure key={photo.id} className="space-y-2">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted shadow-sm">
                        {photo.signedUrl ? (
                          <Image
                            src={photo.signedUrl}
                            alt={photo.caption ?? `${(room.room_label as string) || (room.room_type as string)} photo ${photoIdx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            No image available
                          </div>
                        )}
                      </div>
                      {photo.caption && (
                        <figcaption className="text-xs text-muted-foreground">
                          {photo.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}

              {/* Notes */}
              {room.notes ? (
                <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/30">
                  <h3 className="mb-1 text-sm font-semibold text-amber-800 dark:text-amber-200">
                    📝 Notes & Observations
                  </h3>
                  <p className="text-sm text-amber-900 dark:text-amber-100">{String(room.notes)}</p>
                </div>
              ) : null}

              {photos.length === 0 && !room.notes && (
                <p className="py-4 text-center text-sm italic text-muted-foreground">
                  No documentation recorded for this room.
                </p>
              )}
            </section>
          );
        })}

        {/* Footer / Legal */}
        <div className="rounded-xl border bg-slate-50 p-6 text-sm text-muted-foreground dark:bg-slate-900/50">
          <h3 className="mb-2 font-semibold text-foreground">Verification & Disclaimer</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>
              This report was generated on{' '}
              <strong>{completedDate ?? createdDate}</strong> using ConditionLog.
            </li>
            <li>
              All photographs are original, timestamped captures taken during the property
              inspection.
            </li>
            <li>
              This document serves as a photographic record of the property&apos;s condition at
              the time of inspection and may be used as supporting evidence in security deposit
              disputes.
            </li>
            <li>
              Report ID: <code className="rounded bg-muted px-1 font-mono text-xs">{id}</code>
            </li>
          </ul>
          <Separator className="my-4" />
          <p className="text-center text-xs">
            Powered by{' '}
            <strong className="text-foreground">ConditionLog</strong> — Protecting renters&apos;
            security deposits through comprehensive condition documentation.
          </p>
        </div>
      </div>
    </>
  );
}
