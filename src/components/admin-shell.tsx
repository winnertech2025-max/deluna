import Link from "next/link";
import { FiBox, FiGrid, FiHome, FiRefreshCw, FiShoppingBag, FiUsers } from "react-icons/fi";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const links = [
    ["/admin", "Overview", FiHome],
    ["/admin/categories", "Categories", FiGrid],
    ["/admin/products", "Products", FiBox],
    ["/admin/orders", "Orders", FiShoppingBag],
    ["/admin/returns", "Returns", FiRefreshCw],
    ["/admin/customers", "Customers", FiUsers]
  ] as const;

  return (
    <div className="mx-auto grid min-h-[calc(100vh-120px)] w-full max-w-[1560px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:px-8">
      <aside className="h-fit rounded-lg border border-black/10 bg-ink p-4 text-white shadow-soft lg:sticky lg:top-28">
        <p className="px-3 py-3 text-xs font-bold uppercase tracking-[0.22em] text-champagne">Admin studio</p>
        <nav className="space-y-1">
          {links.map(([href, label, Icon]) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition hover:bg-white/10">
              <Icon /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">{children}</section>
    </div>
  );
}
