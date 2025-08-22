import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthGuard from './components/AuthGuard';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Dashboard from './components/Dashboard';
import Matchmaking from './components/Matchmaking';
import Teams from './components/Teams';
import Turfs from './components/Turfs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Modal from './components/Modal';
import AuthModal from './components/AuthModal';


function App() {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showTurfManagement, setShowTurfManagement] = useState(false);

  useEffect(() => {
    // Initialize AOS
    if (typeof window !== 'undefined' && window.AOS) {
      window.AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
      });
    }
  }, []);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleLogout = async () => {
    await signOut();
    setShowDashboard(false);
    setShowAdminDashboard(false);
    setShowTurfManagement(false);
    setActiveSection('home');
  };
  const handleHeroAction = (action) => {
    if (action === 'findMatch') {
      setActiveSection('matchmaking');
    } else if (action === 'createTeam') {
      setActiveSection('teams');
    }
  };

  const handleProfileClick = () => {
    if (user?.profile?.role === 'admin') {
      setShowAdminDashboard(true);
    } else if (user?.profile?.role === 'turf_owner') {
      setShowTurfManagement(true);
    } else {
      setShowDashboard(true);
    }
  };

  const renderContent = () => {
    // Import admin components dynamically when needed
    const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));
    const TurfManagement = React.lazy(() => import('./components/admin/TurfManagement'));

    if (showAdminDashboard) {
      return (
        <React.Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="spinner"></div></div>}>
          <AdminDashboard 
            openModal={openModal} 
            onBack={() => setShowAdminDashboard(false)} 
            user={user} 
          />
        </React.Suspense>
      );
    }

    if (showTurfManagement) {
      return (
        <React.Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="spinner"></div></div>}>
          <TurfManagement 
            openModal={openModal} 
            onBack={() => setShowTurfManagement(false)} 
            user={user} 
          />
        </React.Suspense>
      );
    }

    if (showDashboard) {
      return <Dashboard openModal={openModal} onBack={() => setShowDashboard(false)} user={user} />;
    }

    switch (activeSection) {
      case 'home':
        return (
          <>
            <Hero onAction={handleHeroAction} />
            <About />
            <Features />
            <Contact />
          </>
        );
      case 'matchmaking':
        return <Matchmaking openModal={openModal} user={user} />;
      case 'teams':
        return <Teams openModal={openModal} user={user} />;
      case 'turfs':
        return <Turfs openModal={openModal} user={user} />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <>
            <Hero onAction={handleHeroAction} />
            <About />
            <Features />
            <Contact />
          </>
        );
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          onProfileClick={handleProfileClick}
          isAuthenticated={!!user}
          user={user}
          onLogout={handleLogout}
        />
        <main>
          {renderContent()}
        </main>
        <Footer />
        <Modal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />
      </div>
    </AuthGuard>
  );
}

export default App;