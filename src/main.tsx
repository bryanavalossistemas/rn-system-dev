import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Router from '@/router';
import { QueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import '@/styles/index.css';

const queryClient = new QueryClient();

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'persistor',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <Router />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster richColors position="bottom-center" />
    </PersistQueryClientProvider>
  </StrictMode>,
);
