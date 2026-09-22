'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

export const BotpressChatbot: React.FC<{ nonce?: string }> = ({ nonce }) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const triggerAutoOpen = (newCount: number) => {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('bp_auto_opens', newCount.toString());
      }
      
      let attempts = 0;
      // Retry every 500ms for up to 5 seconds if script is slow to load on mobile
      const interval = setInterval(() => {
        attempts++;
        try {
          if (typeof window !== 'undefined') {
            // @ts-ignore
            if (window.botpress && window.botpress.open) {
              // @ts-ignore
              window.botpress.open();
              clearInterval(interval);
            } 
            // @ts-ignore
            else if (window.botpressWebChat) {
              // @ts-ignore
              window.botpressWebChat.sendEvent({ type: 'show' });
              clearInterval(interval);
            }
          }
        } catch (e) {
          console.error('Failed to auto-open chatbot:', e);
        }
        
        if (attempts >= 10) {
          clearInterval(interval); // Give up after 5 seconds
        }
      }, 500);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const loadThreshold = window.innerHeight * 0.8;
      
      // Threshold 1: Lead Form (approx 1.2 viewports down)
      const threshold1 = window.innerHeight * 1.2;
      // Threshold 2: Packages section (approx 3 viewports down)
      const threshold2 = window.innerHeight * 3.0; 

      // Load widget early
      if (scrollY > loadThreshold) {
        setShouldLoad(true);
      }

      // Check how many times we've auto-opened in this session
      const opensCount = parseInt(
        typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('bp_auto_opens') || '0' : '0'
      );

      // Auto-open 1st time at Lead Form
      if (scrollY > threshold1 && opensCount === 0) {
        triggerAutoOpen(1);
      } 
      // Auto-open 2nd time at Packages
      else if (scrollY > threshold2 && opensCount === 1) {
        triggerAutoOpen(2);
      }
      // If opensCount is 2 or more, it will never auto-open again in this session
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
