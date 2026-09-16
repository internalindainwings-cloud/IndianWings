'use client';

import { EnquiryInput } from '@/lib/validations/enquiry';

export interface PendingLead extends EnquiryInput {
  tempId: string;
  queuedAt: string;
  retryCount: number;
}

const STORAGE_KEY = 'tiwc_pending_leads';

/**
 * Layer 1: Synchronously writes lead to localStorage before HTTP request fires
 */
export function queueLeadLocally(lead: EnquiryInput): PendingLead {
  const pendingLead: PendingLead = {
    ...lead,
    tempId: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    queuedAt: new Date().toISOString(),
    retryCount: 0,
  };

  if (typeof window === 'undefined') return pendingLead;

  try {
    const existing = getPendingLeads();
    existing.push(pendingLead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('[OfflineQueue] Could not save lead to localStorage:', err);
  }

  return pendingLead;
}

/**
 * Removes a successfully persisted lead from localStorage
 */
export function removePendingLead(tempId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getPendingLeads();
    const filtered = existing.filter((item) => item.tempId !== tempId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('[OfflineQueue] Could not remove lead from localStorage:', err);
  }
}

/**
 * Retrieves all pending unsynced leads
 */
export function getPendingLeads(): PendingLead[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Flushes the offline queue by posting each pending lead to the backend
 */
export async function syncPendingLeads(): Promise<void> {
  if (typeof window === 'undefined' || !navigator.onLine) return;

  const leads = getPendingLeads();
  if (leads.length === 0) return;

  for (const lead of leads) {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });

      if (res.ok) {
        removePendingLead(lead.tempId);

      }
    } catch (err) {
      console.warn(`[OfflineQueue] Failed to sync lead ${lead.tempId}, will retry on next reconnect:`, err);
    }
  }
}

/**
 * Registers network event listener to auto-sync when device comes back online
 */
export function initOfflineSyncListener(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = () => {

    syncPendingLeads();
  };

  window.addEventListener('online', handleOnline);

  // Also attempt immediate sync on page mount if online
  if (navigator.onLine) {
    syncPendingLeads();
  }

  return () => {
    window.removeEventListener('online', handleOnline);
  };
}
