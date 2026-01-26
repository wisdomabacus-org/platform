import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from '@/shared/components/ui/sonner';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <App />
        <Toaster position="top-right" richColors />
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>
);
