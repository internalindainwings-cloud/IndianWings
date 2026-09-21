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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  useEffect(() => {
    // Skip tracking for admin portal navigation to avoid skewing consumer analytics
    if (pathname && pathname.startsWith('/admin')) return;

    // 1. Capture UTM tags into session storage on first landing
    initAttribution();

    // 2. Register auto-sync listener for offline / low-network queued leads
    const cleanupOffline = initOfflineSyncListener();

    // 3. Register First-Party visitor telemetry tracker (scroll milestones & exit beacons)
    const cleanupTelemetry = initTelemetryTracker();

    return () => {
      cleanupOffline();
      cleanupTelemetry();
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
            strategy="afterInteractive"
            nonce={nonce}
          />
          <Script id="google-analytics" strategy="afterInteractive" nonce={nonce}>
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
        <Script id="microsoft-clarity" strategy="afterInteractive" nonce={nonce}>
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
