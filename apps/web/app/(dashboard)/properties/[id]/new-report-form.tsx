'use client';

import { useActionState } from 'react';
import { createReport } from '@/actions/reports';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const REPORT_TYPES = [
  { value: 'move_in', label: 'Move-In Inspection' },
  { value: 'move_out', label: 'Move-Out Inspection' },
  { value: 'maintenance', label: 'Maintenance Check' },
] as const;

export function NewReportForm({ propertyId }: { propertyId: string }) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return await createReport(formData);
    },
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="property_id" value={propertyId} />

      {state?.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="report_type">Report Type</Label>
        <Select name="report_type" defaultValue="move_in">
          <SelectTrigger id="report_type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {REPORT_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Creating…' : 'Start Report'}
      </Button>
    </form>
  );
}
