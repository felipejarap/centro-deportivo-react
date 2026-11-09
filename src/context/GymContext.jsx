import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_PLANS,
  INITIAL_RESERVATIONS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_ROLES,
  SYSTEM_PERMISSIONS
} from '../data/initialData.js';

const GymContext = createContext(undefined);
const AUTH_SESSION_VERSION = '2';
const INITIAL_DATA_VERSION = '2';

export const GymProvider = ({ children }) => {
  const loadStored = (key, fallback) => {
    try {
      const item = localStorage.getItem(`kronofit_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const loadSeeded = (key, fallback) => {
    const versionKey = `kronofit_${key}_seed_version`;
    if (localStorage.getItem(versionKey) !== INITIAL_DATA_VERSION) {
      localStorage.setItem(versionKey, INITIAL_DATA_VERSION);
      return fallback;
    }
    return loadStored(key, fallback);
  };

  const [roles, setRoles] = useState(() => loadStored('roles', INITIAL_ROLES));
  const [users, setUsers] = useState(() => loadSeeded('users', INITIAL_USERS));
  const [classes, setClasses] = useState(() => loadSeeded('classes', INITIAL_CLASSES));
  const [plans, setPlans] = useState(() => loadStored('plans', INITIAL_PLANS));
  const [reservations, setReservations] = useState(() => loadSeeded('reservations', INITIAL_RESERVATIONS));
  const [subscriptions, setSubscriptions] = useState(() => loadSeeded('subscriptions', INITIAL_SUBSCRIPTIONS));

  const [currentUser, setCurrentUser] = useState(() => {
    if (localStorage.getItem('kronofit_auth_version') !== AUTH_SESSION_VERSION) {
      localStorage.removeItem('kronofit_current_user_id');
      localStorage.setItem('kronofit_auth_version', AUTH_SESSION_VERSION);
      return null;
    }

    const savedUserId = localStorage.getItem('kronofit_current_user_id');
    if (savedUserId === 'guest') return null;
    return users.find(u => u.id === savedUserId && u.estado === 'activo') || null;
  });

  const [currentView, setCurrentView] = useState(() => {
    if (currentUser?.rol === 'admin') return 'admin-usuarios';
    if (currentUser?.rol === 'profesor') return 'profesor-clases';
    if (currentUser?.rol === 'alumno') return 'alumno-clases';
    return 'inicio';
  });
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [viewingProfileUserId, setViewingProfileUserId] = useState(null);
  const [preselectedPlanId, setPreselectedPlanId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // LocalStorage synchronization with kronofit key
  useEffect(() => {
    localStorage.setItem('kronofit_roles', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('kronofit_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('kronofit_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('kronofit_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('kronofit_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('kronofit_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kronofit_current_user_id', currentUser.id);
    } else {
      localStorage.setItem('kronofit_current_user_id', 'guest');
    }
  }, [currentUser]);

  // Toast Notifications
  const addToast = (tipo, mensaje) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts(prev => [...prev, { id, tipo, mensaje }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Permission Verification
  const hasPermission = permissionId => {
    if (!currentUser) return false;
    const userRoleDef = roles.find(r => r.id === currentUser.rol);
    if (!userRoleDef || !Array.isArray(userRoleDef.permisos)) return false;
    return userRoleDef.permisos.includes(permissionId);
  };

  const can = hasPermission;

  // Roles CRUD
  const createRole = roleData => {
    if (!roleData.nombre || !roleData.nombre.trim()) {
      return { success: false, error: 'El nombre del rol es obligatorio.' };
    }

    const slug = (roleData.id || roleData.nombre)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9_-]/g, '');

    if (!slug) {
      return { success: false, error: 'Identificador de rol inválido.' };
    }

    const existing = roles.some(r => r.id === slug);
    if (existing) {
      return { success: false, error: `Ya existe un rol con el identificador "${slug}".` };
    }

    const newRole = {
      id: slug,
      nombre: roleData.nombre.trim(),
      descripcion: roleData.descripcion ? roleData.descripcion.trim() : 'Rol configurado en el mantenedor.',
      permisos: Array.isArray(roleData.permisos) ? roleData.permisos : [],
      esSistema: false
    };

    setRoles(prev => [...prev, newRole]);
    addToast('success', `Rol "${newRole.nombre}" creado exitosamente.`);
    return { success: true, role: newRole };
  };

  const updateRole = (id, roleData) => {
    const target = roles.find(r => r.id === id);
    if (!target) {
      return { success: false, error: 'Rol no encontrado.' };
    }

    setRoles(prev =>
      prev.map(r => {
        if (r.id === id) {
          return {
            ...r,
            nombre: roleData.nombre ? roleData.nombre.trim() : r.nombre,
            descripcion: roleData.descripcion !== undefined ? roleData.descripcion.trim() : r.descripcion,
            permisos: Array.isArray(roleData.permisos) ? roleData.permisos : r.permisos
          };
        }
        return r;
      })
    );

    addToast('success', `Permisos del rol "${roleData.nombre || target.nombre}" actualizados.`);
    return { success: true };
  };

  const deleteRole = id => {
    if (id === 'admin') {
      addToast('error', 'El rol de Administrador General del sistema no puede eliminarse.');
      return false;
    }

    const usersWithRole = users.filter(u => u.rol === id);
    if (usersWithRole.length > 0) {
      addToast('error', `No se puede eliminar: hay ${usersWithRole.length} usuario(s) asignados a este rol.`);
      return false;
    }

    setRoles(prev => prev.filter(r => r.id !== id));
    addToast('info', 'Rol eliminado del catálogo.');
    return true;
  };

  // Auth & Session
  const login = (email, password) => {
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const user = users.find(
      u => u.email.toLowerCase() === normalizedEmail && u.password === password && u.estado === 'activo'
    );
    if (user && typeof password === 'string' && password.length > 0) {
      setCurrentUser(user);
      if (user.rol === 'admin') setCurrentView('admin-usuarios');
      else if (user.rol === 'profesor') setCurrentView('profesor-clases');
      else if (user.rol === 'alumno') setCurrentView('alumno-clases');
      else setCurrentView('inicio');
      addToast('success', `¡Bienvenido(a), ${user.nombre}!`);
      return true;
    }
    addToast('error', 'Correo o contraseña incorrectos, o cuenta inactiva.');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('inicio');
    addToast('info', 'Has cerrado sesión exitosamente.');
  };

  // User CRUD
  const createUser = userData => {
    if (!userData.nombre || !userData.nombre.trim()) {
      return { success: false, error: 'El nombre es obligatorio.' };
    }
    if (!userData.apellido || !userData.apellido.trim()) {
      return { success: false, error: 'El apellido es obligatorio.' };
    }
    if (!userData.email || !userData.email.trim()) {
      return { success: false, error: 'El correo electrónico es obligatorio.' };
    }

    const emailExists = users.some(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
    if (emailExists) {
      return { success: false, error: 'Este correo electrónico ya se encuentra registrado.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      nombre: userData.nombre.trim(),
      apellido: userData.apellido.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password || 'password123',
      telefono: userData.telefono ? userData.telefono.trim() : '+56 9 9123 4567',
      rut: userData.rut ? userData.rut.trim() : '19.821.450-2',
      rol: userData.rol || 'alumno',
      fechaRegistro: new Date().toISOString().split('T')[0],
      estado: userData.estado || 'activo',
      planId: userData.planId || 'plan-black',
      especialidad: userData.especialidad ? userData.especialidad.trim() : '',
      bio: userData.bio ? userData.bio.trim() : '',
      contactoEmergencia: userData.contactoEmergencia ? userData.contactoEmergencia.trim() : '',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
    };

    setUsers(prev => [newUser, ...prev]);

    if (newUser.rol === 'alumno' && newUser.planId) {
      const plan = plans.find(p => p.id === newUser.planId);
      const sub = {
        id: `sub-${Date.now()}`,
        usuarioId: newUser.id,
        usuarioNombre: `${newUser.nombre} ${newUser.apellido}`,
        usuarioEmail: newUser.email,
        planId: newUser.planId,
        planNombre: plan ? plan.nombre : 'Plan Black KRONOFIT',
        precio: plan ? plan.precio : 45990,
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        renovacionAutomatica: true,
        estado: 'activa',
        metodoPago: 'Tarjeta de Crédito / Débito'
      };
      setSubscriptions(prev => [sub, ...prev]);
    }

    addToast('success', `Usuario ${newUser.nombre} ${newUser.apellido} registrado exitosamente.`);
    return { success: true, user: newUser };
  };

  const registerUser = userData => {
    const result = createUser({ ...userData, rol: 'alumno' });
    if (!result.success) return result;

    setCurrentUser(result.user);
    setCurrentView('alumno-clases');
    return result;
  };

  const updateUser = (id, userData) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...userData } : u)));
    if (currentUser?.id === id) {
      setCurrentUser(prev => (prev ? { ...prev, ...userData } : null));
    }
    addToast('success', 'Usuario actualizado correctamente.');
  };

  const deleteUser = id => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addToast('info', 'Usuario eliminado del sistema.');
  };

  const changePassword = (userId, newPass) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, password: newPass } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, password: newPass } : null));
    }
    addToast('success', 'Contraseña actualizada con éxito.');
    return { success: true, message: 'Contraseña actualizada correctamente.' };
  };

  // Class CRUD
  const createClass = classData => {
    const prof = users.find(u => u.id === classData.profesorId);
    const newClass = {
      id: `cls-${Date.now()}`,
      nombre: classData.nombre.trim(),
      descripcion: classData.descripcion ? classData.descripcion.trim() : 'Entrenamiento guiado por coach especializado.',
      profesorId: classData.profesorId || (users.find(u => u.rol === 'profesor')?.id || ''),
      profesorNombre: prof ? `${prof.nombre} ${prof.apellido}` : (classData.profesorNombre || 'Coach KRONOFIT'),
      categoria: classData.categoria || 'CrossFit & Funcional',
      intensidad: classData.intensidad || 'Media',
      sala: classData.sala ? classData.sala.trim() : 'Sala 1',
      horario: classData.horario ? classData.horario.trim() : 'Lunes y Miércoles 08:00 - 09:00',
      dias: classData.dias || ['Lunes', 'Miércoles'],
      horaInicio: classData.horaInicio || '08:00',
      horaFin: classData.horaFin || '09:00',
      cupoMaximo: Number(classData.cupoMaximo) || 16,
      cupoDisponible: Number(classData.cupoMaximo) || 16,
      imagen: classData.imagen || '/src/assets/images/class_functional_1794172184894.jpg',
      estado: classData.estado || 'activa'
    };
    setClasses(prev => [newClass, ...prev]);
    addToast('success', `Clase "${newClass.nombre}" programada.`);
  };

  const updateClass = (id, classData) => {
    setClasses(prev =>
      prev.map(c => {
        if (c.id === id) {
          const prof = classData.profesorId ? users.find(u => u.id === classData.profesorId) : null;
          return {
            ...c,
            ...classData,
            profesorNombre: prof ? `${prof.nombre} ${prof.apellido}` : c.profesorNombre
          };
        }
        return c;
      })
    );
    addToast('success', 'Clase actualizada con éxito.');
  };

  const deleteClass = id => {
    setClasses(prev => prev.filter(c => c.id !== id));
    addToast('info', 'Clase eliminada del catálogo.');
  };

  // Plan CRUD
  const createPlan = planData => {
    const newPlan = {
      id: `plan-${Date.now()}`,
      nombre: planData.nombre.trim(),
      precio: Number(planData.precio) || 39990,
      moneda: '$',
      periodo: planData.periodo || 'Mensual',
      duracionMeses: Number(planData.duracionMeses) || 1,
      clasesPorMes: planData.clasesPorMes || 'Clases Ilimitadas',
      beneficios: Array.isArray(planData.beneficios) ? planData.beneficios : ['Acceso a sala de pesas y cardio'],
      destacado: Boolean(planData.destacado),
      estado: planData.estado || 'activo',
      usuariosActivos: 0
    };
    setPlans(prev => [...prev, newPlan]);
    addToast('success', `Plan "${newPlan.nombre}" creado.`);
  };

  const updatePlan = (id, planData) => {
    setPlans(prev => prev.map(p => (p.id === id ? { ...p, ...planData } : p)));
    addToast('success', 'Plan actualizado correctamente.');
  };

  const deletePlan = id => {
    setPlans(prev => prev.filter(p => p.id !== id));
    addToast('info', 'Plan eliminado de las opciones.');
  };

  // Reservation Actions
  const bookClass = (claseId, alumnoId) => {
    const targetUserId = alumnoId || currentUser?.id;
    if (!targetUserId) {
      return { success: false, message: 'Debes iniciar sesión para reservar una clase.' };
    }

    const student = users.find(u => u.id === targetUserId);
    if (!student) {
      return { success: false, message: 'Alumno no encontrado en el sistema.' };
    }

    const gymClass = classes.find(c => c.id === claseId);
    if (!gymClass) {
      return { success: false, message: 'Clase no encontrada.' };
    }

    if (gymClass.cupoDisponible <= 0) {
      return { success: false, message: 'No quedan cupos libres en esta sesión.' };
    }

    const existing = reservations.find(
      r => r.claseId === claseId && r.alumnoId === targetUserId && r.estado === 'confirmada'
    );
    if (existing) {
      return { success: false, message: 'Ya posees una reserva confirmada para esta clase.' };
    }

    setClasses(prev =>
      prev.map(c => (c.id === claseId ? { ...c, cupoDisponible: Math.max(0, c.cupoDisponible - 1) } : c))
    );

    const newRes = {
      id: `res-${Date.now()}`,
      claseId: gymClass.id,
      claseNombre: gymClass.nombre,
      claseHorario: gymClass.horario,
      claseSala: gymClass.sala,
      alumnoId: student.id,
      alumnoNombre: `${student.nombre} ${student.apellido}`,
      alumnoEmail: student.email,
      profesorId: gymClass.profesorId,
      profesorNombre: gymClass.profesorNombre,
      fechaClase: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      fechaReserva: new Date().toISOString().replace('T', ' ').slice(0, 16),
      estado: 'confirmada',
      asistenciaRegistrada: false
    };

    setReservations(prev => [newRes, ...prev]);
    addToast('success', `¡Cupo reservado con éxito para ${gymClass.nombre}!`);
    return { success: true, message: 'Reserva confirmada.' };
  };

  const cancelReservation = reservationId => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    if (res.estado === 'confirmada') {
      setClasses(prev =>
        prev.map(c => (c.id === res.claseId ? { ...c, cupoDisponible: c.cupoDisponible + 1 } : c))
      );
    }

    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, estado: 'cancelada' } : r))
    );
    addToast('info', `Reserva cancelada para ${res.claseNombre}. Cupo liberado.`);
  };

  const confirmReservation = reservationId => {
    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, estado: 'confirmada' } : r))
    );
    addToast('success', 'Reserva confirmada.');
  };

  const updateReservationStatus = (reservationId, estado) => {
    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, estado } : r))
    );
    addToast('success', `Estado de reserva actualizado a "${estado}".`);
  };

  const toggleAttendance = (reservationId, attended) => {
    setReservations(prev =>
      prev.map(r => {
        if (r.id === reservationId) {
          return {
            ...r,
            asistenciaRegistrada: attended,
            asistenciaHora: attended ? new Date().toTimeString().slice(0, 5) : undefined,
            estado: attended ? 'asistio' : 'confirmada'
          };
        }
        return r;
      })
    );
    addToast(attended ? 'success' : 'info', attended ? 'Asistencia registrada' : 'Asistencia desmarcada');
  };

  // Subscription Actions
  const renewSubscription = subId => {
    setSubscriptions(prev =>
      prev.map(s => {
        if (s.id === subId) {
          const nextDate = new Date();
          nextDate.setMonth(nextDate.getMonth() + 1);
          return {
            ...s,
            estado: 'activa',
            fechaVencimiento: nextDate.toISOString().split('T')[0]
          };
        }
        return s;
      })
    );
    addToast('success', 'Suscripción renovada por 30 días adicionales.');
  };

  const cancelSubscription = subId => {
    setSubscriptions(prev =>
      prev.map(s => (s.id === subId ? { ...s, estado: 'cancelada', renovacionAutomatica: false } : s))
    );
    addToast('info', 'Suscripción cancelada. No se generarán cobros recurrentes.');
  };

  const createSubscription = subData => {
    const user = users.find(u => u.id === subData.usuarioId);
    const plan = plans.find(p => p.id === subData.planId);
    const newSub = {
      id: `sub-${Date.now()}`,
      usuarioId: subData.usuarioId || '',
      usuarioNombre: user ? `${user.nombre} ${user.apellido}` : (subData.usuarioNombre || 'Cliente KRONOFIT'),
      usuarioEmail: user ? user.email : (subData.usuarioEmail || ''),
      planId: subData.planId || 'plan-black',
      planNombre: plan ? plan.nombre : (subData.planNombre || 'Plan Black'),
      precio: plan ? plan.precio : (Number(subData.precio) || 45990),
      fechaInicio: subData.fechaInicio || new Date().toISOString().split('T')[0],
      fechaVencimiento: subData.fechaVencimiento || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      renovacionAutomatica: subData.renovacionAutomatica ?? true,
      estado: subData.estado || 'activa',
      metodoPago: subData.metodoPago || 'Tarjeta de Crédito / Débito'
    };
    setSubscriptions(prev => [newSub, ...prev]);
    addToast('success', `Suscripción asignada a ${newSub.usuarioNombre}.`);
  };

  const updateSubscription = (subId, subData) => {
    setSubscriptions(prev => prev.map(s => (s.id === subId ? { ...s, ...subData } : s)));
    addToast('success', 'Suscripción actualizada.');
  };

  return (
    <GymContext.Provider
      value={{
        currentUser,
        currentView,
        selectedClassId,
        viewingProfileUserId,
        preselectedPlanId,
        toasts,
        roles,
        systemPermissions: SYSTEM_PERMISSIONS,
        setCurrentView,
        setSelectedClassId,
        setViewingProfileUserId,
        setPreselectedPlanId,
        addToast,
        removeToast,
        login,
        logout,
        hasPermission,
        can,
        createRole,
        updateRole,
        deleteRole,
        users,
        classes,
        plans,
        reservations,
        subscriptions,
        createUser,
        updateUser,
        deleteUser,
        registerUser,
        changePassword,
        createClass,
        updateClass,
        deleteClass,
        createPlan,
        updatePlan,
        deletePlan,
        bookClass,
        cancelReservation,
        confirmReservation,
        updateReservationStatus,
        toggleAttendance,
        renewSubscription,
        cancelSubscription,
        createSubscription,
        updateSubscription
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym debe ser utilizado dentro de GymProvider');
  }
  return context;
};
