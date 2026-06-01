import { redirect } from "next/navigation";
import { FiAlertCircle, FiBox, FiClipboard, FiDollarSign, FiTrendingUp, FiUsers } from "react-icons/fi";
import { AdminShell } from "@/components/admin-shell";
import { LinkButton } from "@/components/button";
import { SupabaseStatusCard } from "@/components/supabase-status-card";
import { isAdmin } from "@/lib/admin";
import { formatEUR } from "@/lib/money";
import { products } from "@/lib/products";
import { createServiceClient, hasSupabaseServerConfig } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

type DashboardOrder = {
  total_amount: number | string | null;
  status: string | null;
  customer_email: string | null;
  created_at: string | null;
};

async function getDashboardStats() {
  const fallback = {
    revenue: 0,
    orderCount: 0,
    pendingCount: 0,
    productCount: products.length,
    outOfStockCount: products.filter((product) => product.status === "out_of_stock").length,
    customerCount: 0,
    chart: [0, 0, 0, 0, 0, 0, 0],
    needsAttention: "No live Supabase order data loaded yet."
  };

  if (!hasSupabaseServerConfig()) return fallback;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("orders")
      .select("total_amount,status,customer_email,created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const orders = (data || []) as DashboardOrder[];
    const deliveredOrders = orders.filter((order) => order.status === "delivered");
    const pendingStatuses = new Set(["pending", "confirmed"]);
    const pendingCount = orders.filter((order) => pendingStatuses.has(order.status || "")).length;
    const customerCount = new Set(orders.map((order) => order.customer_email).filter(Boolean)).size;
    const today = new Date();
    const chart = Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (6 - index));
      return orders.filter((order) => {
        if (!order.created_at) return false;
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === day.toDateString();
      }).length;
    });

    return {
      revenue: deliveredOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
      orderCount: orders.length,
      pendingCount,
      productCount: products.length,
      outOfStockCount: products.filter((product) => product.status === "out_of_stock").length,
      customerCount,
      chart,
      needsAttention: `${pendingCount} order(s) are waiting for confirmation and ${products.filter((product) => product.status === "out_of_stock").length} product(s) are currently out of stock.`
    };
  } catch {
    return {
      ...fallback,
      needsAttention: "Supabase dashboard metrics could not be loaded. Check service role and table schema."
    };
  }
}

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const stats = await getDashboardStats();
  const maxChart = Math.max(...stats.chart, 1);
  const cards = [
    [FiDollarSign, "Delivered revenue", formatEUR(stats.revenue), "Only delivered orders count as revenue"],
    [FiClipboard, "Orders", String(stats.orderCount), `${stats.pendingCount} waiting confirmation`],
    [FiBox, "Products", String(stats.productCount), `${stats.outOfStockCount} out of stock`],
    [FiUsers, "Customers", String(stats.customerCount), "Unique order emails"]
  ] as const;

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cocoa">Studio control</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">Admin dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-cocoa">
            Live operational metrics from current orders. Revenue is recognized only when an order is marked delivered.
          </p>
        </div>
        <LinkButton href="/admin/products">Create product</LinkButton>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([Icon, label, value, note]) => (
          <div key={label} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <Icon className="text-cocoa" size={22} />
              <span className="rounded-full bg-linen px-2 py-1 text-xs font-bold text-cocoa">{note}</span>
            </div>
            <p className="mt-5 text-sm font-semibold text-cocoa">{label}</p>
            <p className="mt-1 text-3xl font-bold text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <SupabaseStatusCard />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ink">Weekly order trend</h2>
              <p className="mt-1 text-sm text-cocoa">Orders created in the last 7 days.</p>
            </div>
            <FiTrendingUp className="text-green-700" />
          </div>
          <div className="mt-8 flex h-72 items-end gap-4">
            {stats.chart.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-end rounded-t-md bg-linen" style={{ height: "100%" }}>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-ink to-champagne transition-all"
                    style={{ height: `${Math.max((value / maxChart) * 100, value > 0 ? 10 : 0)}%` }}
                    title={`${value} order(s)`}
                  />
                </div>
                <span className="text-xs text-cocoa">D{index + 1}</span>
                <span className="text-xs font-semibold text-ink">{value}</span>
              </div>
            ))}
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
            <FiAlertCircle className="text-orange-600" />
            <h2 className="mt-3 font-semibold text-ink">Needs attention</h2>
            <p className="mt-2 text-sm leading-6 text-cocoa">{stats.needsAttention}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="font-semibold text-ink">Fast actions</h2>
            <div className="mt-4 grid gap-2">
              <LinkButton href="/admin/orders" variant="secondary">Manage orders</LinkButton>
              <LinkButton href="/admin/categories" variant="secondary">Manage categories</LinkButton>
            </div>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
