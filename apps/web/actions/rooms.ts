'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createRoomSchema, updateRoomSchema } from '@conditionlog/shared';

export async function createRoom(formData: FormData) {
  const supabase = await createClient();

  const parsed = createRoomSchema.safeParse({
    report_id: formData.get('report_id') as string,
    room_type: formData.get('room_type') as string,
    room_label: formData.get('room_label') as string,
    sort_order: Number(formData.get('sort_order') ?? 0),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid data' };
  }

  const { error } = await supabase.from('rooms').insert({
    report_id: parsed.data.report_id,
    room_type: parsed.data.room_type,
    room_label: parsed.data.room_label || null,
    sort_order: parsed.data.sort_order,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/reports/${parsed.data.report_id}`);
}

export async function createRoomsBatch(
  reportId: string,
  rooms: { room_type: string; room_label: string; sort_order: number }[],
) {
  const supabase = await createClient();

  const rows = rooms.map((r) => ({
    report_id: reportId,
    room_type: r.room_type,
    room_label: r.room_label || null,
    sort_order: r.sort_order,
  }));

  const { error } = await supabase.from('rooms').insert(rows);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/reports/${reportId}`);
}

export async function getRooms(reportId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('rooms')
    .select('*, photos(id, storage_path, thumbnail_path, caption, sort_order)')
    .eq('report_id', reportId)
    .order('sort_order', { ascending: true });

  return data ?? [];
}

export async function updateRoom(id: string, reportId: string, updates: Record<string, unknown>) {
  const supabase = await createClient();

  const parsed = updateRoomSchema.safeParse(updates);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid data' };
  }

  const { error } = await supabase.from('rooms').update(parsed.data).eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/reports/${reportId}`);
}

export async function deleteRoom(id: string, reportId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('rooms').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/reports/${reportId}`);
}

export async function reorderRooms(reportId: string, roomIds: string[]) {
  const supabase = await createClient();

  const updates = roomIds.map((id, index) =>
    supabase.from('rooms').update({ sort_order: index }).eq('id', id),
  );

  await Promise.all(updates);
  revalidatePath(`/reports/${reportId}`);
}
