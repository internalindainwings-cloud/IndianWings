'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { initAttribution } from '@/lib/utilities/attribution';
import { initOfflineSyncListener } from '@/lib/utilities/offline-queue';
import { initTelemetryTracker, recordRouteChange } from '@/lib/utilities/telemetry';

interface AnalyticsScriptsProps {
  nonce?: string;
}

export const AnalyticsScripts: React.FC<AnalyticsScriptsProps> = ({ nonce }) => {
  const pathname = usePathname();
  const rawGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gaId = rawGaId && !rawGaId.includes('XXXX') && rawGaId.startsWith('G-') ? rawGaId : undefined;
  const rawClarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const clarityId = rawClarityId && !rawClarityId.includes('XXXX') && !rawClarityId.includes('your_') && rawClarityId.trim().length > 3 ? rawClarityId : undefined;

  useEffect(() => {
    // Skip tracking for admin portal navigation to avoid skewing consumer analytics
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) return;

    let cleanupOffline: (() => void) | undefined;
    let cleanupTelemetry: (() => void) | undefined;

    const startBackgroundTracking = () => {
      // 1. Capture UTM tags into session storage on first landing
      initAttribution();

      // 2. Register auto-sync listener for offline / low-network queued leads
      cleanupOffline = initOfflineSyncListener();

      // 3. Register First-Party visitor telemetry tracker (scroll milestones & exit beacons)
      cleanupTelemetry = initTelemetryTracker();
    };

    let idleId: number | null = null;
    let timerId: NodeJS.Timeout | null = null;

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(startBackgroundTracking, { timeout: 2000 });
    } else if (typeof window !== 'undefined') {
      timerId = setTimeout(startBackgroundTracking, 1500);
    }

    return () => {
      if (idleId !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timerId !== null) {
        clearTimeout(timerId);
      }
      cleanupOffline?.();
      cleanupTelemetry?.();
    };
  }, []);

  // Track client-side route changes
  useEffect(() => {
    if (pathname && !pathname.startsWith('/admin')) {
      recordRouteChange(pathname);
    }
  }, [pathname]);

  return (
    <>
      {/* Google Analytics 4 */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="lazyOnload"
            nonce={nonce}
          />
          <Script id="google-analytics" strategy="lazyOnload" nonce={nonce}>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Microsoft Clarity (Heatmaps, Screen Recordings, Drop-offs) */}
      {clarityId && (
        <Script id="microsoft-clarity" strategy="lazyOnload" nonce={nonce}>
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                ${nonce ? `t.setAttribute('nonce', '${nonce}');` : ''}
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}
    </>
  );
};
