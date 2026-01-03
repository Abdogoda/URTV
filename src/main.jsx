import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Handle GitHub Pages 404 redirect
const handleGitHubPages404Redirect = () => {
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  if (redirect) {
    // Remove /URTV/ from the redirect path and navigate using the app router
    const path = redirect.replace('/URTV/', '');
    window.history.replaceState(null, null, '/URTV/' + path);
  }
};

handleGitHubPages404Redirect();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
