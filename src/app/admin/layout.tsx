import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Portal | The Indian Wings Company',
  description: 'Executive Lead Management & Real-Time Visitor Telemetry Engine',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-scope min-h-screen bg-[#081E23] text-white antialiased selection:bg-[#F59E0B] selection:text-white">
      {/* Isolated Admin Shell — completely decoupled from public site layouts */}
      {children}
    </div>
  );
}
