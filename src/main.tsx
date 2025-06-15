
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialiser les services de monitoring en production
if (process.env.NODE_ENV === 'production') {
  import('./services/monitoring/performanceMonitor').then(({ performanceMonitor }) => {
    performanceMonitor.startTracking();
  });
  
  import('./services/monitoring/errorHandler').then(({ errorHandler }) => {
    errorHandler.init();
  });
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(<App />);
