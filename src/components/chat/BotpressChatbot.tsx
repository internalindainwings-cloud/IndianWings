'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

export const BotpressChatbot: React.FC<{ nonce?: string }> = ({ nonce }) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let idleId: number | null = null;

    const triggerLoad = () => {
      setShouldLoad(true);
      cleanup();
    };

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      if (idleId && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      window.removeEventListener('scroll', triggerLoad);
      window.removeEventListener('pointerdown', triggerLoad);
      window.removeEventListener('keydown', triggerLoad);
      window.removeEventListener('touchstart', triggerLoad);
    };

    // Trigger on first user interaction
    window.addEventListener('scroll', triggerLoad, { passive: true, once: true });
    window.addEventListener('pointerdown', triggerLoad, { passive: true, once: true });
    window.addEventListener('keydown', triggerLoad, { passive: true, once: true });
    window.addEventListener('touchstart', triggerLoad, { passive: true, once: true });

    // Safe idle fallback: load after 3.5s idle if no user interaction occurred yet
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => triggerLoad(), { timeout: 3500 });
    } else {
      timer = setTimeout(triggerLoad, 3500);
    }

    return cleanup;
  }, []);

  return (
    <>
      {/* Approved Positioning Overrides: Mobile bottom: 84px, right: 16px; Desktop bottom: 24px, right: 24px */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .bp-widget-web,
          #bp-webchat-container,
          .bpw-widget-btn,
          div[class*="bp-widget"] {
            bottom: 84px !important;
            right: 16px !important;
            z-index: 45 !important;
          }
          @media (min-width: 640px) {
            .bp-widget-web,
            #bp-webchat-container,
            .bpw-widget-btn,
            div[class*="bp-widget"] {
              bottom: 24px !important;
              right: 24px !important;
            }
          }
        `
      }} />

      {/* Official Botpress Webchat v5.0 Engine - Injected once browser is idle or user interacts */}
      {shouldLoad && (
        <Script
          id="botpress-webchat-inject"
          src="https://cdn.botpress.cloud/webchat/v5.0/inject.js"
          strategy="lazyOnload"
          nonce={nonce}
          onLoad={() => {
            if (!document.getElementById('botpress-config-script')) {
              const configScript = document.createElement('script');
              configScript.id = 'botpress-config-script';
              configScript.src = 'https://files.bpcontent.cloud/2026/09/20/17/20260920174145-5B30LJ6M.js';
              configScript.defer = true;
              if (nonce) {
                configScript.setAttribute('nonce', nonce);
              }
              document.body.appendChild(configScript);
            }
          }}
        />
      )}
    </>
  );
};
