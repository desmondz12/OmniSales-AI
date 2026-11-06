"use client";

import * as React from "react";
import {
  FileText,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types/database";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onInsertInvoice: (invoiceMessage: string) => void;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

function getInitialDueDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
}

function generateInvoiceCode(): string {
  return `INV-${Date.now().toString().slice(-4)}`;
}

export function InvoiceModal({
  isOpen,
  onClose,
  customer,
  onInsertInvoice,
}: InvoiceModalProps) {
  const [items, setItems] = React.useState<LineItem[]>([
    {
      id: "item-1",
      description: "iPhone 15 Pro (256GB, Black Titanium)",
      quantity: 1,
      unitPrice: 550000,
    },
  ]);
  const [dueDate, setDueDate] = React.useState<string>(getInitialDueDate);

  if (!isOpen || !customer) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${prev.length + 1}-${Date.now()}`,
        description: "Additional accessory / service",
        quantity: 1,
        unitPrice: 25000,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: "description" | "quantity" | "unitPrice",
    val: string | number
  ) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: val } : it))
    );
  };

  const handleSendInvoice = () => {
    const invNumber = generateInvoiceCode();
    const lineItemDetails = items
      .map((it) => `• ${it.quantity}x ${it.description} — ₦${(it.quantity * it.unitPrice).toLocaleString()}`)
      .join("\n");

    const message = `📄 Formal Invoice #${invNumber} generated for ${customer.name}:\n\n${lineItemDetails}\n\nTotal Due: ₦${totalAmount.toLocaleString()}\nDue Date: ${dueDate}\nPayment Link: https://pay.omnisales.ai/musa/${invNumber.toLowerCase()}`;

    onInsertInvoice(message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Create & Dispatch Invoice
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Billed to {customer.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Line Items Table */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Line Items</span>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add Item
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs"
              >
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleUpdateItem(item.id, "description", e.target.value)
                  }
                  placeholder="Item description"
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                />
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateItem(item.id, "quantity", Number(e.target.value))
                  }
                  className="w-14 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 text-center focus:outline-none"
                />
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleUpdateItem(item.id, "unitPrice", Number(e.target.value))
                  }
                  className="w-24 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 text-right focus:outline-none"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Due date input */}
          <div className="flex items-center justify-between pt-2">
            <label className="text-xs font-semibold text-slate-700">
              Payment Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-1 text-xs text-slate-800 focus:outline-none"
            />
          </div>

          {/* Total summary */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Total Invoice Amount:</span>
            <span className="text-base font-bold text-slate-900">
              ₦{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end space-x-2.5 border-t border-slate-100 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs rounded-xl"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSendInvoice}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Send Invoice to Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
