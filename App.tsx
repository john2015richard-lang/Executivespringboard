
import React, { useState, useCallback, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import { WebinarData, View, Registration } from './types';
import { INITIAL_WEBINARS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<View>('LANDING');
  const [webinars, setWebinars] = useState<WebinarData[]>(() => {
    const saved = localStorage.getItem('plaxonic_webinars');
    return saved ? JSON.parse(saved) : INITIAL_WEBINARS;
  });
  const [activeId, setActiveId] = useState<string>(() => {
    const hash = window.location.hash.replace('#/webinar/', '');
    return hash || INITIAL_WEBINARS[0].id;
  });

  // Persist state to local storage to simulate "new pages" persisting
  useEffect(() => {
    localStorage.setItem('plaxonic_webinars', JSON.stringify(webinars));
  }, [webinars]);

  // Sync hash with activeId
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/webinar/', '');
      if (hash && webinars.find(w => w.id === hash)) {
        setActiveId(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [webinars]);

  const activeWebinar = webinars.find(w => w.id === activeId) || webinars[0];

  const goToLogin = useCallback(() => setView('LOGIN'), []);
  const goToLanding = useCallback(() => setView('LANDING'), []);
  
  const handleLogin = useCallback((user: string, pass: string) => {
    if (user === 'Admin' && pass === '12345') {
      setView('ADMIN');
      return true;
    }
    return false;
  }, []);

  const handleUpdateWebinars = useCallback((updatedList: WebinarData[]) => {
    setWebinars(updatedList);
  }, []);

  const handleRegistration = useCallback((webinarId: string, registration: Registration) => {
    setWebinars(prev => prev.map(w => {
      if (w.id === webinarId) {
        const attendees = w.attendees ? [...w.attendees, registration] : [registration];
        return { ...w, attendees, registrations: attendees.length };
      }
      return w;
    }));
  }, []);

  const handleSelectWebinar = useCallback((id: string) => {
    setActiveId(id);
    window.location.hash = `#/webinar/${id}`;
  }, []);

  const handleLogout = useCallback(() => {
    setView('LANDING');
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {view === 'LANDING' && (
        <LandingPage 
          data={activeWebinar} 
          onAdminClick={goToLogin}
          onRegister={(reg) => handleRegistration(activeId, reg)}
        />
      )}
      {view === 'LOGIN' && (
        <Login 
          onLogin={handleLogin} 
          onCancel={goToLanding} 
        />
      )}
      {view === 'ADMIN' && (
        <AdminDashboard 
          webinars={webinars}
          activeId={activeId}
          onUpdate={handleUpdateWebinars} 
          onSelect={handleSelectWebinar}
          onViewLive={goToLanding}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
