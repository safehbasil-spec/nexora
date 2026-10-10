"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Product,
  Sale,
  Expense,
  Supplier,
  InventorySummary,
  DEFAULT_CATEGORIES,
  EXPENSE_CATEGORIES,
} from "@/types/stock";
import {
  loadStore,
  addProduct,
  updateProduct,
  deleteProduct,
  recordStockIn,
  recordAdjustmentOut,
  recordSale,
  addExpense,
  deleteExpense,
  addSupplier,
  getSummary,
  getLowStockProducts,
  getOutOfStockProducts,
  exportProductsCSV,
  exportSalesCSV,
  downloadCSV,
} from "@/lib/stock/store";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Download,
  ArrowDownCircle,
  ArrowUpCircle,
  Trash2,
  Search,
  X,
  BarChart3,
  Wallet,
  Truck,
  Info,
} from "lucide-react";

type Tab = "overview" | "products" | "sales" | "stock" | "expenses" | "suppliers";

export function StockTracker() {
  const [tab, setTab] = useState<Tab>("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [outOfStock, setOutOfStock] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const refresh = useCallback(() => {
    const store = loadStore();
    setProducts([...store.products].sort((a, b) => a.name.localeCompare(b.name)));
    setSales([...store.sales].sort((a, b) => b.date.localeCompare(a.date)));
    setExpenses([...store.expenses].sort((a, b) => b.date.localeCompare(a.date)));
    setSuppliers([...store.suppliers]);
    setSummary(getSummary());
    setLowStock(getLowStockProducts());
    setOutOfStock(getOutOfStockProducts());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const flash = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "products", label: "Products", icon: <Package className="w-4 h-4" /> },
    { id: "sales", label: "Sales", icon: <ShoppingCart className="w-4 h-4" /> },
    { id: "stock", label: "Stock In/Out", icon: <ArrowDownCircle className="w-4 h-4" /> },
    { id: "expenses", label: "Expenses", icon: <Wallet className="w-4 h-4" /> },
    { id: "suppliers", label: "Suppliers", icon: <Truck className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Smart Stock & Profit Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track products, stock, sales and real gross profit · Values in XAF
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              downloadCSV(`nexora-products-${new Date().toISOString().slice(0, 10)}.csv`, exportProductsCSV());
              flash("ok", "Products exported");
            }}
            className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
          >
            <Download className="w-4 h-4" /> Products CSV
          </button>
          <button
            onClick={() => {
              downloadCSV(`nexora-sales-${new Date().toISOString().slice(0, 10)}.csv`, exportSalesCSV());
              flash("ok", "Sales exported");
            }}
            className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
          >
            <Download className="w-4 h-4" /> Sales CSV
          </button>
        </div>
      </div>

      {message && (
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm font-medium",
            message.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
          )}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition",
              tab === t.id
                ? "bg-white border border-b-white text-primary -mb-px"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ─────────────────────────────────────── */}
      {tab === "overview" && summary && (
        <div className="space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Kpi label="Stock value (cost)" value={formatCurrency(summary.totalStockValue)} />
            <Kpi label="Sales revenue" value={formatCurrency(summary.totalSalesRevenue)} />
            <Kpi
              label="Gross profit"
              value={formatCurrency(summary.grossProfit)}
              sub={`${summary.grossProfitMargin.toFixed(1)}% margin`}
              highlight
            />
            <Kpi label="Expenses recorded" value={formatCurrency(summary.totalExpenses)} />
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <Kpi label="Products" value={String(summary.totalProducts)} />
            <Kpi
              label="Low stock"
              value={String(summary.lowStockCount)}
              warn={summary.lowStockCount > 0}
            />
            <Kpi
              label="Out of stock"
              value={String(summary.outOfStockCount)}
              warn={summary.outOfStockCount > 0}
            />
          </div>

          {/* Method note */}
          <div className="bg-slate-50 border rounded-xl p-4 flex gap-3 text-sm text-slate-600">
            <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-700">How profit is calculated</p>
              <p className="mt-1">
                <strong>Gross profit</strong> = Sales revenue − Cost of goods sold (using the purchase
                cost recorded at the time of each sale). Stock is valued at last purchase cost.
                This is <strong>not net profit</strong> — operating expenses (rent, salaries, etc.)
                are tracked separately and not automatically deducted.
              </p>
            </div>
          </div>

          {/* Alerts */}
          {(lowStock.length > 0 || outOfStock.length > 0) && (
            <div className="space-y-3">
              {outOfStock.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <p className="font-medium text-red-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Out of stock ({outOfStock.length})
                  </p>
                  <ul className="mt-2 text-sm text-red-700 space-y-1">
                    {outOfStock.slice(0, 8).map((p) => (
                      <li key={p.id}>• {p.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              {lowStock.length > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <p className="font-medium text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Low stock ({lowStock.length})
                  </p>
                  <ul className="mt-2 text-sm text-amber-700 space-y-1">
                    {lowStock.slice(0, 8).map((p) => (
                      <li key={p.id}>
                        • {p.name} — {p.currentStock} {p.unit} left (threshold: {p.lowStockThreshold})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Recent sales */}
          <div>
            <h3 className="font-semibold mb-3">Recent sales</h3>
            {sales.length === 0 ? (
              <Empty text="No sales recorded yet. Go to the Sales tab to record your first sale." />
            ) : (
              <div className="bg-white border rounded-xl divide-y">
                {sales.slice(0, 8).map((s) => (
                  <div key={s.id} className="px-4 py-3 flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium">{s.date}</p>
                      <p className="text-slate-500">
                        {s.items.map((i) => `${i.productName} ×${i.quantity}`).join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(s.totalRevenue)}</p>
                      <p className="text-emerald-600 text-xs">
                        +{formatCurrency(s.grossProfit)} gross
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PRODUCTS ─────────────────────────────────────── */}
      {tab === "products" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              onClick={() => setModal("add-product")}
              className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark"
            >
              <Plus className="w-4 h-4" /> Add product
            </button>
          </div>

          {filtered.length === 0 ? (
            <Empty text="No products yet. Add your first product to start tracking stock." />
          ) : (
            <div className="bg-white border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Product</th>
                      <th className="px-4 py-3 font-medium">Stock</th>
                      <th className="px-4 py-3 font-medium">Cost</th>
                      <th className="px-4 py-3 font-medium">Sell</th>
                      <th className="px-4 py-3 font-medium">Value</th>
                      <th className="px-4 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900">{p.name}</p>
                          <p className="text-xs text-slate-400">
                            {p.category}
                            {p.sku ? ` · ${p.sku}` : ""}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "font-medium",
                              p.currentStock <= 0
                                ? "text-red-600"
                                : p.currentStock <= p.lowStockThreshold
                                  ? "text-amber-600"
                                  : "text-slate-800"
                            )}
                          >
                            {p.currentStock} {p.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{formatCurrency(p.purchasePrice)}</td>
                        <td className="px-4 py-3 text-slate-600">{formatCurrency(p.sellingPrice)}</td>
                        <td className="px-4 py-3 font-medium">
                          {formatCurrency(p.currentStock * p.purchasePrice)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${p.name}"? Historical sales are kept.`)) {
                                deleteProduct(p.id);
                                refresh();
                                flash("ok", "Product deleted");
                              }
                            }}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SALES ────────────────────────────────────────── */}
      {tab === "sales" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">{sales.length} sale(s) recorded</p>
            <button
              onClick={() => setModal("record-sale")}
              className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark"
            >
              <Plus className="w-4 h-4" /> Record sale
            </button>
          </div>

          {sales.length === 0 ? (
            <Empty text="No sales yet. Record a sale to see revenue and gross profit." />
          ) : (
            <div className="space-y-3">
              {sales.map((s) => (
                <div key={s.id} className="bg-white border rounded-xl p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-medium">{s.date}</p>
                      <ul className="mt-1 text-sm text-slate-600 space-y-0.5">
                        {s.items.map((i, idx) => (
                          <li key={idx}>
                            {i.productName} ×{i.quantity} @ {formatCurrency(i.unitPrice)}
                          </li>
                        ))}
                      </ul>
                      {s.customerNote && (
                        <p className="text-xs text-slate-400 mt-1">{s.customerNote}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold">{formatCurrency(s.totalRevenue)}</p>
                      <p className="text-xs text-slate-500">
                        Cost {formatCurrency(s.totalCost)}
                      </p>
                      <p className="text-sm text-emerald-600 font-medium">
                        Gross +{formatCurrency(s.grossProfit)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STOCK IN / OUT ───────────────────────────────── */}
      {tab === "stock" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setModal("stock-in")}
              className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark"
            >
              <ArrowDownCircle className="w-4 h-4" /> Stock in (purchase)
            </button>
            <button
              onClick={() => setModal("stock-out")}
              className="inline-flex items-center gap-1.5 border px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50"
            >
              <ArrowUpCircle className="w-4 h-4" /> Adjustment out
            </button>
          </div>
          <p className="text-sm text-slate-500">
            Use Stock In when you receive goods from a supplier. Use Adjustment Out for damage,
            theft, or personal use. Sales automatically reduce stock.
          </p>
          {products.length === 0 && (
            <Empty text="Add products first before recording stock movements." />
          )}
        </div>
      )}

      {/* ── EXPENSES ─────────────────────────────────────── */}
      {tab === "expenses" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">
              Total: {formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}
            </p>
            <button
              onClick={() => setModal("add-expense")}
              className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark"
            >
              <Plus className="w-4 h-4" /> Add expense
            </button>
          </div>
          {expenses.length === 0 ? (
            <Empty text="No expenses recorded. Track rent, transport, wages, etc." />
          ) : (
            <div className="bg-white border rounded-xl divide-y">
              {expenses.map((e) => (
                <div key={e.id} className="px-4 py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{e.description}</p>
                    <p className="text-xs text-slate-400">
                      {e.category} · {e.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{formatCurrency(e.amount)}</span>
                    <button
                      onClick={() => {
                        deleteExpense(e.id);
                        refresh();
                      }}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SUPPLIERS ────────────────────────────────────── */}
      {tab === "suppliers" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">{suppliers.length} supplier(s)</p>
            <button
              onClick={() => setModal("add-supplier")}
              className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark"
            >
              <Plus className="w-4 h-4" /> Add supplier
            </button>
          </div>
          {suppliers.length === 0 ? (
            <Empty text="No suppliers yet. Add suppliers to link them to purchases." />
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {suppliers.map((s) => (
                <div key={s.id} className="bg-white border rounded-xl p-4">
                  <p className="font-medium">{s.name}</p>
                  {s.phone && <p className="text-sm text-slate-500 mt-0.5">{s.phone}</p>}
                  {s.notes && <p className="text-xs text-slate-400 mt-1">{s.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MODALS ───────────────────────────────────────── */}
      {modal === "add-product" && (
        <AddProductModal
          suppliers={suppliers}
          onClose={() => setModal(null)}
          onSave={(data) => {
            addProduct(data);
            refresh();
            setModal(null);
            flash("ok", "Product added");
          }}
        />
      )}
      {modal === "record-sale" && (
        <RecordSaleModal
          products={products}
          onClose={() => setModal(null)}
          onSave={(data) => {
            const res = recordSale(data);
            if (res.success) {
              refresh();
              setModal(null);
              flash("ok", "Sale recorded");
            } else {
              flash("err", res.error || "Error");
            }
          }}
        />
      )}
      {modal === "stock-in" && (
        <StockInModal
          products={products}
          suppliers={suppliers}
          onClose={() => setModal(null)}
          onSave={(data) => {
            const res = recordStockIn(data);
            if (res.success) {
              refresh();
              setModal(null);
              flash("ok", "Stock added");
            } else {
              flash("err", res.error || "Error");
            }
          }}
        />
      )}
      {modal === "stock-out" && (
        <StockOutModal
          products={products}
          onClose={() => setModal(null)}
          onSave={(data) => {
            const res = recordAdjustmentOut(data);
            if (res.success) {
              refresh();
              setModal(null);
              flash("ok", "Stock adjusted");
            } else {
              flash("err", res.error || "Error");
            }
          }}
        />
      )}
      {modal === "add-expense" && (
        <AddExpenseModal
          onClose={() => setModal(null)}
          onSave={(data) => {
            addExpense(data);
            refresh();
            setModal(null);
            flash("ok", "Expense added");
          }}
        />
      )}
      {modal === "add-supplier" && (
        <AddSupplierModal
          onClose={() => setModal(null)}
          onSave={(data) => {
            addSupplier(data);
            refresh();
            setModal(null);
            flash("ok", "Supplier added");
          }}
        />
      )}
    </div>
  );
}

/* ── Small UI helpers ────────────────────────────────────── */

function Kpi({
  label,
  value,
  sub,
  highlight,
  warn,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  warn?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-white border rounded-xl p-4",
        highlight && "border-primary/30 bg-teal-50/50",
        warn && "border-amber-200 bg-amber-50/50"
      )}
    >
      <p className="text-xs text-slate-500">{label}</p>
      <p className={cn("text-lg font-bold mt-1", warn && "text-amber-700")}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="bg-white border rounded-xl p-10 text-center text-sm text-slate-500">{text}</div>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

/* ── Modals ──────────────────────────────────────────────── */

function AddProductModal({
  suppliers,
  onClose,
  onSave,
}: {
  suppliers: Supplier[];
  onClose: () => void;
  onSave: (data: Parameters<typeof addProduct>[0]) => void;
}) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [unit, setUnit] = useState("pcs");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [openingStock, setOpeningStock] = useState("0");
  const [threshold, setThreshold] = useState("5");

  return (
    <ModalShell title="Add product" onClose={onClose}>
      <Field label="Product name *">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rice 25kg" />
      </Field>
      <Field label="SKU / Code">
        <input className={inputClass} value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Optional" />
      </Field>
      <Field label="Category">
        <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
          {DEFAULT_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Unit">
          <input className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="pcs, kg..." />
        </Field>
        <Field label="Opening stock">
          <input className={inputClass} type="number" min="0" value={openingStock} onChange={(e) => setOpeningStock(e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Purchase price (XAF) *">
          <input className={inputClass} type="number" min="0" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
        </Field>
        <Field label="Selling price (XAF) *">
          <input className={inputClass} type="number" min="0" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
        </Field>
      </div>
      <Field label="Low stock threshold">
        <input className={inputClass} type="number" min="0" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
      </Field>
      <button
        disabled={!name.trim() || !purchasePrice || !sellingPrice}
        onClick={() =>
          onSave({
            name: name.trim(),
            sku: sku.trim() || undefined,
            category,
            unit,
            purchasePrice: Number(purchasePrice),
            sellingPrice: Number(sellingPrice),
            openingStock: Number(openingStock) || 0,
            lowStockThreshold: Number(threshold) || 5,
          })
        }
        className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark disabled:opacity-40"
      >
        Save product
      </button>
    </ModalShell>
  );
}

function RecordSaleModal({
  products,
  onClose,
  onSave,
}: {
  products: Product[];
  onClose: () => void;
  onSave: (data: Parameters<typeof recordSale>[0]) => void;
}) {
  const available = products.filter((p) => p.currentStock > 0);
  const [productId, setProductId] = useState(available[0]?.id || "");
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");

  const selected = products.find((p) => p.id === productId);

  useEffect(() => {
    if (selected) setPrice(String(selected.sellingPrice));
  }, [selected]);

  return (
    <ModalShell title="Record sale" onClose={onClose}>
      {available.length === 0 ? (
        <p className="text-sm text-slate-500">No products with stock available.</p>
      ) : (
        <>
          <Field label="Product *">
            <select className={inputClass} value={productId} onChange={(e) => setProductId(e.target.value)}>
              {available.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.currentStock} {p.unit} left)
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity *">
              <input className={inputClass} type="number" min="1" max={selected?.currentStock} value={qty} onChange={(e) => setQty(e.target.value)} />
            </Field>
            <Field label="Unit price (XAF)">
              <input className={inputClass} type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
            </Field>
          </div>
          {selected && (
            <p className="text-xs text-slate-500 mb-3">
              Cost at sale: {formatCurrency(selected.purchasePrice)} / {selected.unit} · Est. gross:{" "}
              {formatCurrency((Number(price) - selected.purchasePrice) * Number(qty || 0))}
            </p>
          )}
          <Field label="Note">
            <input className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
          </Field>
          <button
            disabled={!productId || Number(qty) <= 0}
            onClick={() =>
              onSave({
                items: [{ productId, quantity: Number(qty), unitPrice: Number(price) || undefined }],
                customerNote: note || undefined,
              })
            }
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark disabled:opacity-40"
          >
            Record sale
          </button>
        </>
      )}
    </ModalShell>
  );
}

function StockInModal({
  products,
  suppliers,
  onClose,
  onSave,
}: {
  products: Product[];
  suppliers: Supplier[];
  onClose: () => void;
  onSave: (data: Parameters<typeof recordStockIn>[0]) => void;
}) {
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [qty, setQty] = useState("1");
  const [cost, setCost] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [note, setNote] = useState("");

  const selected = products.find((p) => p.id === productId);
  useEffect(() => {
    if (selected) setCost(String(selected.purchasePrice));
  }, [selected]);

  return (
    <ModalShell title="Stock in (purchase)" onClose={onClose}>
      {products.length === 0 ? (
        <p className="text-sm text-slate-500">Add products first.</p>
      ) : (
        <>
          <Field label="Product *">
            <select className={inputClass} value={productId} onChange={(e) => setProductId(e.target.value)}>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity *">
              <input className={inputClass} type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
            </Field>
            <Field label="Unit cost (XAF) *">
              <input className={inputClass} type="number" min="0" value={cost} onChange={(e) => setCost(e.target.value)} />
            </Field>
          </div>
          {suppliers.length > 0 && (
            <Field label="Supplier">
              <select className={inputClass} value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                <option value="">— None —</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </Field>
          )}
          <Field label="Note">
            <input className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <button
            disabled={!productId || Number(qty) <= 0 || cost === ""}
            onClick={() =>
              onSave({
                productId,
                quantity: Number(qty),
                unitCost: Number(cost),
                supplierId: supplierId || undefined,
                note: note || undefined,
              })
            }
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark disabled:opacity-40"
          >
            Add stock
          </button>
        </>
      )}
    </ModalShell>
  );
}

function StockOutModal({
  products,
  onClose,
  onSave,
}: {
  products: Product[];
  onClose: () => void;
  onSave: (data: Parameters<typeof recordAdjustmentOut>[0]) => void;
}) {
  const available = products.filter((p) => p.currentStock > 0);
  const [productId, setProductId] = useState(available[0]?.id || "");
  const [qty, setQty] = useState("1");
  const [note, setNote] = useState("");

  return (
    <ModalShell title="Adjustment out" onClose={onClose}>
      {available.length === 0 ? (
        <p className="text-sm text-slate-500">No products with stock.</p>
      ) : (
        <>
          <Field label="Product *">
            <select className={inputClass} value={productId} onChange={(e) => setProductId(e.target.value)}>
              {available.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.currentStock} left)
                </option>
              ))}
            </select>
          </Field>
          <Field label="Quantity *">
            <input className={inputClass} type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
          </Field>
          <Field label="Reason">
            <input className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Damage, personal use..." />
          </Field>
          <button
            disabled={!productId || Number(qty) <= 0}
            onClick={() => onSave({ productId, quantity: Number(qty), note: note || undefined })}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark disabled:opacity-40"
          >
            Confirm adjustment
          </button>
        </>
      )}
    </ModalShell>
  );
}

function AddExpenseModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: { category: string; description: string; amount: number; date: string }) => void;
}) {
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <ModalShell title="Add expense" onClose={onClose}>
      <Field label="Category">
        <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </Field>
      <Field label="Description *">
        <input className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Shop rent March" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Amount (XAF) *">
          <input className={inputClass} type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Date">
          <input className={inputClass} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
      </div>
      <button
        disabled={!description.trim() || !amount}
        onClick={() =>
          onSave({
            category,
            description: description.trim(),
            amount: Number(amount),
            date,
          })
        }
        className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark disabled:opacity-40"
      >
        Save expense
      </button>
    </ModalShell>
  );
}

function AddSupplierModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: { name: string; phone?: string; notes?: string }) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <ModalShell title="Add supplier" onClose={onClose}>
      <Field label="Name *">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Phone / WhatsApp">
        <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+237..." />
      </Field>
      <Field label="Notes">
        <input className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>
      <button
        disabled={!name.trim()}
        onClick={() => onSave({ name: name.trim(), phone: phone || undefined, notes: notes || undefined })}
        className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark disabled:opacity-40"
      >
        Save supplier
      </button>
    </ModalShell>
  );
}
