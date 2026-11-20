import React, { useEffect, useState } from 'react';
import bundledMenu from './menu.json';
import PublicMenu from './Menu';
import Admin from './Admin';

const isAdminRoute = () => window.location.pathname.replace(/\/+$/, '') === '/admin';

const App = () => {
  // Wait for the live menu so guests never see stale prices; fall back to the bundled copy if the API fails.
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    if (isAdminRoute()) return undefined;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    fetch('/api/menu', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad response'))))
      .then((m) => setMenu(m && Array.isArray(m.categories) ? m : bundledMenu))
      .catch(() => setMenu(bundledMenu))
      .finally(() => clearTimeout(timer));
    return () => { clearTimeout(timer); ctrl.abort(); };
  }, []);

  if (isAdminRoute()) return <Admin />;
  if (!menu) return null;
  return <PublicMenu menu={menu} />;
};

export default App;
