'use client';

import React from 'react';
import Script from 'next/script';

const INJECT_SCRIPT = 'https://cdn.botpress.cloud/webchat/v5.0/inject.js';
const CONFIG_SCRIPT = 'https://files.bpcontent.cloud/2026/09/20/17/20260920174145-5B30LJ6M.js';

export const BotpressChatbot: React.FC = () => {
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

      {/* Official Botpress Webchat v5.0 Engine */}
      <Script
        id="botpress-inject-script"
        src={INJECT_SCRIPT}
        strategy="afterInteractive"
      />

      {/* Dedicated Botpress Bot Configuration Bundle */}
      <Script
        id="botpress-config-script"
        src={CONFIG_SCRIPT}
        strategy="afterInteractive"
      />
    </>
  );
};
