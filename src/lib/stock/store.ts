"use client";

import { v4 as uuidv4 } from "uuid";
import {
  Product,
  StockMovement,
  Sale,
  Expense,
  Supplier,
  StockStore,
  InventorySummary,
  MovementType,
} from "@/types/stock";

const STORAGE_KEY = "nexora_stock_tracker_v1";

function emptyStore(): StockStore {
  return {
    products: [],
    movements: [],
    sales: [],
    expenses: [],
    suppliers: [],
    version: 1,
  };
}

export function loadStore(): StockStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    return JSON.parse(raw) as StockStore;
  } catch {
    return emptyStore();
  }
}

export function saveStore(store: StockStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ── Products ──────────────────────────────────────────────

export function addProduct(
  data: Omit<Product, "id" | "currentStock" | "createdAt" | "updatedAt"> & {
    openingStock?: number;
  }
): Product {
  const store = loadStore();
  const now = new Date().toISOString();
  const product: Product = {
    id: uuidv4(),
    name: data.name,
    sku: data.sku,
    category: data.category,
    unit: data.unit || "pcs",
    purchasePrice: data.purchasePrice,
    sellingPrice: data.sellingPrice,
    currentStock: data.openingStock ?? 0,
    lowStockThreshold: data.lowStockThreshold ?? 5,
    supplierId: data.supplierId,
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
  };
  store.products.push(product);

  if ((data.openingStock ?? 0) > 0) {
    const movement: StockMovement = {
      id: uuidv4(),
      productId: product.id,
      type: "opening",
      quantity: data.openingStock!,
      unitCost: data.purchasePrice,
      totalAmount: data.openingStock! * data.purchasePrice,
      date: now.slice(0, 10),
      createdAt: now,
      note: "Opening stock",
    };
    store.movements.push(movement);
  }

  saveStore(store);
  return product;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const store = loadStore();
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  store.products[idx] = {
    ...store.products[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveStore(store);
  return store.products[idx];
}

export function deleteProduct(id: string) {
  const store = loadStore();
  store.products = store.products.filter((p) => p.id !== id);
  // Keep historical movements/sales for reporting integrity
  saveStore(store);
}

// ── Stock movements (purchase / adjustment) ───────────────

export function recordStockIn(params: {
  productId: string;
  quantity: number;
  unitCost: number;
  type?: "purchase" | "adjustment_in" | "return";
  supplierId?: string;
  note?: string;
  date?: string;
}): { success: boolean; error?: string; movement?: StockMovement } {
  if (params.quantity <= 0) return { success: false, error: "Quantity must be positive" };

  const store = loadStore();
  const product = store.products.find((p) => p.id === params.productId);
  if (!product) return { success: false, error: "Product not found" };

  const now = new Date().toISOString();
  const movement: StockMovement = {
    id: uuidv4(),
    productId: params.productId,
    type: params.type || "purchase",
    quantity: params.quantity,
    unitCost: params.unitCost,
    totalAmount: params.quantity * params.unitCost,
    supplierId: params.supplierId,
    note: params.note,
    date: params.date || now.slice(0, 10),
    createdAt: now,
  };

  store.movements.push(movement);
  product.currentStock += params.quantity;
  product.purchasePrice = params.unitCost; // update last cost
  product.updatedAt = now;
  saveStore(store);
  return { success: true, movement };
}

export function recordAdjustmentOut(params: {
  productId: string;
  quantity: number;
  note?: string;
  date?: string;
}): { success: boolean; error?: string } {
  if (params.quantity <= 0) return { success: false, error: "Quantity must be positive" };

  const store = loadStore();
  const product = store.products.find((p) => p.id === params.productId);
  if (!product) return { success: false, error: "Product not found" };
  if (product.currentStock < params.quantity) {
    return { success: false, error: `Insufficient stock. Available: ${product.currentStock}` };
  }

  const now = new Date().toISOString();
  store.movements.push({
    id: uuidv4(),
    productId: params.productId,
    type: "adjustment_out",
    quantity: params.quantity,
    unitCost: product.purchasePrice,
    note: params.note || "Stock adjustment (out)",
    date: params.date || now.slice(0, 10),
    createdAt: now,
  });
  product.currentStock -= params.quantity;
  product.updatedAt = now;
  saveStore(store);
  return { success: true };
}

// ── Sales ─────────────────────────────────────────────────

export function recordSale(params: {
  items: { productId: string; quantity: number; unitPrice?: number }[];
  paymentMethod?: string;
  customerNote?: string;
  date?: string;
}): { success: boolean; error?: string; sale?: Sale } {
  const store = loadStore();
  const now = new Date().toISOString();
  const date = params.date || now.slice(0, 10);

  const saleItems: Sale["items"] = [];
  let totalRevenue = 0;
  let totalCost = 0;

  for (const item of params.items) {
    if (item.quantity <= 0) return { success: false, error: "Quantity must be positive" };
    const product = store.products.find((p) => p.id === item.productId);
    if (!product) return { success: false, error: `Product not found` };
    if (product.currentStock < item.quantity) {
      return {
        success: false,
        error: `Insufficient stock for "${product.name}". Available: ${product.currentStock}`,
      };
    }

    const unitPrice = item.unitPrice ?? product.sellingPrice;
    const unitCost = product.purchasePrice;
    const lineTotal = unitPrice * item.quantity;
    const lineCost = unitCost * item.quantity;

    saleItems.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice,
      unitCost,
      lineTotal,
      lineCost,
    });
    totalRevenue += lineTotal;
    totalCost += lineCost;
  }

  // Apply stock reductions + movements
  for (const item of saleItems) {
    const product = store.products.find((p) => p.id === item.productId)!;
    product.currentStock -= item.quantity;
    product.updatedAt = now;

    store.movements.push({
      id: uuidv4(),
      productId: item.productId,
      type: "sale",
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      unitCost: item.unitCost,
      totalAmount: item.lineTotal,
      date,
      createdAt: now,
      note: "Sale",
    });
  }

  const sale: Sale = {
    id: uuidv4(),
    items: saleItems,
    totalRevenue,
    totalCost,
    grossProfit: totalRevenue - totalCost,
    paymentMethod: params.paymentMethod,
    customerNote: params.customerNote,
    date,
    createdAt: now,
  };
  store.sales.push(sale);
  saveStore(store);
  return { success: true, sale };
}

// ── Expenses ──────────────────────────────────────────────

export function addExpense(data: Omit<Expense, "id" | "createdAt">): Expense {
  const store = loadStore();
  const expense: Expense = {
    id: uuidv4(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  store.expenses.push(expense);
  saveStore(store);
  return expense;
}

export function deleteExpense(id: string) {
  const store = loadStore();
  store.expenses = store.expenses.filter((e) => e.id !== id);
  saveStore(store);
}

// ── Suppliers ─────────────────────────────────────────────

export function addSupplier(data: Omit<Supplier, "id" | "createdAt">): Supplier {
  const store = loadStore();
  const supplier: Supplier = {
    id: uuidv4(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  store.suppliers.push(supplier);
  saveStore(store);
  return supplier;
}

// ── Summary & calculations ────────────────────────────────

/**
 * Inventory costing method: Last Purchase Cost (LPC).
 * Current stock is valued at each product's latest purchasePrice.
 * Gross profit on sales uses the unit cost recorded at the moment of sale.
 * This is transparent and suitable for small shops. Limitations are disclosed in the UI.
 */
export function getSummary(): InventorySummary {
  const store = loadStore();

  let totalStockValue = 0;
  let totalPotentialRevenue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  for (const p of store.products) {
    totalStockValue += p.currentStock * p.purchasePrice;
    totalPotentialRevenue += p.currentStock * p.sellingPrice;
    if (p.currentStock <= 0) outOfStockCount++;
    else if (p.currentStock <= p.lowStockThreshold) lowStockCount++;
  }

  const totalSalesRevenue = store.sales.reduce((s, sale) => s + sale.totalRevenue, 0);
  const totalCostOfGoodsSold = store.sales.reduce((s, sale) => s + sale.totalCost, 0);
  const grossProfit = totalSalesRevenue - totalCostOfGoodsSold;
  const grossProfitMargin =
    totalSalesRevenue > 0 ? (grossProfit / totalSalesRevenue) * 100 : 0;
  const totalExpenses = store.expenses.reduce((s, e) => s + e.amount, 0);

  return {
    totalProducts: store.products.length,
    totalStockValue,
    totalPotentialRevenue,
    lowStockCount,
    outOfStockCount,
    totalSalesRevenue,
    totalCostOfGoodsSold,
    grossProfit,
    grossProfitMargin,
    totalExpenses,
  };
}

export function getLowStockProducts(): Product[] {
  return loadStore().products.filter(
    (p) => p.currentStock > 0 && p.currentStock <= p.lowStockThreshold
  );
}

export function getOutOfStockProducts(): Product[] {
  return loadStore().products.filter((p) => p.currentStock <= 0);
}

// ── Export helpers ────────────────────────────────────────

export function exportProductsCSV(): string {
  const store = loadStore();
  const headers = [
    "Name",
    "SKU",
    "Category",
    "Unit",
    "Purchase Price (XAF)",
    "Selling Price (XAF)",
    "Current Stock",
    "Stock Value (XAF)",
    "Low Stock Threshold",
  ];
  const rows = store.products.map((p) => [
    p.name,
    p.sku || "",
    p.category,
    p.unit,
    p.purchasePrice,
    p.sellingPrice,
    p.currentStock,
    p.currentStock * p.purchasePrice,
    p.lowStockThreshold,
  ]);
  return [headers, ...rows].map((r) => r.join(",")).join("\n");
}

export function exportSalesCSV(): string {
  const store = loadStore();
  const headers = [
    "Date",
    "Sale ID",
    "Product",
    "Qty",
    "Unit Price",
    "Unit Cost",
    "Line Revenue",
    "Line Cost",
    "Line Gross Profit",
  ];
  const rows: (string | number)[][] = [];
  for (const sale of store.sales) {
    for (const item of sale.items) {
      rows.push([
        sale.date,
        sale.id.slice(0, 8),
        item.productName,
        item.quantity,
        item.unitPrice,
        item.unitCost,
        item.lineTotal,
        item.lineCost,
        item.lineTotal - item.lineCost,
      ]);
    }
  }
  return [headers, ...rows].map((r) => r.join(",")).join("\n");
}

export function downloadCSV(filename: string, content: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
