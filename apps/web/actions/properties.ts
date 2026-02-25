'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createPropertySchema } from '@conditionlog/shared';

export async function createProperty(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const raw = {
    property_type: formData.get('property_type') as string,
    address_line1: formData.get('address_line1') as string,
    address_line2: formData.get('address_line2') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    zip: formData.get('zip') as string,
    unit_number: formData.get('unit_number') as string,
    landlord_name: formData.get('landlord_name') as string,
    landlord_email: formData.get('landlord_email') as string,
    lease_start: formData.get('lease_start') as string,
    lease_end: formData.get('lease_end') as string,
    deposit_amount: formData.get('deposit_amount') as string,
  };

  const parsed = createPropertySchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid data' };
  }

  const { data, error } = await supabase
    .from('properties')
    .insert({
      user_id: user.id,
      property_type: parsed.data.property_type,
      address_line1: parsed.data.address_line1,
      address_line2: parsed.data.address_line2 || null,
      city: parsed.data.city,
      state: parsed.data.state,
      zip: parsed.data.zip,
      unit_number: parsed.data.unit_number || null,
      landlord_name: parsed.data.landlord_name || null,
      landlord_email: parsed.data.landlord_email || null,
      lease_start: parsed.data.lease_start || null,
      lease_end: parsed.data.lease_end || null,
      deposit_amount: parsed.data.deposit_amount ?? null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  redirect(`/properties/${data.id}`);
}

export async function getProperties() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  return data ?? [];
}

export async function getProperty(id: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  return data;
}

export async function deleteProperty(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('properties')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
