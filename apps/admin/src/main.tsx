import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/shared/components/ui/sonner';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <ThemeProvider defaultTheme="system" storageKey="wisdom-admin-theme">
          <App />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>
);
