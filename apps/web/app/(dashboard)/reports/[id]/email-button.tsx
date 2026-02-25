'use client';

import { useState, useTransition } from 'react';
import { sendReportEmail } from '@/actions/email';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export function EmailReportButton({ reportId }: { reportId: string }) {
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSend() {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    startTransition(async () => {
      const result = await sendReportEmail(reportId, email);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Report sent successfully');
        setOpen(false);
        setEmail('');
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Email Report</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email this report</DialogTitle>
          <DialogDescription>
            Send a link to this report via email. The recipient will be able to view it online.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Recipient Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="landlord@example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSend} disabled={isPending}>
            {isPending ? 'Sending…' : 'Send Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
