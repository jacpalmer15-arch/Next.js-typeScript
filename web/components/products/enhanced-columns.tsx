'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';

function KioskToggle({ product }: { product: Product }) {
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (checked: boolean) =>
      api.products.update(product.clover_item_id, { visible_in_kiosk: checked }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Updated');
    },
    onError: (e: Error) => toast.error(typeof e === 'string' ? e : 'Update failed'),
  });

  return (
    <Switch
      checked={!!product.visible_in_kiosk}
      onCheckedChange={(checked) => m.mutate(checked)}
      disabled={m.isPending}
    />
  );
}

function InlineEditCell({ 
  product, 
  field, 
  value 
}: { 
  product: Product; 
  field: keyof Product; 
  value: string | number | null | undefined;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || '');
  const qc = useQueryClient();
  
  const m = useMutation({
    mutationFn: (newValue: string) => {
      let processedValue: string | number | null = newValue;
      
      // Handle numeric fields
      if (field === 'price' && newValue !== '') {
        processedValue = Number(newValue);
      }
      
      // Handle empty strings as null for optional fields
      if (newValue === '' && (field === 'category' || field === 'sku' || field === 'upc')) {
        processedValue = null;
      }
      
      return api.products.update(product.clover_item_id, { [field]: processedValue });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      setIsEditing(false);
      toast.success('Updated');
    },
    onError: (e: Error) => {
      toast.error(typeof e === 'string' ? e : 'Update failed');
      setIsEditing(false);
      setEditValue(value?.toString() || '');
    },
  });

  const handleSave = () => {
    if (editValue !== (value?.toString() || '')) {
      m.mutate(editValue);
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value?.toString() || '');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-8 w-full"
        type={field === 'price' ? 'number' : 'text'}
        autoFocus
        disabled={m.isPending}
      />
    );
  }

  return (
    <div
      className="cursor-pointer hover:bg-gray-100 rounded px-2 py-1 min-h-[2rem] flex items-center"
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {field === 'price' && value ? `$${(Number(value) / 100).toFixed(2)}` : value || '—'}
    </div>
  );
}

export const enhancedProductColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center justify-between">
        <Link
          href={`/products/${row.original.clover_item_id}`}
          className="text-blue-600 hover:underline flex-1"
        >
          {row.original.name}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <InlineEditCell
        product={row.original}
        field="category"
        value={row.original.category}
      />
    ),
  },
  {
    accessorKey: 'upc',
    header: 'UPC',
    cell: ({ row }) => (
      <InlineEditCell
        product={row.original}
        field="upc"
        value={row.original.upc}
      />
    ),
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ row }) => (
      <InlineEditCell
        product={row.original}
        field="sku"
        value={row.original.sku}
      />
    ),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => (
      <InlineEditCell
        product={row.original}
        field="price"
        value={row.original.price}
      />
    ),
  },
  {
    id: 'kiosk',
    header: 'Kiosk',
    cell: ({ row }) => <KioskToggle product={row.original} />,
  },
];

// Keep the original columns for backward compatibility
export const productColumns = enhancedProductColumns;