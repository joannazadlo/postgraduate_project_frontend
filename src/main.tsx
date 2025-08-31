import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import { waitForFirebaseAuth } from './firebase/firebaseReady';

waitForFirebaseAuth().then(() => {
  const rootElement = document.getElementById('root') as HTMLElement;

  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    )
  }
});
