'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

export const BotpressChatbot: React.FC<{ nonce?: string }> = ({ nonce }) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    let hasOpened = false;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const loadThreshold = window.innerHeight * 0.8;
      const openThreshold = window.innerHeight * 2.5; // Trigger auto-open deeper down the page

      // Load widget early
      if (scrollY > loadThreshold) {
        setShouldLoad(true);
      }

      // Auto-open widget once user scrolls past packages/leads
      if (scrollY > openThreshold && !hasOpened) {
        hasOpened = true; // Only do this once
        
        // Wait a small moment to ensure script is injected and ready if they scrolled very fast
        setTimeout(() => {
          try {
            if (typeof window !== 'undefined') {
              // @ts-ignore
              if (window.botpress && window.botpress.open) {
                // @ts-ignore
                window.botpress.open();
              } 
              // @ts-ignore
              else if (window.botpressWebChat) {
                // @ts-ignore
                window.botpressWebChat.sendEvent({ type: 'show' });
              }
            }
          } catch (e) {
            console.error('Failed to auto-open chatbot:', e);
          }
        }, 1000);
      }
    };

    // Initial check on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
