'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

export const BotpressChatbot: React.FC<{ nonce?: string }> = ({ nonce }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isPermanentlyHidden, setIsPermanentlyHidden] = useState(false);

  useEffect(() => {
    const checkIsHidden = () => {
      const opensCount = parseInt(
        typeof localStorage !== 'undefined' ? localStorage.getItem('tiw_chat_opens') || '0' : '0'
      );
      return opensCount >= 2;
    };

    if (checkIsHidden()) {
      setIsPermanentlyHidden(true);
      return;
    }

    const triggerAutoOpen = (newCount: number) => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('tiw_chat_opens', newCount.toString());
      }
      
      let attempts = 0;
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
          clearInterval(interval);
        }
      }, 500);
    };

    const handleScroll = () => {
      if (checkIsHidden()) return; // Failsafe

      const scrollY = window.scrollY;
      const loadThreshold = window.innerHeight * 0.8;
      
      const threshold1 = window.innerHeight * 1.2;
      const threshold2 = window.innerHeight * 3.0; 

      if (scrollY > loadThreshold) {
        setShouldLoad(true);
      }

      const opensCount = parseInt(
        typeof localStorage !== 'undefined' ? localStorage.getItem('tiw_chat_opens') || '0' : '0'
      );

      if (scrollY > threshold1 && opensCount === 0) {
        triggerAutoOpen(1);
      } 
      else if (scrollY > threshold2 && opensCount === 1) {
        triggerAutoOpen(2);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {!isPermanentlyHidden && (
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
      )}

      {/* Official Botpress Webchat v5.0 Engine - Injected once browser is idle or user interacts */}
      {shouldLoad && !isPermanentlyHidden && (
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
