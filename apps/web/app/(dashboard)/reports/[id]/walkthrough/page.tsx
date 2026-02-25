import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getReport } from '@/actions/reports';
import { getRooms } from '@/actions/rooms';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { WalkthroughClient } from './walkthrough-client';
import { ProgressSteps } from '@/components/progress-steps';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WalkthroughPage({ params }: Props) {
  const { id } = await params;
  const [report, rooms, supabase] = await Promise.all([
    getReport(id),
    getRooms(id),
    createClient(),
  ]);

  if (!report) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  if (rooms.length === 0) {
    redirect(`/reports/${id}/rooms`);
  }

  const property = report.properties as Record<string, unknown> | null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <ProgressSteps currentStep={2} />
      <div className="flex items-center gap-4">
        <Link href={`/reports/${id}`}>
          <Button variant="ghost" size="sm">
            ← Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Room Walkthrough</h1>
          {property && (
            <p className="text-sm text-muted-foreground">
              {property.address_line1 as string}
              {property.unit_number ? `, Unit ${property.unit_number as string}` : ''}
            </p>
          )}
        </div>
      </div>

      <WalkthroughClient
        reportId={id}
        rooms={rooms as {
          id: string;
          room_type: string;
          room_label: string | null;
          notes: string | null;
          sort_order: number;
          photos: {
            id: string;
            storage_path: string;
            thumbnail_path: string | null;
            caption: string | null;
            sort_order: number;
          }[];
        }[]}
        userId={user.id}
      />
    </div>
  );
}
