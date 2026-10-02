import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { OmniFlowProvider } from './context/OmniFlowContext';

createRoot(document.getElementById('root')!).render(
  <OmniFlowProvider>
    <App />
  </OmniFlowProvider>
);
