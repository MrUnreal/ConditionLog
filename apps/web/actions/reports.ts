'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createReportSchema } from '@conditionlog/shared';
import { randomBytes } from 'crypto';

export async function createReport(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const parsed = createReportSchema.safeParse({
    property_id: formData.get('property_id') as string,
    report_type: formData.get('report_type') as string,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid data' };
  }

  const { data, error } = await supabase
    .from('reports')
    .insert({
      property_id: parsed.data.property_id,
      user_id: user.id,
      report_type: parsed.data.report_type,
      status: 'draft',
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/properties/${parsed.data.property_id}`);
  redirect(`/reports/${data.id}/rooms`);
}

export async function getReports(propertyId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('reports')
    .select('*')
    .eq('property_id', propertyId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  return data ?? [];
}

export async function getReport(id: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('reports')
    .select('*, properties(*)')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  return data;
}

export async function getReportByShareToken(token: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('reports')
    .select('*, properties(*)')
    .eq('share_token', token)
    .is('deleted_at', null)
    .single();

  return data;
}

export async function completeReport(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('reports')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/reports/${id}`);
}

export async function generateShareToken(reportId: string) {
  const supabase = await createClient();

  const token = randomBytes(32).toString('hex');

  const { error } = await supabase
    .from('reports')
    .update({ share_token: token })
    .eq('id', reportId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/reports/${reportId}`);
  return { token };
}

export async function deleteReport(id: string, propertyId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('reports')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/properties/${propertyId}`);
  redirect(`/properties/${propertyId}`);
}
