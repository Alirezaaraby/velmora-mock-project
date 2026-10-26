import React from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import StylistDrawer from '@/components/StylistDrawer';
import BagPanel from '@/components/BagPanel';

export default function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-ivory text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ivory focus:px-4 focus:py-3 focus:text-sm"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">{children}</main>
      <SiteFooter />
      <StylistDrawer />
      <BagPanel />
    </div>
  );
}