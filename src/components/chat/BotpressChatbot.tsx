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

      {/* Official Botpress Webchat v5.0 Engine + Direct Configuration on Load */}
      <Script
        id="botpress-webchat-inject"
        src="https://cdn.botpress.cloud/webchat/v5.0/inject.js"
        strategy="afterInteractive"
        onLoad={() => {
          try {
            if (typeof window !== 'undefined' && (window as any).botpress) {
              (window as any).botpress.init({
                botId: 'c7380059-7f97-428c-97ed-6fb93d9d17eb',
                configuration: {
                  version: 'v2',
                  website: {},
                  email: {},
                  phone: {},
                  termsOfService: {},
                  privacyPolicy: {},
                  homePageEnabled: true,
                  welcomeHeading: 'Hi there, how can we help?',
                  welcomeSubtitle: 'Tap a starting point or ask in your own words.',
                  citationsEnabled: true,
                },
                clientId: 'f8f53f01-1f3b-4d00-88e9-197c845300e8',
              });
              console.info('[The Indian Wings Company] Botpress Webchat initialized successfully.');
            }
          } catch (err) {
            console.warn('[The Indian Wings Company] Botpress init notice:', err);
          }
        }}
      />
    </>
  );
};
