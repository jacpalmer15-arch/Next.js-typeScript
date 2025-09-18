'use client';

import { useRef, useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { FeatureFlags, MerchantProfile, CloverConnection } from '@/lib/types';
import { toast } from 'sonner';
import { Settings, Sync, Plug, Building2 } from 'lucide-react';

export default function SyncPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<string>('');
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Mock data for now - would come from APIs
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
    enableKioskMode: true,
    enableInventoryTracking: true,
    enableLowStockAlerts: true,
    enableProductRecommendations: false,
    enableReports: true,
  });

  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile>({
    businessName: 'Zenith Coffee Co.',
    contactName: 'John Smith',
    email: 'john@zenithcoffee.com',
    phone: '(555) 123-4567',
    address: {
      street: '123 Main Street',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
    },
    timezone: 'America/Los_Angeles',
    currency: 'USD',
  });

  const [cloverConnection, setCloverConnection] = useState<CloverConnection>({
    isConnected: false,
    merchantId: undefined,
    lastSyncAt: undefined,
    apiKey: undefined,
  });

  const [cloverApiKey, setCloverApiKey] = useState('');

  async function runProductSync() {
    setStatus('Starting product sync…');
    setRunning(true);
    try {
      abortRef.current = new AbortController();
      const res = await fetch('/api/products/sync', {
        method: 'POST',
        signal: abortRef.current.signal
      });
      const text = await res.text();
      if (!res.ok) setStatus(`Error ${res.status}: ${text}`);
      else {
        setStatus(text || 'Product sync complete.');
        // 🔄 refresh lists after a successful sync
        qc.invalidateQueries({ queryKey: ['products'] });
        qc.invalidateQueries({ queryKey: ['inventory'] });
        qc.invalidateQueries({ queryKey: ['inventory-low'] });
      }
    } catch (e: unknown) {
      const err = e as Error;
      setStatus(err?.name === 'AbortError' ? 'Canceled.' : String(err?.message || err));
    } finally {
      setRunning(false);
      abortRef.current = null;
    }
  }

  const handleFeatureFlagChange = (key: keyof FeatureFlags, value: boolean) => {
    setFeatureFlags(prev => ({ ...prev, [key]: value }));
    // In a real app, this would call api.settings.updateFeatureFlags
    toast.success('Feature flag updated');
  };

  const handleCloverConnect = () => {
    if (!cloverApiKey.trim()) {
      toast.error('Please enter a Clover API key');
      return;
    }
    
    // Mock connection
    setCloverConnection({
      isConnected: true,
      merchantId: 'MOCK_MERCHANT_123',
      lastSyncAt: new Date(),
      apiKey: cloverApiKey,
    });
    toast.success('Successfully connected to Clover POS');
  };

  const handleCloverDisconnect = () => {
    setCloverConnection({
      isConnected: false,
      merchantId: undefined,
      lastSyncAt: undefined,
      apiKey: undefined,
    });
    setCloverApiKey('');
    toast.success('Disconnected from Clover POS');
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl space-y-6">
        <h1 className="text-2xl font-semibold">Sync & Settings</h1>

        {/* Sync Operations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sync className="h-5 w-5" />
              Data Synchronization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={runProductSync}
                disabled={running}
                className="flex items-center gap-2"
              >
                <Sync className={`h-4 w-4 ${running ? 'animate-spin' : ''}`} />
                {running ? 'Syncing...' : 'Sync Products'}
              </Button>
            </div>
            {status && (
              <pre className="whitespace-pre-wrap rounded border bg-gray-50 p-3 text-sm">
                {status}
              </pre>
            )}
          </CardContent>
        </Card>

        {/* Clover POS Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plug className="h-5 w-5" />
              Clover POS Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge variant={cloverConnection.isConnected ? 'default' : 'secondary'}>
                {cloverConnection.isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              {cloverConnection.merchantId && (
                <span className="text-sm text-gray-500">
                  Merchant: {cloverConnection.merchantId}
                </span>
              )}
            </div>

            {!cloverConnection.isConnected ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="clover-api-key">Clover API Key</Label>
                  <Input
                    id="clover-api-key"
                    type="password"
                    placeholder="Enter your Clover API key"
                    value={cloverApiKey}
                    onChange={(e) => setCloverApiKey(e.target.value)}
                  />
                </div>
                <Button onClick={handleCloverConnect}>Connect to Clover</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {cloverConnection.lastSyncAt && (
                  <p className="text-sm text-gray-600">
                    Last sync: {cloverConnection.lastSyncAt.toLocaleString()}
                  </p>
                )}
                <Button variant="outline" onClick={handleCloverDisconnect}>
                  Disconnect
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Feature Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="kiosk-mode">Enable Kiosk Mode</Label>
                <Switch
                  id="kiosk-mode"
                  checked={featureFlags.enableKioskMode}
                  onCheckedChange={(checked) =>
                    handleFeatureFlagChange('enableKioskMode', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="inventory-tracking">Inventory Tracking</Label>
                <Switch
                  id="inventory-tracking"
                  checked={featureFlags.enableInventoryTracking}
                  onCheckedChange={(checked) =>
                    handleFeatureFlagChange('enableInventoryTracking', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="low-stock-alerts">Low Stock Alerts</Label>
                <Switch
                  id="low-stock-alerts"
                  checked={featureFlags.enableLowStockAlerts}
                  onCheckedChange={(checked) =>
                    handleFeatureFlagChange('enableLowStockAlerts', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="product-recommendations">Product Recommendations</Label>
                <Switch
                  id="product-recommendations"
                  checked={featureFlags.enableProductRecommendations}
                  onCheckedChange={(checked) =>
                    handleFeatureFlagChange('enableProductRecommendations', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="reports">Enable Reports</Label>
                <Switch
                  id="reports"
                  checked={featureFlags.enableReports}
                  onCheckedChange={(checked) =>
                    handleFeatureFlagChange('enableReports', checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Merchant Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Merchant Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  value={merchantProfile.businessName}
                  onChange={(e) =>
                    setMerchantProfile(prev => ({ ...prev, businessName: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="contact-name">Contact Name</Label>
                <Input
                  id="contact-name"
                  value={merchantProfile.contactName}
                  onChange={(e) =>
                    setMerchantProfile(prev => ({ ...prev, contactName: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={merchantProfile.email}
                  onChange={(e) =>
                    setMerchantProfile(prev => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={merchantProfile.phone}
                  onChange={(e) =>
                    setMerchantProfile(prev => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={merchantProfile.address.street}
                  onChange={(e) =>
                    setMerchantProfile(prev => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value }
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={merchantProfile.address.city}
                  onChange={(e) =>
                    setMerchantProfile(prev => ({
                      ...prev,
                      address: { ...prev.address, city: e.target.value }
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={merchantProfile.address.state}
                  onChange={(e) =>
                    setMerchantProfile(prev => ({
                      ...prev,
                      address: { ...prev.address, state: e.target.value }
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={merchantProfile.address.zip}
                  onChange={(e) =>
                    setMerchantProfile(prev => ({
                      ...prev,
                      address: { ...prev.address, zip: e.target.value }
                    }))
                  }
                />
              </div>
            </div>
            <Button onClick={() => toast.success('Merchant profile updated')}>
              Update Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
