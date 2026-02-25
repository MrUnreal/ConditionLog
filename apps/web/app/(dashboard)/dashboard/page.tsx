import Link from 'next/link';
import { getProperties } from '@/actions/properties';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
  const properties = await getProperties();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Properties</h1>
          <p className="text-muted-foreground">
            Manage your rental properties and condition reports
          </p>
        </div>
        <Link href="/properties/new">
          <Button>+ Add Property</Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-5xl">🏠</div>
            <h2 className="mb-2 text-xl font-semibold">No properties yet</h2>
            <p className="mb-6 max-w-sm text-muted-foreground">
              Add your first rental property to start documenting its condition and protecting your
              deposit.
            </p>
            <Link href="/properties/new">
              <Button>Add your first property</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link key={property.id} href={`/properties/${property.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{property.address_line1}</CardTitle>
                      <CardDescription>
                        {property.unit_number ? `Unit ${property.unit_number} · ` : ''}
                        {property.city}, {property.state} {property.zip}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {property.property_type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground">
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
