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

const DEFAULT_INJECT_SCRIPT = 'https://cdn.botpress.cloud/webchat/v5.0/inject.js';
const DEFAULT_CONFIG_SCRIPT = 'https://files.bpcontent.cloud/2026/09/20/17/20260920174145-5B30LJ6M.js';
const STYLE_TAG_ID = 'tiwc-botpress-positioning-styles';
const INJECT_SCRIPT_ID = 'tiwc-botpress-inject-script';
const CONFIG_SCRIPT_ID = 'tiwc-botpress-config-script';

export const BotpressChatbot: React.FC = () => {
  const clientId = process.env.NEXT_PUBLIC_BOTPRESS_CLIENT_ID?.trim();
  const injectUrl = process.env.NEXT_PUBLIC_BOTPRESS_INJECT_URL?.trim() || DEFAULT_INJECT_SCRIPT;
  const configUrl = process.env.NEXT_PUBLIC_BOTPRESS_CONFIG_URL?.trim() || DEFAULT_CONFIG_SCRIPT;

  useEffect(() => {
    // Inject approved positioning CSS rules
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

    // Helper to inject config script once inject.js is ready
    const loadConfigScript = () => {
      if (document.getElementById(CONFIG_SCRIPT_ID)) return;
      const configScript = document.createElement('script');
      configScript.id = CONFIG_SCRIPT_ID;
      configScript.src = configUrl;
      configScript.defer = true;
      configScript.onload = () => {
        if (process.env.NODE_ENV === 'development') {
          console.info('[The Indian Wings Company] Botpress Webchat loaded and initialized successfully.');
        }
      };
      configScript.onerror = () => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[The Indian Wings Company] Failed to load Botpress config script.');
        }
      };
      document.body.appendChild(configScript);
    };

    // If inject script is already present and window.botpress exists, just load config
    if (document.getElementById(INJECT_SCRIPT_ID)) {
      loadConfigScript();
      return;
    }

    // Step 1: Inject official Botpress webchat engine
    const injectScript = document.createElement('script');
    injectScript.id = INJECT_SCRIPT_ID;
    injectScript.src = injectUrl;
    injectScript.async = true;

    injectScript.onload = () => {
      // Step 2: Inject dedicated Botpress bot configuration bundle
      loadConfigScript();
    };

    injectScript.onerror = () => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[The Indian Wings Company] Failed to load Botpress Webchat script from CDN. Site continues functioning normally.'
        );
      }
    };

    document.body.appendChild(injectScript);

    return () => {
      const existingStyle = document.getElementById(STYLE_TAG_ID);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [clientId, injectUrl, configUrl]);

  return null;
};
