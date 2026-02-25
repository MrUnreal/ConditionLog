'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { createProperty } from '@/actions/properties';
import { US_STATES } from '@conditionlog/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'studio', label: 'Studio' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'other', label: 'Other' },
] as const;

export default function NewPropertyPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return await createProperty(formData);
    },
    undefined,
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            ← Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add Property</h1>
      </div>

      <form action={formAction}>
        <div className="space-y-6">
          {state?.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>
                Basic information about your rental property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="property_type">Property Type</Label>
                <Select name="property_type" defaultValue="apartment">
                  <SelectTrigger id="property_type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line1">Address Line 1 *</Label>
                <Input
                  id="address_line1"
                  name="address_line1"
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line2">Address Line 2</Label>
                <Input
                  id="address_line2"
                  name="address_line2"
                  placeholder="Apt, Suite, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit_number">Unit Number</Label>
                <Input id="unit_number" name="unit_number" placeholder="e.g., 4B" />
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select name="state" defaultValue="">
                    <SelectTrigger id="state">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP *</Label>
                  <Input id="zip" name="zip" required placeholder="12345" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lease Information</CardTitle>
              <CardDescription>Optional — helps you track lease dates and deposit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="landlord_name">Landlord / Management Company</Label>
                <Input id="landlord_name" name="landlord_name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landlord_email">Landlord Email</Label>
                <Input
                  id="landlord_email"
                  name="landlord_email"
                  type="email"
                  placeholder="landlord@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lease_start">Lease Start</Label>
                  <Input id="lease_start" name="lease_start" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lease_end">Lease End</Label>
                  <Input id="lease_end" name="lease_end" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit_amount">Security Deposit ($)</Label>
                <Input
                  id="deposit_amount"
                  name="deposit_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/dashboard">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating…' : 'Create Property'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
