import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import QueryProvider from './providers/QueryProvider.tsx'

if (window.location.pathname === "/") {
  window.history.scrollRestoration = "manual";
  if (window.location.hash) {
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
  }
  window.scrollTo(0, 0);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
    <App />
  </QueryProvider>
  </StrictMode>,
)
