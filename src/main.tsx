import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TranslationProvider } from './contexts/TranslationContext'

console.log('Starting React app...');

createRoot(document.getElementById("root")!).render(
  <TranslationProvider>
    <App />
  </TranslationProvider>
);

console.log('React app rendered');
