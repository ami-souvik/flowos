import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [leads, vendors, quotations, invoices] = await Promise.all([
    prisma.lead.count(),
    prisma.vendor.count(),
    prisma.quotation.count(),
    prisma.invoice.count(),
  ]);

  return { leads, vendors, quotations, invoices };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  const stats = await getStats();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.leads}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">{stats.vendors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{stats.quotations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{stats.invoices}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}