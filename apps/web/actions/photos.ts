'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function createPhoto(data: {
  room_id: string;
  report_id: string;
  storage_path: string;
  thumbnail_path?: string;
  caption?: string;
  taken_at: string;
  latitude?: number | null;
  longitude?: number | null;
  sort_order?: number;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from('photos').insert({
    room_id: data.room_id,
    storage_path: data.storage_path,
    thumbnail_path: data.thumbnail_path ?? null,
    caption: data.caption ?? null,
    taken_at: data.taken_at,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    sort_order: data.sort_order ?? 0,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/reports/${data.report_id}`);
}

export async function getPhotos(roomId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('photos')
    .select('*')
    .eq('room_id', roomId)
    .order('sort_order', { ascending: true });

  return data ?? [];
}

export async function updatePhoto(
  id: string,
  reportId: string,
  updates: { caption?: string; notes?: string; sort_order?: number },
) {
  const supabase = await createClient();

  const { error } = await supabase.from('photos').update(updates).eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/reports/${reportId}`);
}

export async function deletePhoto(id: string, reportId: string, storagePath: string) {
  const supabase = await createClient();

  // Delete from storage
  await supabase.storage.from('photos').remove([storagePath]);

  // Delete from database
  const { error } = await supabase.from('photos').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/reports/${reportId}`);
}

export async function getPhotoUrl(storagePath: string) {
  const supabase = await createClient();

  const { data } = supabase.storage.from('photos').getPublicUrl(storagePath);

  return data.publicUrl;
}

export async function getSignedPhotoUrl(storagePath: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from('photos')
    .createSignedUrl(storagePath, 3600);

  if (error) return null;
  return data.signedUrl;
}
