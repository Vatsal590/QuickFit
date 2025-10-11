import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TranslationProvider } from './contexts/TranslationContext'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/next"

createRoot(document.getElementById("root")!).render(
  <TranslationProvider>
    <App />
    <Analytics />
  </TranslationProvider>
);
