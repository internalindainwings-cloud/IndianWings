'use client';

import React from 'react';
import Script from 'next/script';

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
        id="botpress-webchat-inject"
        src="https://cdn.botpress.cloud/webchat/v5.0/inject.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (!document.getElementById('botpress-config-script')) {
            const configScript = document.createElement('script');
            configScript.id = 'botpress-config-script';
            configScript.src = 'https://files.bpcontent.cloud/2026/09/20/17/20260920174145-5B30LJ6M.js';
            configScript.defer = true;
            document.body.appendChild(configScript);
          }
        }}
      />
    </>
  );
};
