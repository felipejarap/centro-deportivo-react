/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { GymProvider, useGym } from './context/GymContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { ToastContainer } from './components/Toast.jsx';

// Public pages
import { HomePage } from './pages/public/HomePage.jsx';
import { PlansPage } from './pages/public/PlansPage.jsx';
import { ClassesPage } from './pages/public/ClassesPage.jsx';
import { AboutPage } from './pages/public/AboutPage.jsx';
import { LoginPage } from './pages/public/LoginPage.jsx';
import { RegisterPage } from './pages/public/RegisterPage.jsx';

// Professor pages
import { ProfessorClassesPage } from './pages/professor/ProfessorClassesPage.jsx';
import { ClassDetailPage } from './pages/professor/ClassDetailPage.jsx';

// Student pages
import { StudentClassesPage } from './pages/student/StudentClassesPage.jsx';
import { StudentReservationsPage } from './pages/student/StudentReservationsPage.jsx';
import { StudentSubscriptionPage } from './pages/student/StudentSubscriptionPage.jsx';

// Admin pages
import { AdminUsersPage } from './pages/admin/AdminUsersPage.jsx';
import { AdminRolesPage } from './pages/admin/AdminRolesPage.jsx';
import { AdminClassesPage } from './pages/admin/AdminClassesPage.jsx';
import { AdminPlansPage } from './pages/admin/AdminPlansPage.jsx';
import { AdminReservationsPage } from './pages/admin/AdminReservationsPage.jsx';
import { AdminSubscriptionsPage } from './pages/admin/AdminSubscriptionsPage.jsx';

// General page
import { ProfilePage } from './pages/general/ProfilePage.jsx';

const AppContent = () => {
  const { currentUser, currentView, setCurrentView } = useGym();
  const requiredRole = {
    'profesor-clases': 'profesor',
    'profesor-detalle-clase': 'profesor',
    'alumno-clases': 'alumno',
    'alumno-reservas': 'alumno',
    'alumno-suscripcion': 'alumno',
    'admin-usuarios': 'admin',
    'admin-roles': 'admin',
    'admin-clases': 'admin',
    'admin-planes': 'admin',
    'admin-reservas': 'admin',
    'admin-suscripciones': 'admin'
  }[currentView];

  useEffect(() => {
    if (currentView === 'perfil' && !currentUser) {
      setCurrentView('login');
    } else if (requiredRole && currentUser?.rol !== requiredRole) {
      if (!currentUser) {
        setCurrentView('login');
      } else if (currentUser.rol === 'admin') {
        setCurrentView('admin-usuarios');
      } else if (currentUser.rol === 'profesor') {
        setCurrentView('profesor-clases');
      } else if (currentUser.rol === 'alumno') {
        setCurrentView('alumno-clases');
      } else {
        setCurrentView('inicio');
      }
    }
  }, [currentUser, currentView, requiredRole, setCurrentView]);

  const renderCurrentView = () => {
    if (currentView === 'perfil' && !currentUser) return <LoginPage />;

    if (requiredRole && currentUser?.rol !== requiredRole) {
      if (!currentUser) return <LoginPage />;
      if (currentUser.rol === 'admin') return <AdminUsersPage />;
      if (currentUser.rol === 'profesor') return <ProfessorClassesPage />;
      if (currentUser.rol === 'alumno') return <StudentClassesPage />;
      return <HomePage />;
    }

    switch (currentView) {
      // Public Pages
      case 'inicio':
        return <HomePage />;
      case 'planes':
        return <PlansPage />;
      case 'clases':
        return <ClassesPage />;
      case 'nosotros':
        return <AboutPage />;
      case 'login':
        return <LoginPage />;
      case 'registro':
        return <RegisterPage />;

      // Professor Pages
      case 'profesor-clases':
        return <ProfessorClassesPage />;
      case 'profesor-detalle-clase':
        return <ClassDetailPage />;

      // Student Pages
      case 'alumno-clases':
        return <StudentClassesPage />;
      case 'alumno-reservas':
        return <StudentReservationsPage />;
      case 'alumno-suscripcion':
        return <StudentSubscriptionPage />;

      // Admin CRUD Pages
      case 'admin-usuarios':
        return <AdminUsersPage />;
      case 'admin-roles':
        return <AdminRolesPage />;
      case 'admin-clases':
        return <AdminClassesPage />;
      case 'admin-planes':
        return <AdminPlansPage />;
      case 'admin-reservas':
        return <AdminReservationsPage />;
      case 'admin-suscripciones':
        return <AdminSubscriptionsPage />;

      // General Page
      case 'perfil':
        return <ProfilePage />;

      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      <Navbar />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <GymProvider>
      <AppContent />
    </GymProvider>
  );
}
