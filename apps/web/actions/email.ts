'use server';

import { getResend } from '@/lib/resend';
import { createClient } from '@/lib/supabase/server';

export async function sendReportEmail(reportId: string, recipientEmail: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Fetch report with property
  const { data: report } = await supabase
    .from('reports')
    .select('*, properties(*)')
    .eq('id', reportId)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .single();

  if (!report) {
    return { error: 'Report not found' };
  }

  const property = report.properties as Record<string, unknown>;
  const address = property.address_line1 as string;

  const reportTypeLabels: Record<string, string> = {
    move_in: 'Move-In',
    move_out: 'Move-Out',
    maintenance: 'Maintenance',
  };

  const reportLabel = reportTypeLabels[report.report_type] ?? report.report_type;

  // Generate or reuse share token for the view link
  let shareToken = report.share_token as string | null;
  if (!shareToken) {
    const { randomBytes } = await import('crypto');
    shareToken = randomBytes(32).toString('hex');
    await supabase
      .from('reports')
      .update({ share_token: shareToken })
      .eq('id', reportId);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
  const viewUrl = `${baseUrl}/share/${shareToken}`;

  try {
    const { error } = await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'ConditionLog <noreply@conditionlog.com>',
      to: recipientEmail,
      subject: `${reportLabel} Condition Report — ${address}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1e3a5f; margin-bottom: 4px;">${reportLabel} Condition Report</h1>
          <p style="color: #6b7280; margin-top: 0;">${address}</p>
          
          <p>A condition report has been shared with you via ConditionLog.</p>
          
          <div style="margin: 24px 0;">
            <a href="${viewUrl}" 
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-right: 12px;">
              View Report Online
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Report created on ${new Date(report.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            ${report.completed_at ? ` · Completed on ${new Date(report.completed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          
          <p style="color: #9ca3af; font-size: 12px;">
            This email was sent via ConditionLog — rental property condition documentation.
          </p>
        </div>
      `,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch {
    return { error: 'Failed to send email. Please try again.' };
  }
}
