"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import "../../app/globals.css";
import Logo from '../Logo';

type Category = 'Dashboard' | 'Projects' | 'Data' | 'Document Generation' | 'Form';

const CATEGORIES: { name: Category; href: string }[] = [
  { name: 'Dashboard', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Data', href: '/leads' },
  { name: 'Document Generation', href: '/quotations' },
  { name: 'Form', href: '#' },
];

const NAV_ITEMS: Record<Category, { name: string; href: string }[]> = {
  'Dashboard': [],
  'Projects': [
    { name: 'Active Projects', href: '/projects' },
  ],
  'Data': [
    { name: 'Leads', href: '/leads' },
    { name: 'Vendors', href: '/vendors' },
    { name: 'Products', href: '/products' },
  ],
  'Document Generation': [
    { name: 'Quotations', href: '/quotations' },
    { name: 'Invoices', href: '/invoices' },
  ],
  'Form': [],
};

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getActiveCategory = (path: string): Category => {
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/projects')) return 'Projects';
    if (['/leads', '/vendors', '/products'].some(p => path.startsWith(p))) return 'Data';
    if (['/quotations', '/invoices'].some(p => path.startsWith(p))) return 'Document Generation';
    return 'Dashboard';
  };


  const activeCategory = getActiveCategory(pathname);
  const topNavItems = NAV_ITEMS[activeCategory];

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-neutral-900">
      <aside className="w-64 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 hidden md:block">
        <Link href="/" className="flex items-center min-h-[40px] px-6 py-3">
          <Logo width={22} height={22} className="text-black dark:text-white" />
          <h1 className="ml-2 max-md:text-xs font-medium tracking-wider">REFLECT YOUR VIBE</h1>
        </Link>
        <nav>
          {CATEGORIES.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 ${activeCategory === item.name ? 'bg-gray-100 dark:bg-neutral-700 border-r-4 border-blue-500' : ''
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {topNavItems.length > 0 && (
          <header className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 px-4">
            <nav className="flex space-x-6 overflow-x-auto">
              {topNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium whitespace-nowrap py-3 border-b-2 transition-colors ${pathname.startsWith(item.href)
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </header>
        )}
        <div className="flex-1 p-4 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
