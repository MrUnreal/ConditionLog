import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProperty } from '@/actions/properties';
import { getReports } from '@/actions/reports';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DeletePropertyButton } from './delete-button';
import { NewReportForm } from './new-report-form';

interface Props {
  params: Promise<{ id: string }>;
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  move_in: 'Move-In',
  move_out: 'Move-Out',
  maintenance: 'Maintenance',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  draft: 'outline',
  completed: 'default',
  exported: 'secondary',
};

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const reports = await getReports(id);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            ← Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{property.address_line1}</h1>
          <p className="text-muted-foreground">
            {property.unit_number ? `Unit ${property.unit_number} · ` : ''}
            {property.city}, {property.state} {property.zip}
          </p>
        </div>
        <DeletePropertyButton propertyId={id} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Property Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="capitalize">{property.property_type}</span>
            </div>
            {property.address_line2 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address Line 2</span>
                <span>{property.address_line2}</span>
              </div>
            )}
            {property.landlord_name && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Landlord</span>
                <span>{property.landlord_name}</span>
              </div>
            )}
            {property.landlord_email && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Landlord Email</span>
                <span>{property.landlord_email}</span>
              </div>
            )}
            {property.deposit_amount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Security Deposit</span>
                <span>${Number(property.deposit_amount).toLocaleString()}</span>
              </div>
            )}
            {property.lease_start && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lease Start</span>
                <span>{new Date(property.lease_start).toLocaleDateString()}</span>
              </div>
            )}
            {property.lease_end && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lease End</span>
                <span>{new Date(property.lease_end).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>New Report</CardTitle>
            </div>
            <CardDescription>
              Start a new condition report for this property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewReportForm propertyId={id} />
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="mb-4 text-2xl font-semibold">Reports</h2>
        {reports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No reports yet. Create your first condition report above.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Link key={report.id} href={`/reports/${report.id}`}>
                <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-violet-500 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {REPORT_TYPE_LABELS[report.report_type] ?? report.report_type} Report
                      </CardTitle>
                      <Badge variant={STATUS_VARIANT[report.status] ?? 'outline'}>
                        {report.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Created {new Date(report.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  {report.completed_at && (
                    <CardContent className="text-sm text-muted-foreground">
                      Completed {new Date(report.completed_at).toLocaleDateString()}
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
