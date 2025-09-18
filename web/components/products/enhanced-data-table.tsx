'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Product } from '@/lib/types';
import { ProductDetailsDrawer } from './details-drawer';
import { Eye } from 'lucide-react';

export function EnhancedDataTable<TData extends Product, TValue>({
  columns,
  data,
}: {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Add a details column
  const columnsWithDetails: ColumnDef<TData, TValue>[] = [
    ...columns,
    {
      id: 'details',
      header: '',
      cell: ({ row }) => (
        <button
          onClick={() => {
            setSelectedProductId(row.original.clover_item_id);
            setIsDrawerOpen(true);
          }}
          className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="View details"
        >
          <Eye size={16} />
        </button>
      ),
    } as ColumnDef<TData, TValue>,
  ];

  const table = useReactTable({
    data,
    columns: columnsWithDetails,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProductId(null);
  };

  return (
    <>
      <div className="space-y-3">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map(hg => (
                <TableRow key={hg.id}>
                  {hg.headers.map(header => (
                    <TableHead
                      key={header.id}
                      onClick={header.id !== 'details' ? header.column.getToggleSortingHandler() : undefined}
                      className={header.id !== 'details' ? "cursor-pointer select-none" : "w-12"}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.id !== 'details' && 
                        ({ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string] ?? null)
                      }
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="space-x-2">
            <button
              className="rounded border px-2 py-1 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </button>
            <button
              className="rounded border px-2 py-1 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ProductDetailsDrawer
        productId={selectedProductId}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
}