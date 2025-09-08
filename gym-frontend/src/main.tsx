import React, { startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider } from './features/auth/AuthContext';
import './styles/index.css';
import createRoutes from './routes/app';
import { worker } from './lib/msw/browser';

// start MSW in development environment
async function enableMSW() {
  if (import.meta.env.DEV) {
    await worker.start({ serviceWorker: { url: '/mockServiceWorker.js' } });
  }
}

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});
const router = createRoutes();

enableMSW().then(() => {
  startTransition(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <QueryClientProvider client={qc}>
          <ThemeProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </React.StrictMode>
    );
  });
});