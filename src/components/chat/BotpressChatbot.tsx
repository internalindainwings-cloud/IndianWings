'use client';

import React, { useEffect } from 'react';

// Declarations for Botpress global window object
declare global {
  interface Window {
    botpress?: {
      init: (config: Record<string, unknown>) => void;
      open?: () => void;
      close?: () => void;
      destroy?: () => void;
      [key: string]: unknown;
    };
  }
}

const BOTPRESS_SCRIPT_URL = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
const STYLE_TAG_ID = 'tiwc-botpress-positioning-styles';
const SCRIPT_TAG_ID = 'tiwc-botpress-inject-script';

export const BotpressChatbot: React.FC = () => {
  const clientId = process.env.NEXT_PUBLIC_BOTPRESS_CLIENT_ID?.trim();

  useEffect(() => {
    // Graceful exit if Client ID is not configured
    if (!clientId) {
      if (process.env.NODE_ENV === 'development') {
        console.info(
          '[The Indian Wings Company] Botpress Chatbot: NEXT_PUBLIC_BOTPRESS_CLIENT_ID is not configured. Webchat widget is disabled.'
        );
      }
      return;
    }

    // Inject CSS rule ensuring approved positioning:
    // Mobile: bottom 84px, right 16px (avoids mobile bottom dock)
    // Desktop: bottom 24px, right 24px
    if (!document.getElementById(STYLE_TAG_ID)) {
      const styleEl = document.createElement('style');
      styleEl.id = STYLE_TAG_ID;
      styleEl.innerHTML = `
        /* The Indian Wings Company - Botpress Webchat Positioning Override */
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
      `;
      document.head.appendChild(styleEl);
    }

    // If window.botpress is already available and initialized, skip reinjecting
    if (window.botpress && typeof window.botpress.init === 'function') {
      try {
        window.botpress.init({
          clientId,
          botId: clientId,
        });
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[The Indian Wings Company] Botpress re-init notice:', err);
        }
      }
      return;
    }

    // Check if script element already exists
    let scriptEl = document.getElementById(SCRIPT_TAG_ID) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = SCRIPT_TAG_ID;
      scriptEl.src = BOTPRESS_SCRIPT_URL;
      scriptEl.async = true;
      scriptEl.defer = true;

      scriptEl.onload = () => {
        if (window.botpress && typeof window.botpress.init === 'function') {
          try {
            window.botpress.init({
              clientId,
              botId: clientId,
            });
            console.info('[The Indian Wings Company] Botpress Webchat initialized successfully.');
          } catch (err) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('[The Indian Wings Company] Failed to initialize Botpress Webchat:', err);
            }
          }
        }
      };

      scriptEl.onerror = () => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[The Indian Wings Company] Failed to load Botpress Webchat script from CDN. The site will continue functioning normally.'
          );
        }
      };

      document.body.appendChild(scriptEl);
    }

    return () => {
      // Optional cleanup on unmount
      const existingStyle = document.getElementById(STYLE_TAG_ID);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [clientId]);

  // Renders nothing directly in JSX; Botpress injects its own widget asynchronously
  return null;
};
