'use client';

import { EnquiryInput } from '@/lib/validations/enquiry';

export interface PendingLead extends EnquiryInput {
  tempId: string;
  queuedAt: string;
  retryCount: number;
}

const STORAGE_KEY = 'tiwc_pending_leads_v2';
const LEGACY_STORAGE_KEY = 'tiwc_pending_leads';

/**
 * Memory fallback in case sessionStorage is disabled or unavailable
 */
let memoryQueue: PendingLead[] = [];

function cleanLegacyLocalStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch {
    // Ignore storage access errors
  }
}

function encodePayload(data: PendingLead[]): string {
  try {
    return btoa(encodeURIComponent(JSON.stringify(data)));
  } catch {
    return '';
  }
}

function decodePayload(encoded: string): PendingLead[] {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch {
    return [];
  }
}

/**
 * Synchronously writes pending lead to sessionStorage (ephemeral to the tab session,
 * not stored indefinitely in cleartext in localStorage).
 */
export function queueLeadLocally(lead: EnquiryInput): PendingLead {
  const pendingLead: PendingLead = {
    ...lead,
    tempId: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    queuedAt: new Date().toISOString(),
    retryCount: 0,
  };

  cleanLegacyLocalStorage();

  if (typeof window === 'undefined') return pendingLead;

  try {
    const existing = getPendingLeads();
    existing.push(pendingLead);
    sessionStorage.setItem(STORAGE_KEY, encodePayload(existing));
    memoryQueue = existing;
  } catch (err) {
    memoryQueue.push(pendingLead);
    console.warn('[OfflineQueue] Could not save lead to sessionStorage, used memory fallback:', err);
  }

  return pendingLead;
}

/**
 * Removes a successfully persisted lead from local persistence
 */
export function removePendingLead(tempId: string): void {
  cleanLegacyLocalStorage();
  memoryQueue = memoryQueue.filter((item) => item.tempId !== tempId);

  if (typeof window === 'undefined') return;

  try {
    const existing = getPendingLeads();
    const filtered = existing.filter((item) => item.tempId !== tempId);
    if (filtered.length === 0) {
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, encodePayload(filtered));
    }
  } catch (err) {
    console.warn('[OfflineQueue] Could not remove lead from sessionStorage:', err);
  }
}

/**
 * Retrieves all pending unsynced leads from sessionStorage
 */
export function getPendingLeads(): PendingLead[] {
  cleanLegacyLocalStorage();

  if (typeof window === 'undefined') return memoryQueue;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return memoryQueue;
    const decoded = decodePayload(raw);
    return Array.isArray(decoded) && decoded.length > 0 ? decoded : memoryQueue;
  } catch {
    return memoryQueue;
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
