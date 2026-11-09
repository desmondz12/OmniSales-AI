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
      description: "iPhone 15 Pro (256 Go, Titane Noir)",
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
        description: "Accessoire / Service d'expédition Douala-Yaoundé",
        quantity: 1,
        unitPrice: 15000,
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
      .map((it) => `• ${it.quantity}x ${it.description} — ${(it.quantity * it.unitPrice).toLocaleString("fr-FR")} FCFA`)
      .join("\n");

    const message = `📄 Facture Officielle #${invNumber} émise pour ${customer.name} :\n\n${lineItemDetails}\n\nTotal Dû : ${totalAmount.toLocaleString("fr-FR")} FCFA\nDate d'échéance : ${dueDate}\nPaiement MoMo / Orange Money : https://pay.omnisales.ai/fotso/${invNumber.toLowerCase()}`;

    onInsertInvoice(message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-modal animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border-secondary pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-50 text-accent-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                Create & Dispatch Invoice
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Billed to {customer.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-tertiary hover:bg-background-secondary-default hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Line Items Table */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-primary">Line Items</span>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center text-xs font-medium text-accent-700 hover:text-accent-800"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add Item
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-2 rounded-2xl border border-border-button-default bg-background-secondary-default p-2 text-xs"
              >
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleUpdateItem(item.id, "description", e.target.value)
                  }
                  placeholder="Item description"
                  className="flex-1 rounded-xl border border-border-button-default bg-background-primary-default px-2.5 py-1.5 text-xs text-text-primary focus:outline-none"
                />
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateItem(item.id, "quantity", Number(e.target.value))
                  }
                  className="w-14 rounded-xl border border-border-button-default bg-background-primary-default px-2 py-1.5 text-xs text-text-primary text-center focus:outline-none"
                />
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleUpdateItem(item.id, "unitPrice", Number(e.target.value))
                  }
                  className="w-24 rounded-xl border border-border-button-default bg-background-primary-default px-2.5 py-1.5 text-xs text-text-primary text-right focus:outline-none"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-text-tertiary hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Due date input */}
          <div className="flex items-center justify-between pt-2">
            <label className="text-xs font-medium text-text-secondary">
              Payment Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-xl border border-border-button-default bg-background-secondary-default px-2.5 py-1 text-xs text-text-primary focus:outline-none"
            />
          </div>

          {/* Total summary */}
          <div className="rounded-2xl border border-border-button-default bg-background-secondary-default p-3.5 flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">Montant Total Facture :</span>
            <span className="text-base font-semibold text-text-primary">
              {totalAmount.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end space-x-2.5 border-t border-border-secondary pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs rounded-full border-border-button-default text-text-secondary hover:text-text-primary"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSendInvoice}
            className="rounded-full bg-accent-600 hover:bg-accent-700 text-white font-medium text-xs shadow-xs"
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Send Invoice to Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
