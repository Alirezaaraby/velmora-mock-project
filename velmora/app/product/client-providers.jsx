'use client';

import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { AppProvider } from '@/lib/AppContext';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import StylistDrawer from '@/components/StylistDrawer';
import BagPanel from '@/components/BagPanel';
import ChatWithAIButton from '@/components/ChatWithAIButton';

export default function ClientProviders({ children }) {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AppProvider>
          <div className="flex min-h-screen flex-col bg-ivory text-ink">
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ivory focus:px-4 focus:py-3 focus:text-sm"
            >
              Skip to content
            </a>
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <StylistDrawer />
            <BagPanel />
            <ChatWithAIButton />
          </div>
      </AppProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
