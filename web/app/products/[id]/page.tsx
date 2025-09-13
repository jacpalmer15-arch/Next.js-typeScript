'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Schema = z.object({
  name: z.string().min(1, 'Required'),
  category: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  upc: z.string().optional().nullable(),
  visible_in_kiosk: z.boolean().optional(),
  // NOTE: no coerce here to keep resolver types aligned with RHF
  price: z.number().optional().nullable(),
});
type FormData = z.infer<typeof Schema>;

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.products.get(id),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    // Make the resolver generics explicit so TS knows output matches FormData
    resolver: zodResolver(Schema),
    defaultValues: {
      name: '',
      category: '',
      sku: '',
      upc: '',
      visible_in_kiosk: false,
      price: undefined,
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        category: data.category ?? '',
        sku: data.sku ?? '',
        upc: data.upc ?? '',
        visible_in_kiosk: !!data.visible_in_kiosk,
        price: data.price ?? undefined,
      });
    }
  }, [data, reset]);

  const m = useMutation({
    mutationFn: (values: FormData) => {
      // Guard against NaN if the field was cleared
      const clean: FormData = {
        ...values,
        price:
          values.price === null || values.price === undefined || Number.isNaN(Number(values.price))
            ? undefined
            : values.price,
      };
      return api.products.update(id, clean);
    },
    onSuccess: () => {
      toast.success('Saved');
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['product', id] });
    },
    onError: (e: unknown) => toast.error(typeof e === 'string' ? e : 'Save failed'),
  });

  if (isLoading) return <main className="mx-auto max-w-3xl p-6">Loading…</main>;
  if (isError) return <main className="mx-auto max-w-3xl p-6 text-red-600">{String(error)}</main>;

  const vis = watch('visible_in_kiosk') ?? false;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <button className="text-sm text-blue-600 hover:underline" onClick={() => router.back()}>
        &larr; Back
      </button>
      <h1 className="mt-2 text-xl font-semibold">{data?.name}</h1>
      <p className="text-sm text-gray-500">Clover Item ID: {id}</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit((vals) => m.mutate(vals))}>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register('category')} />
          </div>
          <div>
            <Label htmlFor="price">Price (cents)</Label>
            <Input
              id="price"
              type="number"
              inputMode="numeric"
              // Convert '' -> undefined; string -> number
              {...register('price', {
                setValueAs: (v) =>
                  v === '' || v === null || v === undefined ? undefined : Number(v),
              })}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" {...register('sku')} />
          </div>
          <div>
            <Label htmlFor="upc">UPC</Label>
            <Input id="upc" {...register('upc')} />
          </div>
        </div>

        <label className="mt-2 flex items-center gap-3">
          <Switch
            checked={vis}
            onCheckedChange={(c) => setValue('visible_in_kiosk', c, { shouldDirty: true })}
          />
          <span>Visible in kiosk</span>
        </label>

        <div className="pt-4">
          <button
            type="submit"
            disabled={m.isPending || !isDirty}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {m.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </main>
  );
}
