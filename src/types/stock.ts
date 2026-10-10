export type MovementType = "opening" | "purchase" | "sale" | "adjustment_in" | "adjustment_out" | "return";

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  notes?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
  category: string;
  unit: string; // e.g. pcs, kg, litre, pack
  purchasePrice: number; // last known cost (XAF)
  sellingPrice: number;
  currentStock: number;
  lowStockThreshold: number;
  supplierId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number; // always positive; direction determined by type
  unitCost?: number; // for purchases / opening
  unitPrice?: number; // for sales
  totalAmount?: number;
  supplierId?: string;
  note?: string;
  date: string; // ISO date
  createdAt: string;
}

export interface Sale {
  id: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    unitCost: number; // cost at time of sale (for gross profit)
    lineTotal: number;
    lineCost: number;
  }[];
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  paymentMethod?: string;
  customerNote?: string;
  date: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface StockStore {
  products: Product[];
  movements: StockMovement[];
  sales: Sale[];
  expenses: Expense[];
  suppliers: Supplier[];
  version: number;
}

export interface InventorySummary {
  totalProducts: number;
  totalStockValue: number; // at cost
  totalPotentialRevenue: number; // at selling price
  lowStockCount: number;
  outOfStockCount: number;
  totalSalesRevenue: number;
  totalCostOfGoodsSold: number;
  grossProfit: number;
  grossProfitMargin: number; // %
  totalExpenses: number;
  // Note: Net profit is NOT calculated automatically because
  // many operating costs may not be recorded. We only show gross.
}

export const DEFAULT_CATEGORIES = [
  "Food & Groceries",
  "Beverages",
  "Household",
  "Personal Care",
  "Electronics",
  "Clothing",
  "Pharmacy",
  "Stationery",
  "Building Materials",
  "Other",
];

export const EXPENSE_CATEGORIES = [
  "Rent",
  "Transport",
  "Salaries / Wages",
  "Utilities",
  "Packaging",
  "Marketing",
  "Repairs",
  "Taxes / Fees",
  "Other",
];
