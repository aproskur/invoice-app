'use client';

import type { ReactNode } from 'react';
import { PreviewProvider, usePreview } from '@/context/PreviewContext';
import Sidebar from './Sidebar';

function Layout({ children }: { children: ReactNode }) {
  const { previewMode } = usePreview();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {!previewMode && <Sidebar />}
      <div className="flex-1">{children}</div> {/* ✅ render children */}
    </div>
  );
}

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <PreviewProvider>
      <Layout>{children}</Layout> {/* ✅ pass children down */}
    </PreviewProvider>
  );
}
