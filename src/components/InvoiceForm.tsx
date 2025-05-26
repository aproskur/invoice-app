"use client";

import React, { useState, useEffect } from "react";
import { InvoiceFormProps, InvoiceItemInput, InvoiceInput } from "@/types/invoice";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useUIStore } from "@/store/uiStore";
import CalendarIcon from "@/assets/icon-calendar.svg";
import ArrowDownIcon from "@/assets/icon-arrow-down.svg";
import DeleteIcon from "@/assets/icon-delete.svg";



export default function InvoiceForm({ invoice, mode, onCancel, onSubmit }: InvoiceFormProps) {
  const { setDraft, clearDraft } = useInvoiceStore();
  const showForm = useUIStore((state) => state.showForm);
  const closeForm = useUIStore((state) => state.closeForm);
  const draft = useInvoiceStore((state) => state.draft);

  const [form, setForm] = useState<InvoiceInput>(
    draft ||
    invoice || {
      description: "",
      status: "draft",
      invoiceDate: "",
      paymentDue: "",
      clientName: "",
      clientEmail: "",
      senderAddress: { street: "", city: "", postCode: "", country: "" },
      clientAddress: { street: "", city: "", postCode: "", country: "" },
      items: [],
    }
  );

  useEffect(() => {
    setDraft(form);
  }, [form, setDraft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItemInput, value: string | number) => {
    const updatedItems = [...form.items];
    updatedItems[index] = { ...updatedItems[index], [field]: field === "quantity" || field === "price" ? Number(value) : value };
    setForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    const updatedItems = [...form.items];
    updatedItems.splice(index, 1);
    setForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearDraft();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="dark:bg-background space-y-6 rounded-xl">
      <h2 className="text-2xl font-bold">
        {mode === "edit" ? `Edit #${invoice?.id}` : "New Invoice"}
      </h2>
      <h3 className="text-primary font-bold">Bill From</h3>

{/* Row 1: Street Address */}
<div className="grid grid-cols-1 gap-2 mb-4">
  <label htmlFor="senderStreet" className="text-gray-500 text-xs font-medium">
    Street Address
  </label>
  <input
    id="senderStreet"
    type="text"
    name="senderStreet"
    value={form.senderAddress.street}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        senderAddress: { ...prev.senderAddress, street: e.target.value },
      }))
    }
    className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded w-full"
  />
</div>

{/* Row 2: City, Postcode, Country */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* City */}
  <div className="flex flex-col gap-2">
    <label htmlFor="senderCity" className="text-gray-500 text-xs font-medium">
      City
    </label>
    <input
      id="senderCity"
      type="text"
      name="senderCity"
      value={form.senderAddress.city}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          senderAddress: { ...prev.senderAddress, city: e.target.value },
        }))
      }
      className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded w-full"
    />
  </div>

  {/* Post Code */}
  <div className="flex flex-col gap-2">
    <label htmlFor="senderPostCode" className="text-gray-500 text-xs font-medium">
      Post Code
    </label>
    <input
      id="senderPostCode"
      type="text"
      name="senderPostCode"
      value={form.senderAddress.postCode}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          senderAddress: { ...prev.senderAddress, postCode: e.target.value },
        }))
      }
      className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded w-full"
    />
  </div>

  {/* Country */}
  <div className="flex flex-col gap-2">
    <label htmlFor="senderCountry" className="text-gray-500 text-xs font-medium">
      Country
    </label>
    <input
      id="senderCountry"
      type="text"
      name="senderCountry"
      value={form.senderAddress.country}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          senderAddress: { ...prev.senderAddress, country: e.target.value },
        }))
      }
      className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded w-full"
    />
  </div>
</div>


<h3 className="text-primary font-bold mt-8">Bill To</h3>

{/* Client's Name */}
<div className="grid grid-cols-1 gap-2 mb-4">
  <label htmlFor="clientName" className="text-gray-500 text-xs font-medium">
    Client's Name
  </label>
  <input
    id="clientName"
    type="text"
    name="clientName"
    value={form.clientName}
    onChange={handleChange}
    className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded w-full"
  />
</div>

{/* Client's Email */}
<div className="grid grid-cols-1 gap-2 mb-4">
  <label htmlFor="clientEmail" className="text-gray-500 text-xs font-medium">
    Client's Email
  </label>
  <input
    id="clientEmail"
    type="email"
    name="clientEmail"
    value={form.clientEmail}
    onChange={handleChange}
    className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded w-full"
  />
</div>

{/* Street Address */}
<div className="grid grid-cols-1 gap-2 mb-4">
  <label htmlFor="clientStreet" className="text-gray-500 text-xs font-medium">
    Street Address
  </label>
  <input
    id="clientStreet"
    type="text"
    name="clientStreet"
    value={form.clientAddress.street}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        clientAddress: { ...prev.clientAddress, street: e.target.value },
      }))
    }
    className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded w-full"
  />
</div>

{/* City, Post Code, Country */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
  <div className="flex flex-col gap-2">
    <label htmlFor="clientCity" className="text-gray-500 text-xs font-medium">
      City
    </label>
    <input
      id="clientCity"
      type="text"
      name="clientCity"
      value={form.clientAddress.city}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          clientAddress: { ...prev.clientAddress, city: e.target.value },
        }))
      }
      className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded w-full"
    />
  </div>
  <div className="flex flex-col gap-2">
    <label htmlFor="clientPostCode" className="text-gray-500 text-xs font-medium">
      Post Code
    </label>
    <input
      id="clientPostCode"
      type="text"
      name="clientPostCode"
      value={form.clientAddress.postCode}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          clientAddress: { ...prev.clientAddress, postCode: e.target.value },
        }))
      }
      className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded w-full"
    />
  </div>
  <div className="flex flex-col gap-2">
    <label htmlFor="clientCountry" className="text-gray-500 text-xs font-medium">
      Country
    </label>
    <input
      id="clientCountry"
      type="text"
      name="clientCountry"
      value={form.clientAddress.country}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          clientAddress: { ...prev.clientAddress, country: e.target.value },
        }))
      }
      className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded w-full"
    />
  </div>
</div>

{/* Invoice Date & Payment Terms */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
  {/* Invoice Date */}
  <div className="flex flex-col gap-2">
    <label htmlFor="invoiceDate" className="text-gray-500 text-xs font-medium">
      Invoice Date
    </label>
    <input
      id="invoiceDate"
      type="date"
      name="invoiceDate"
      value={form.invoiceDate}
      onChange={handleChange}
      className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded w-full h-[42px] text-sm"
    />
  </div>

  {/* Payment Terms */}
  <div className="flex flex-col gap-2">
    <label htmlFor="paymentTerms" className="text-gray-500 text-xs font-medium">
      Payment Terms
    </label>
    <select
      id="paymentTerms"
      name="paymentTerms"
      value={form.paymentTerms}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          paymentTerms: e.target.value,
        }))
      }
      className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded w-full h-[42px] text-sm"
    >
      <option value="Net 7">Net 7 Days</option>
      <option value="Net 14">Net 14 Days</option>
      <option value="Net 30">Net 30 Days</option>
    </select>
  </div>
</div>


{/* Project Description */}
<div className="grid grid-cols-1 gap-2 mb-4">
  <label htmlFor="description" className="text-gray-500 text-xs font-medium">
    Project Description
  </label>
  <input
    id="description"
    type="text"
    name="description"
    value={form.description}
    onChange={handleChange}
    className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded w-full"
  />
</div>


<h3 className="text-gray-400 font-bold mt-8">Item List</h3>

<div className="mb-2 grid grid-cols-4 gap-2 text-gray-500 text-xs font-medium">
  <span>Item Name</span>
  <span>Qty.</span>
  <span>Price</span>
  <span>Total</span>
</div>

<div>
  {form.items.map((item, index) => (
    <div key={index} className="grid grid-cols-4 gap-2 items-center mb-2">
      <input
        type="text"
        value={item.name}
        onChange={(e) => handleItemChange(index, "name", e.target.value)}
        className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded text-sm"
      />
      <input
        type="number"
        value={item.quantity}
        onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
        className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded text-sm"
      />
      <input
        type="number"
        value={item.price}
        onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
        className="dark:bg-panel-dark border border-gray-200 dark:border-panel-dark p-2 rounded text-sm"
      />
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700 dark:text-foreground">
          {item.quantity * item.price || 0}
        </span>
        <button type="button" onClick={() => removeItem(index)} className="ml-2">
          <DeleteIcon className="dark:w-4 h-4 text-gray-400 dark:text-foreground hover:text-red-500" />
        </button>
      </div>
    </div>
  ))}

  {/* Add Item Button */}
  <div className="flex justify-center mt-4">
    <button
      type="button"
      onClick={addItem}
      className="text-gray-500 text-sm font-medium dark:flex dark:justify-center dark:items-center dark:w-full dark:p-2 dark:rounded-full dark:bg-panel-dark dark:border dark:border-panel-dark dark:text-foreground"
      >
      + Add New Item
    </button>
  </div>
</div>



<div className="flex justify-end items-center mt-8 gap-6">  {/* Left: Discard / Cancel */}
  <button
    type="button"
    onClick={onCancel}
    className="dark:bg-panel-dark dark:border dark:border-panel-dark dark:px-4 dark:py-2 dark:rounded-full text-gray-500 dark:text-foreground text-sm font-medium"
  >
    {mode === "edit" ? "Cancel" : "Discard"}
  </button>

  {/* Right: Save Buttons */}
  <div className="flex gap-4">
    {mode === "create" && (
      <button
        type="submit"
        className="px-4 py-2 rounded-full bg-black text-gray-200 text-sm font-medium"
      >
        Save as Draft
      </button>
    )}
    <button
      type="submit"
      className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium"
    >
      {mode === "edit" ? "Save Changes" : "Save & Send"}
    </button>
  </div>
</div>

    </form>
  );
}
