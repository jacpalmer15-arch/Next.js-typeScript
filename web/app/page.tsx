import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function Home() {
  return (
    <main className="min-h-dvh bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-6xl p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Xeinth Admin</h1>
          <div className="space-x-2">
            <Button>New</Button>
            <Button variant="outline">Sync</Button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Products</CardTitle></CardHeader>
            <CardContent>List, search, and toggle kiosk visibility.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
            <CardContent>Stock levels and low-stock alerts.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Sync</CardTitle></CardHeader>
            <CardContent>Run product / inventory syncs.</CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

