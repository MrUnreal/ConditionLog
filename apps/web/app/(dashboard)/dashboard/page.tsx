import Link from 'next/link';
import { getProperties } from '@/actions/properties';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
  const properties = await getProperties();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight">My Properties</h1>
          <p className="text-[#8A94A6]">
            Manage your rental properties and condition reports
          </p>
        </div>
        <Link href="/properties/new">
          <Button className="bg-[#00E5C5] text-[#080C12] hover:bg-[#00E5C5]/90 shadow-sm shadow-[#00E5C5]/20 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Add Property
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <Card className="border-dashed border-[#1E2A3A] bg-[#0F1620]">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            {/* House illustration */}
            <div className="relative mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#00E5C5]/10 text-[#00E5C5]">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              {/* Floating plus badge */}
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#00E5C5] text-[#080C12] shadow-md shadow-[#00E5C5]/20 animate-float">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </div>
            </div>
            <h2 className="mb-2 text-xl font-semibold">No properties yet</h2>
            <p className="mb-6 max-w-sm text-[#8A94A6]">
              Add your first rental property to start documenting its condition and protecting your
              deposit.
            </p>
            <Link href="/properties/new">
              <Button size="lg" className="bg-[#00E5C5] text-[#080C12] hover:bg-[#00E5C5]/90 shadow-sm shadow-[#00E5C5]/20 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Add your first property
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link key={property.id} href={`/properties/${property.id}`}>
              <Card className="group relative overflow-hidden rounded-2xl border-[#1E2A3A] bg-[#0F1620] transition-all hover:shadow-lg hover:shadow-[#00E5C5]/5 hover:-translate-y-0.5 hover:border-[#00E5C5]/30">
                {/* Left colored edge */}
                <div className="absolute inset-y-0 left-0 w-1 bg-[#00E5C5] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{property.address_line1}</CardTitle>
                      <CardDescription className="text-[#8A94A6]">
                        {property.unit_number ? `Unit ${property.unit_number} · ` : ''}
                        {property.city}, {property.state} {property.zip}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="capitalize bg-[#1A2233] text-[#8A94A6] border-[#1E2A3A]">
                      {property.property_type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-[#8A94A6]">
                    {property.deposit_amount && (
                      <span>Deposit: ${Number(property.deposit_amount).toLocaleString()}</span>
                    )}
                    {property.lease_end && (
                      <span>Lease ends: {new Date(property.lease_end).toLocaleDateString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
