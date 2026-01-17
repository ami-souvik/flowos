export interface Lead {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  status: string; // Prisma string, but logically enum
  source: string | null;
  vendorId?: number | null;
  assignedVendor?: Vendor;
  notes?: string | null;
  notesList?: Note[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Note {
  id: number;
  content: string;
  createdAt: string | Date;
  leadId: number;
}

export interface Vendor {
  id: number;
  name: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  serviceType: string | null;
  createdAt?: string | Date;
}

export interface Activity {
  id: number;
  leadId: number;
  activityType: string;
  summary: string;
  description: string | null;
  date: string | Date;
  completed: boolean;
  createdAt?: string | Date;
}

export interface Product {
  id: number;
  name: string;
  code: string | null;
  costPrice: number | string;
  productPrice: number | string;
  description: string | null;
  createdAt?: string | Date;
}

export interface Quotation {
  id: number;
  leadId: number;
  lead?: Lead;
  date: string | Date;
  validUntil: string | Date | null;
  totalAmount: number | string;
  createdAt?: string | Date;
  items?: QuotationItem[];
  invoice?: Invoice;
}

export interface QuotationItem {
  id: number;
  quotationId: number;
  productId: number | null;
  product?: Product;
  description: string;
  quantity: number;
  unitPrice: number | string;
  subtotal: number | string;
}

export interface Invoice {
  id: number;
  quotationId?: number | null;
  quotation?: Quotation;
  leadId: number;
  lead?: Lead;
  invoiceDate: string | Date;
  dueDate: string | Date | null;
  amount: number | string;
  status: string;
  createdAt?: string | Date;
}

export interface Project {
  id: number;
  name: string;
  leadId: number;
  lead?: Lead;
  status: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  budget: number | string;
  items?: ProjectItem[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ProjectItem {
  id: number;
  projectId: number;
  project?: Project;
  name: string;
  description: string | null;
  category: string | null;
  vendorId?: number | null;
  vendor?: Vendor;
  costPrice: number | string;
  sellingPrice: number | string;
  status: string;
  createdAt?: string | Date;
}