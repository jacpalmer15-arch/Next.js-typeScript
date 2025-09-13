'use client';

import { useRef, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CloverSection } from '@/components/sync/CloverSection';
import { FeatureFlagsSection } from '@/components/sync/FeatureFlagsSection';
import { MerchantProfileSection } from '@/components/sync/MerchantProfileSection';
import { api } from '@/lib/api';
import type { CloverConnection, FeatureFlags, MerchantProfile } from '@/lib/types';

export default function SyncSettingsPage() {
  const qc = useQueryClient();
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [syncRunning, setSyncRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Queries for settings data
  const { data: cloverConnection, refetch: refetchClover } = useQuery<CloverConnection>({
    queryKey: ['clover-connection'],
    queryFn: () => api.clover.getConnection(),
  });

  const { data: featureFlags, refetch: refetchFlags } = useQuery<FeatureFlags>({
    queryKey: ['feature-flags'],
    queryFn: () => api.settings.getFeatureFlags(),
  });

  const { data: merchantProfile, refetch: refetchProfile } = useQuery<MerchantProfile>({
    queryKey: ['merchant-profile'],
    queryFn: () => api.settings.getMerchantProfile(),
  });

  // Mutations for updating settings
  const cloverConnectMutation = useMutation({
    mutationFn: (apiKey: string) => api.clover.connect(apiKey),
    onSuccess: () => {
      refetchClover();
      toast.success('Successfully connected to Clover');
    },
    onError: (error: unknown) => {
      toast.error(typeof error === 'string' ? error : 'Failed to connect to Clover');
    },
  });

  const cloverDisconnectMutation = useMutation({
    mutationFn: () => api.clover.disconnect(),
    onSuccess: () => {
      refetchClover();
      toast.success('Disconnected from Clover');
    },
    onError: (error: unknown) => {
      toast.error(typeof error === 'string' ? error : 'Failed to disconnect from Clover');
    },
  });

  const updateFeatureFlagsMutation = useMutation({
    mutationFn: (flags: FeatureFlags) => api.settings.updateFeatureFlags(flags),
    onSuccess: () => {
      refetchFlags();
      toast.success('Feature flags updated');
    },
    onError: (error: unknown) => {
      toast.error(typeof error === 'string' ? error : 'Failed to update feature flags');
    },
  });

  const updateMerchantProfileMutation = useMutation({
    mutationFn: (profile: MerchantProfile) => api.settings.updateMerchantProfile(profile),
    onSuccess: () => {
      refetchProfile();
      toast.success('Merchant profile updated');
    },
    onError: (error: unknown) => {
      toast.error(typeof error === 'string' ? error : 'Failed to update merchant profile');
    },
  });

  // Existing sync functionality (enhanced)
  async function runProductSync() {
    setSyncStatus('Starting product sync…');
    setSyncRunning(true);
    try {
      abortRef.current = new AbortController();
      const res = await fetch('/api/products/sync', { 
        method: 'POST', 
        signal: abortRef.current.signal 
      });
      const text = await res.text();
      if (!res.ok) {
        setSyncStatus(`Error ${res.status}: ${text}`);
        toast.error('Product sync failed');
      } else {
        setSyncStatus(text || 'Product sync complete.');
        toast.success('Product sync completed');
        // Refresh lists after successful sync
        qc.invalidateQueries({ queryKey: ['products'] });
        qc.invalidateQueries({ queryKey: ['inventory'] });
        qc.invalidateQueries({ queryKey: ['inventory-low'] });
      }
    } catch (e: unknown) {
      const errorMsg = (e as Error)?.name === 'AbortError' ? 'Canceled.' : String((e as Error)?.message || e);
      setSyncStatus(errorMsg);
      toast.error('Product sync failed');
    } finally { 
      setSyncRunning(false); 
      abortRef.current = null; 
    }
  }

  // Loading states
  if (!cloverConnection || !featureFlags || !merchantProfile) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <h1 className="text-2xl font-semibold mb-6">Sync & Settings</h1>
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold mb-6">Sync & Settings</h1>
      
      <div className="space-y-6">
        {/* Enhanced Sync Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Data Sync</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Sync products and inventory data with your backend systems.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={runProductSync} 
                disabled={syncRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {syncRunning ? 'Syncing...' : 'Run Product Sync'}
              </Button>
            </div>
            {syncStatus && (
              <pre className="mt-4 whitespace-pre-wrap rounded border bg-gray-50 p-3 text-sm">
                {syncStatus}
              </pre>
            )}
          </div>
        </Card>

        {/* Clover Integration Section */}
        <CloverSection
          connection={cloverConnection}
          onConnect={async (apiKey) => { await cloverConnectMutation.mutateAsync(apiKey); }}
          onDisconnect={async () => { await cloverDisconnectMutation.mutateAsync(); }}
        />

        {/* Feature Flags Section */}
        <FeatureFlagsSection
          flags={featureFlags}
          onUpdate={async (flags) => { await updateFeatureFlagsMutation.mutateAsync(flags); }}
        />

        {/* Merchant Profile Section */}
        <MerchantProfileSection
          profile={merchantProfile}
          onUpdate={async (profile) => { await updateMerchantProfileMutation.mutateAsync(profile); }}
        />
      </div>
    </main>
  );
}
