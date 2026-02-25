import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { ReportPDF } from '@/components/pdf/report-pdf';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Fetch report with property
  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('*, properties(*)')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (reportError || !report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  // Verify ownership
  if (report.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Fetch rooms with photos
  const { data: rooms } = await supabase
    .from('rooms')
    .select('*, photos(id, storage_path, caption, sort_order)')
    .eq('report_id', id)
    .order('sort_order', { ascending: true });

  const roomsData = rooms ?? [];

  // Generate signed URLs for all photos
  const roomsWithPhotos = await Promise.all(
    roomsData.map(async (room: Record<string, unknown>) => {
      const photos = (room.photos as { id: string; storage_path: string; caption: string | null; sort_order: number }[]) ?? [];

      const photosWithUrls = await Promise.all(
        photos.map(async (photo) => {
          const { data } = await supabase.storage
            .from('photos')
            .createSignedUrl(photo.storage_path, 3600);

          return {
            id: photo.id,
            caption: photo.caption,
            imageUrl: data?.signedUrl ?? '',
          };
        }),
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

  const property = report.properties as Record<string, unknown>;

  // Render PDF to buffer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfElement: any = React.createElement(ReportPDF, {
    reportType: report.report_type,
    createdAt: report.created_at,
    completedAt: report.completed_at,
    property: {
      address_line1: property.address_line1 as string,
      address_line2: property.address_line2 as string | null,
      unit_number: property.unit_number as string | null,
      city: property.city as string,
      state: property.state as string,
      zip: property.zip as string,
      property_type: property.property_type as string,
      landlord_name: property.landlord_name as string | null,
      deposit_amount: property.deposit_amount as number | null,
    },
    rooms: roomsWithPhotos,
  });

  const buffer = await renderToBuffer(pdfElement);

  const filename = `condition-report-${report.report_type}-${new Date(report.created_at).toISOString().split('T')[0]}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
