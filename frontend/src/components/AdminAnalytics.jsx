import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, ShoppingBag, Package, AlertTriangle, Clock, CheckCircle,
  Truck, XCircle, TrendingUp, Star,
} from "lucide-react";
import CountUp from "./CountUp";
import { fadeUp, staggerContainer } from "../utils/motion";

const STATUS_META = {
  Pending: { icon: Clock, color: "text-neutral-600", bg: "bg-neutral-200", label: "Pending", ring: "#a1a1aa" },
  Processing: { icon: TrendingUp, color: "text-neutral-600", bg: "bg-neutral-100", label: "Processing", ring: "#a1a1aa" },
  Shipped: { icon: Truck, color: "text-neutral-600", bg: "bg-neutral-100", label: "Shipped", ring: "#a1a1aa" },
  Delivered: { icon: CheckCircle, color: "text-neutral-600", bg: "bg-neutral-100", label: "Delivered", ring: "#737373" },
  Cancelled: { icon: XCircle, color: "text-neutral-600", bg: "bg-neutral-100", label: "Cancelled", ring: "#52525b" },
};

const AdminAnalytics = ({ orders = [], products = [] }) => {
  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((s, o) => s + Number(o.total_price || 0), 0);
    const pending = orders.filter((o) => o.status === "Pending").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const lowStock = products.filter((p) => p.stock_quantity < 8 && p.stock_quantity > 0);
    const outOfStock = products.filter((p) => p.stock_quantity <= 0);
    const totalUnits = products.reduce((s, p) => s + Number(p.stock_quantity || 0), 0);

    // Top sellers by units ordered
    const sales = {};
    orders.forEach((o) =>
      o.items?.forEach((it) => {
        const k = it.name || it.product_id;
        sales[k] = sales[k] || { name: it.name, units: 0, revenue: 0 };
        sales[k].units += it.quantity || 0;
        sales[k].revenue += Number(it.price || 0) * (it.quantity || 0);
      })
    );
    const topSellers = Object.values(sales).sort((a, b) => b.units - a.units).slice(0, 5);

    // Status distribution
    const dist = {};
    orders.forEach((o) => (dist[o.status] = (dist[o.status] || 0) + 1));

    return { revenue, pending, delivered, lowStock, outOfStock, totalUnits, topSellers, dist, totalOrders: orders.length };
  }, [orders, products]);

  const cards = [
    { label: "Gross Revenue", value: <CountUp to={stats.revenue} prefix="$" decimals={2} />, icon: DollarSign, tint: "from-neutral-800 to-neutral-600" },
    { label: "Total Orders", value: <CountUp to={stats.totalOrders} />, icon: ShoppingBag, tint: "from-neutral-900 to-neutral-700" },
    { label: "Pending (action needed)", value: <CountUp to={stats.pending} />, icon: Clock, tint: "from-neutral-800 to-neutral-600" },
    { label: "Delivered", value: <CountUp to={stats.delivered} />, icon: CheckCircle, tint: "from-neutral-800 to-neutral-600" },
    { label: "Units in Stock", value: <CountUp to={stats.totalUnits} />, icon: Package, tint: "from-neutral-800 to-neutral-600" },
    { label: "Low / Out of Stock", value: <CountUp to={stats.lowStock.length + stats.outOfStock.length} />, icon: AlertTriangle, tint: "from-neutral-800 to-neutral-600" },
  ];

  const maxDist = Math.max(1, ...Object.values(stats.dist));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI cards */}
      <motion.div variants={staggerContainer(0.06)} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} variants={fadeUp} className="glass-card rounded-3xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden">
            <div className={`absolute -top-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-tr ${c.tint} opacity-10`} />
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${c.tint} text-white shadow-md mb-3`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-black text-gray-900 font-display tracking-tight">{c.value}</div>
            <div className="mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{c.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top sellers */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Star className="h-5 w-5 text-neutral-500" />
            <h3 className="font-black text-gray-900 font-display">Top Sellers</h3>
          </div>
          {stats.topSellers.length ? (
            <ul className="space-y-4">
              {stats.topSellers.map((t, i) => {
                const max = stats.topSellers[0].units || 1;
                return (
                  <li key={i}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-bold text-gray-800 truncate pr-2">{i + 1}. {t.name}</span>
                      <span className="font-black text-gray-900">{t.units} <span className="text-[10px] text-gray-400">units</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(t.units / max) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full rounded-full bg-gradient-to-r from-neutral-900 to-neutral-700 ${i === 0 ? "from-neutral-800 to-neutral-600" : ""}`}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-400 font-medium text-sm">No sales yet — orders will appear here.</p>
          )}
        </motion.div>

        {/* Order status funnel */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-5 w-5 text-neutral-600" />
            <h3 className="font-black text-gray-900 font-display">Order Pipeline</h3>
          </div>
          {Object.keys(stats.dist).length ? (
            <ul className="space-y-4">
              {Object.entries(stats.dist).map(([status, count]) => {
                const meta = STATUS_META[status] || STATUS_META.Pending;
                const Icon = meta.icon;
                return (
                  <li key={status}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="flex items-center gap-2 font-bold text-gray-800">
                        <span className={`p-1.5 rounded-lg ${meta.bg} ${meta.color}`}><Icon className="h-3.5 w-3.5" /></span>
                        {meta.label}
                      </span>
                      <span className="font-black text-gray-900">{count}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(count / maxDist) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: meta.ring }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-400 font-medium text-sm">No orders yet.</p>
          )}

          {/* low stock callout */}
          {stats.outOfStock.length > 0 && (
            <div className="mt-5 p-3 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center gap-3 text-sm font-bold text-neutral-800">
              <AlertTriangle className="h-5 w-5" />
              {stats.outOfStock.length} product{stats.outOfStock.length > 1 ? "s" : ""} out of stock — restock soon.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;