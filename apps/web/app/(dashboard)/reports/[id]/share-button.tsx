'use client';

import { useState, useTransition } from 'react';
import { generateShareToken } from '@/actions/reports';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function ShareReportButton({
  reportId,
  existingToken,
}: {
  reportId: string;
  existingToken?: string;
}) {
  const [token, setToken] = useState(existingToken);
  const [isPending, startTransition] = useTransition();

  const shareUrl = token ? `${window.location.origin}/share/${token}` : '';

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateShareToken(reportId);
      if (result.token) {
        setToken(result.token);
      } else if (result.error) {
        toast.error(result.error);
      }
    });
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied to clipboard');
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share Report</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this report</DialogTitle>
          <DialogDescription>
            Generate a shareable link that anyone can use to view this report.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {token ? (
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="font-mono text-xs" />
              <Button variant="outline" onClick={handleCopy}>
                Copy
              </Button>
            </div>
          ) : (
            <Button onClick={handleGenerate} disabled={isPending} className="w-full">
              {isPending ? 'Generating…' : 'Generate Share Link'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
