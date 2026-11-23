import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CLASSES,
  INITIAL_PLANS,
  INITIAL_ROLES,
  SYSTEM_PERMISSIONS,
} from '../data/initialData.js';
import { apiDelete, apiGet, apiPost, apiPut, refreshSession } from '../services/api.js';
import {
  clearSession,
  getSessionRefreshToken,
  getSessionToken,
  getSessionTokenExpiry,
  getSessionUserId,
  saveSession
} from '../services/authSession.js';
import { mapClass, mapPlan, mapReservation, mapRole, mapSubscription, mapUser } from '../services/gymMappers.js';

const GymContext = createContext(undefined);

export const GymProvider = ({ children }) => {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [reservations, setReservations] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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

  function addToast(tipo, mensaje) {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts(prev => [...prev, { id, tipo, mensaje }]);
    setTimeout(() => removeToast(id), 4000);
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }

  useEffect(() => {
    localStorage.removeItem('kronofit_users');
    localStorage.removeItem('kronofit_current_user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('kronofit_user_id');
    const savedUserId = getSessionUserId();

    const loadPublicData = async () => {
      try {
        const [backendRoles, backendClasses, backendPlans] = await Promise.all([
          apiGet('/type-users'),
          apiGet('/classes'),
          apiGet('/plans')
        ]);
        setRoles(backendRoles.map(role => {
          const mappedRole = mapRole(role);
          const defaultRole = INITIAL_ROLES.find(item => item.id === mappedRole.id);
          return {
            ...defaultRole,
            ...mappedRole,
            permisos: role.permissions?.length ? role.permissions : defaultRole?.permisos || []
          };
        }));
        setClasses(backendClasses.map(mapClass));
        setPlans(backendPlans.map(mapPlan));
        return { classes: backendClasses.map(mapClass), plans: backendPlans.map(mapPlan) };
      } catch (error) {
        addToast('error', `No se pudieron cargar los datos del centro: ${error.message}`);
        return null;
      }
    };

    const restoreSession = async publicData => {
      if (!getSessionToken() || !savedUserId) return;
      let user;
      try {
        user = mapUser(await apiGet(`/users/${savedUserId}`));
      } catch (error) {
        clearSession();
        addToast('error', `No se pudo restaurar la sesión: ${error.message}`);
        return;
      }

      setCurrentUser(user);
      setCurrentView(user.rol === 'admin' ? 'admin-usuarios' : user.rol === 'profesor' ? 'profesor-clases' : 'alumno-clases');
      try {
        const requests = user.rol === 'admin'
          ? [apiGet('/users'), apiGet('/reservations'), apiGet('/subscriptions')]
          : user.rol === 'alumno'
            ? [null, apiGet(`/reservations/by-user/${user.id}`), apiGet(`/subscriptions/by-user/${user.id}`)]
            : [null, apiGet(`/reservations/by-coach/${user.id}`), null];
        const [backendUsers, backendReservations, backendSubscriptions] = await Promise.all(
          requests.map(request => request || Promise.resolve([]))
        );
        const mappedUsers = backendUsers.length ? backendUsers.map(mapUser) : [user];
        setUsers(mappedUsers);
        if (backendReservations) {
          setReservations(backendReservations.map(item => mapReservation(item, publicData?.classes || [], mappedUsers)));
          if (user.rol === 'profesor') {
            setUsers(prev => [
              ...prev,
              ...backendReservations.map(item => item.user ? mapUser(item.user) : null)
                .filter(item => item && item.id !== user.id)
            ]);
          }
        }
        if (backendSubscriptions) {
          setSubscriptions(backendSubscriptions.map(item => mapSubscription(item, mappedUsers, publicData?.plans || [])));
        }
      } catch (error) {
        addToast('error', `No se pudieron cargar tus datos: ${error.message}`);
      }
    };

    const initialize = async () => {
      await restoreSession(await loadPublicData());
    };
    initialize();
  }, []);

  useEffect(() => {
    if (!currentUser || !getSessionRefreshToken()) return undefined;
    let timer;
    const scheduleRefresh = () => {
      const expiresAt = getSessionTokenExpiry();
      if (!expiresAt) return;
      const delay = Math.max(1000, expiresAt - Date.now() - 60_000);
      timer = setTimeout(() => {
        refreshSession().then(scheduleRefresh).catch(() => {});
      }, delay);
    };
    scheduleRefresh();
    return () => clearTimeout(timer);
  }, [currentUser]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setCurrentUser(null);
      setUsers([]);
      setReservations([]);
      setSubscriptions([]);
      setCurrentView('login');
      addToast('error', 'La sesión expiró. Inicia sesión nuevamente.');
    };
    window.addEventListener('kronofit:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('kronofit:unauthorized', handleUnauthorized);
  }, []);

  // Permission Verification
  const hasPermission = permissionId => {
    if (!currentUser) return false;
    const userRoleDef = roles.find(r => r.id === currentUser.rol);
    if (!userRoleDef || !Array.isArray(userRoleDef.permisos)) return false;
    return userRoleDef.permisos.includes(permissionId);
  };

  const can = hasPermission;

  // Roles CRUD
  const createRole = async roleData => {
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

    const existing = roles.some(r => r.id === slug || r.nombre.toLowerCase() === roleData.nombre.trim().toLowerCase());
    if (existing) {
      return { success: false, error: `Ya existe un rol con el identificador "${slug}".` };
    }

    try {
      const saved = await apiPost('/type-users', {
        name: roleData.nombre.trim(),
        description: roleData.descripcion || '',
        permissions: roleData.permisos || []
      });
      const newRole = {
        ...mapRole(saved),
        id: slug,
        descripcion: roleData.descripcion || '',
        permisos: Array.isArray(roleData.permisos) ? roleData.permisos : [],
        esSistema: false
      };

      setRoles(prev => [...prev, newRole]);
      addToast('success', `Rol "${newRole.nombre}" creado exitosamente.`);
      return { success: true, role: newRole };
    } catch (error) {
      addToast('error', `No se pudo crear el rol: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const updateRole = async (id, roleData) => {
    const target = roles.find(r => r.id === id);
    if (!target) {
      return { success: false, error: 'Rol no encontrado.' };
    }

    if (!target.backendId) return { success: false, error: 'El rol todavía no está sincronizado con el servidor.' };

    try {
      const saved = await apiPut(`/type-users/${target.backendId}`, {
        name: roleData.nombre ? roleData.nombre.trim() : target.nombre,
        description: roleData.descripcion !== undefined ? roleData.descripcion.trim() : target.descripcion,
        permissions: Array.isArray(roleData.permisos) ? roleData.permisos : target.permisos
      });
      setRoles(prev => prev.map(r => r.id === id ? {
        ...r,
        nombre: saved.name,
        descripcion: saved.description || '',
        permisos: saved.permissions || roleData.permisos || r.permisos
      } : r));
      addToast('success', `Permisos del rol "${roleData.nombre || target.nombre}" actualizados.`);
      return { success: true };
    } catch (error) {
      addToast('error', `No se pudo actualizar el rol: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const deleteRole = async id => {
    if (id === 'admin') {
      addToast('error', 'El rol de Administrador General del sistema no puede eliminarse.');
      return false;
    }

    const usersWithRole = users.filter(u => u.rol === id);
    if (usersWithRole.length > 0) {
      addToast('error', `No se puede eliminar: hay ${usersWithRole.length} usuario(s) asignados a este rol.`);
      return false;
    }

    const target = roles.find(role => role.id === id);
    if (!target?.backendId) {
      addToast('error', 'El rol todavía no está sincronizado con el servidor.');
      return false;
    }
    try {
      await apiDelete(`/type-users/${target.backendId}`);
      setRoles(prev => prev.filter(r => r.id !== id));
      addToast('info', 'Rol eliminado del catálogo.');
      return true;
    } catch (error) {
      addToast('error', `No se pudo eliminar el rol: ${error.message}`);
      return false;
    }
  };

  // Auth & Session
  const login = async (username, password) => {
    let user;
    try {
      const auth = await apiPost('/auth/login', {
        username: username.trim().toLowerCase(),
        password
      });
      if (!auth?.token || !auth.refreshToken || !auth.idUsuario) {
        throw new Error(auth?.mensaje || 'El servidor no entregó tokens válidos.');
      }
      saveSession(auth.token, auth.idUsuario, auth.refreshToken);
      user = mapUser(await apiGet(`/users/${auth.idUsuario}`));
      saveSession(auth.token, user.id, auth.refreshToken);
    } catch (error) {
      clearSession();
      setCurrentUser(null);
      addToast('error', `No se pudo iniciar sesión: ${error.message}`);
      return false;
    }

    setCurrentUser(user);
    const targetView = user.rol === 'admin'
      ? 'admin-usuarios'
      : user.rol === 'profesor' ? 'profesor-clases' : 'alumno-clases';
    setCurrentView(targetView);
    try {
      const [backendUsers, backendReservations, backendSubscriptions] = user.rol === 'admin'
        ? await Promise.all([apiGet('/users'), apiGet('/reservations'), apiGet('/subscriptions')])
        : user.rol === 'alumno'
          ? await Promise.all([
            Promise.resolve([]),
            apiGet(`/reservations/by-user/${user.id}`).catch(error => {
              addToast('error', `No se pudieron cargar tus reservas: ${error.message}`);
              return [];
            }),
            apiGet(`/subscriptions/by-user/${user.id}`).catch(error => {
              addToast('error', `No se pudieron cargar tus suscripciones: ${error.message}`);
              return [];
            })
          ])
          : await Promise.all([Promise.resolve([]), apiGet(`/reservations/by-coach/${user.id}`), Promise.resolve([])]);
      setUsers(backendUsers.length ? backendUsers.map(mapUser) : [user]);
      const mappedUsers = backendUsers.length ? backendUsers.map(mapUser) : [user];
      setReservations(backendReservations.map(item => mapReservation(item, [], mappedUsers)));
      setSubscriptions(backendSubscriptions.map(item => mapSubscription(item, mappedUsers, [])));
      if (user.rol === 'profesor') {
        setUsers(prev => [
          ...prev,
          ...backendReservations.map(item => item.user ? mapUser(item.user) : null)
            .filter(item => item && item.id !== user.id)
        ]);
      }
      addToast('success', `¡Bienvenido(a), ${user.nombre}!`);
      return true;
    } catch (error) {
      setUsers([user]);
      setReservations([]);
      setSubscriptions([]);
      addToast('error', `Sesión iniciada, pero no se pudieron cargar tus datos: ${error.message}`);
      return true;
    }
  };

  const logout = () => {
    clearSession();
    setCurrentUser(null);
    setUsers([]);
    setReservations([]);
    setSubscriptions([]);
    setCurrentView('inicio');
    addToast('info', 'Has cerrado sesión exitosamente.');
  };

  // User CRUD
  const toUserRequest = userData => {
    const userRole = roles.find(role => role.id === (userData.rol || 'alumno'));
    if (!userRole?.backendId) {
      throw new Error('El rol seleccionado no está disponible en el servidor.');
    }

    return {
      username: userData.email.trim().toLowerCase(),
      paternalSurname: userData.nombre.trim(),
      maternalSurname: userData.apellido.trim(),
      email: userData.email.trim().toLowerCase(),
      phone: userData.telefono || '',
      typeUserId: userRole.backendId,
      firstName: userData.nombre.trim(),
      lastName: userData.apellido.trim(),
      rut: userData.rut || '',
      active: userData.estado !== 'inactivo',
      planId: userData.planId ? Number(userData.planId) : null,
      specialty: userData.especialidad || '',
      bio: userData.bio || '',
      emergencyContact: userData.contactoEmergencia || '',
      avatar: userData.avatar || '',
      registrationDate: userData.fechaRegistro || new Date().toISOString().slice(0, 10)
    };
  };

  const createUser = async userData => {
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

    try {
      const saved = await apiPost('/users', toUserRequest(userData));
      const newUser = mapUser(saved);
      if (userData.password) {
        await apiPost('/auth/credenciales', {
          username: newUser.email,
          password: userData.password,
          idUser: Number(newUser.id)
        });
      }
      setUsers(prev => [newUser, ...prev.filter(user => user.id !== newUser.id)]);
      addToast('success', `Usuario ${newUser.nombre} ${newUser.apellido} registrado exitosamente.`);
      return { success: true, user: newUser };
    } catch (error) {
      addToast('error', `No se pudo crear el usuario: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const registerUser = async userData => {
    try {
      const email = userData.email.trim().toLowerCase();
      await apiPost('/auth/register', {
        email,
        password: userData.password,
        paternalSurname: userData.nombre.trim(),
        maternalSurname: userData.apellido.trim(),
        phone: userData.telefono || '',
        firstName: userData.nombre.trim(),
        lastName: userData.apellido.trim(),
        rut: userData.rut || '',
        planId: userData.planId ? Number(userData.planId) : null,
        emergencyContact: userData.contactoEmergencia || '',
        avatar: userData.avatar || ''
      });
      const loggedIn = await login(email, userData.password);
      if (!loggedIn) throw new Error('La cuenta se creó, pero no se pudo iniciar sesión.');
      if (userData.planId) {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        const savedSubscription = await apiPost(`/subscriptions/by-user/${getSessionUserId()}`, {
          userId: Number(getSessionUserId()),
          plansId: Number(userData.planId),
          endDate: `${endDate.toISOString().slice(0, 10)}T23:59:59`,
          state: true,
          startDate: `${new Date().toISOString().slice(0, 10)}T00:00:00`,
          autoRenew: true,
          paymentMethod: 'Tarjeta de Crédito / Débito'
        });
        const plan = plans.find(item => item.id === String(userData.planId));
        const subscription = mapSubscription({
          ...savedSubscription,
          userName: `${userData.nombre.trim()} ${userData.apellido.trim()}`,
          userEmail: email,
          planName: plan?.nombre || '',
          price: plan?.precio || 0
        });
        setSubscriptions(prev => [subscription, ...prev.filter(item => item.id !== subscription.id)]);
      }
      return { success: true };
    } catch (error) {
      addToast('error', `No se pudo completar el registro: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const existing = users.find(user => user.id === id) || currentUser;
      const isOwnProfile = currentUser?.id === id;
      const saved = await apiPut(
        isOwnProfile ? `/users/${id}/profile` : `/users/${id}`,
        toUserRequest({ ...existing, ...userData })
      );
      const updatedUser = mapUser(saved);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      if (currentUser?.id === id) setCurrentUser(updatedUser);
      addToast('success', 'Usuario actualizado correctamente.');
      return { success: true, user: updatedUser };
    } catch (error) {
      addToast('error', `No se pudo actualizar el usuario: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const deleteUser = async id => {
    try {
      const credentials = await apiGet('/auth/credenciales');
      const userCredential = credentials.find(credential => String(credential.idUser) === id);
      if (userCredential) await apiDelete(`/auth/credenciales/${userCredential.idCredencial}`);
      await apiDelete(`/users/${id}`);
      setUsers(prev => prev.filter(user => user.id !== id));
      addToast('info', 'Usuario eliminado del sistema.');
      return true;
    } catch (error) {
      addToast('error', `No se pudo eliminar el usuario: ${error.message}`);
      return false;
    }
  };

  const changePassword = async (userId, newPass, currentPassword) => {
    try {
      await apiPut(`/auth/users/${userId}/password`, {
        currentPassword,
        newPassword: newPass
      });
      addToast('success', 'Contraseña actualizada con éxito.');
      return { success: true, message: 'Contraseña actualizada correctamente.' };
    } catch (error) {
      addToast('error', `No se pudo actualizar la contraseña: ${error.message}`);
      return { success: false, message: error.message };
    }
  };

  // Class CRUD
  const classRequest = async (classData, existingClass) => {
    const categories = await apiGet('/type-classes');
    let category = categories.find(item => item.name.toLowerCase() === classData.categoria.trim().toLowerCase());
    if (!category) category = await apiPost('/type-classes', { name: classData.categoria.trim() });

    const [startTime, endTime] = (classData.horario.match(/\b\d{1,2}:\d{2}\b/g) || []);
    const start = existingClass?.fecha ? new Date(existingClass.fecha) : new Date();
    const weekdayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const scheduledDay = (classData.dias || []).map(day => day.toLowerCase())[0]
      || weekdayNames.find(day => classData.horario.toLowerCase().includes(day));
    if (!existingClass && scheduledDay) {
      const targetDay = weekdayNames.indexOf(scheduledDay);
      if (targetDay >= 0) {
        let dayOffset = (targetDay - start.getDay() + 7) % 7;
        const [hour, minute] = (startTime || '08:00').split(':').map(Number);
        if (dayOffset === 0 && (hour < start.getHours() || (hour === start.getHours() && minute <= start.getMinutes()))) {
          dayOffset = 7;
        }
        start.setDate(start.getDate() + dayOffset);
      }
    }
    const toDateTime = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;
    const [startHour, startMinute] = (startTime || classData.horaInicio || '08:00').split(':').map(Number);
    const [endHour, endMinute] = (endTime || classData.horaFin || '09:00').split(':').map(Number);
    start.setHours(startHour, startMinute, 0, 0);
    const end = new Date(start);
    end.setHours(endHour, endMinute, 0, 0);
    if (end <= start) end.setDate(end.getDate() + 1);

    const coach = users.find(user => user.id === classData.profesorId);
    return {
      startDate: toDateTime(start),
      endDate: toDateTime(end),
      maximumCapacity: Number(classData.cupoMaximo),
      spotsAvailable: existingClass
        ? Math.min(existingClass.cupoDisponible, Number(classData.cupoMaximo))
        : Number(classData.cupoMaximo),
      typeClasse: { id: category.id, name: category.name },
      name: classData.nombre.trim(),
      description: classData.descripcion || '',
      coachId: classData.profesorId ? Number(classData.profesorId) : null,
      coachName: coach ? `${coach.nombre} ${coach.apellido}` : '',
      intensity: classData.intensidad || 'Media',
      room: classData.sala || '',
      image: classData.imagen || '',
      active: classData.estado !== 'inactiva'
    };
  };

  const createClass = async classData => {
    try {
      const saved = await apiPost('/classes', await classRequest(classData));
      const newClass = mapClass(saved);
      setClasses(prev => [newClass, ...prev]);
      addToast('success', `Clase "${newClass.nombre}" programada.`);
      return { success: true, class: newClass };
    } catch (error) {
      addToast('error', `No se pudo crear la clase: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const updateClass = async (id, classData) => {
    try {
      const existing = classes.find(gymClass => gymClass.id === id);
      const saved = await apiPut(`/classes/${id}`, await classRequest(classData, existing));
      const updatedClass = mapClass(saved);
      setClasses(prev => prev.map(gymClass => gymClass.id === id ? updatedClass : gymClass));
      addToast('success', 'Clase actualizada con éxito.');
      return { success: true, class: updatedClass };
    } catch (error) {
      addToast('error', `No se pudo actualizar la clase: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const deleteClass = async id => {
    try {
      await apiDelete(`/classes/${id}`);
      setClasses(prev => prev.filter(gymClass => gymClass.id !== id));
      addToast('info', 'Clase eliminada del catálogo.');
      return true;
    } catch (error) {
      addToast('error', `No se pudo eliminar la clase: ${error.message}`);
      return false;
    }
  };

  // Plan CRUD
  const planRequest = planData => ({
    name: planData.nombre.trim(),
    price: Number(planData.precio),
    durationDays: Number(planData.duracionMeses) * 30,
    period: planData.periodo || 'Mensual',
    classesPerMonth: planData.clasesPorMes || 'Clases Ilimitadas',
    benefits: Array.isArray(planData.beneficios) ? planData.beneficios.join('\n') : '',
    featured: Boolean(planData.destacado),
    active: planData.estado !== 'inactivo'
  });

  const createPlan = async planData => {
    try {
      const saved = await apiPost('/plans', planRequest(planData));
      const newPlan = mapPlan(saved);
      setPlans(prev => [...prev, newPlan]);
      addToast('success', `Plan "${newPlan.nombre}" creado.`);
      return { success: true, plan: newPlan };
    } catch (error) {
      addToast('error', `No se pudo crear el plan: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const updatePlan = async (id, planData) => {
    try {
      const saved = await apiPut(`/plans/${id}`, planRequest(planData));
      const updatedPlan = mapPlan(saved);
      setPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan));
      addToast('success', 'Plan actualizado correctamente.');
      return { success: true, plan: updatedPlan };
    } catch (error) {
      addToast('error', `No se pudo actualizar el plan: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const deletePlan = async id => {
    try {
      await apiDelete(`/plans/${id}`);
      setPlans(prev => prev.filter(plan => plan.id !== id));
      addToast('info', 'Plan eliminado de las opciones.');
      return true;
    } catch (error) {
      addToast('error', `No se pudo eliminar el plan: ${error.message}`);
      return false;
    }
  };

  // Reservation Actions
  const bookClass = async (claseId, alumnoId) => {
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

    try {
      const request = {
        idUser: Number(student.id),
        idClasse: Number(gymClass.id),
        idCoach: gymClass.profesorId ? Number(gymClass.profesorId) : null,
        reservationDate: gymClass.fecha || `${new Date().toISOString().slice(0, 10)}T${gymClass.horaInicio || '08:00'}:00`,
        reservationStatus: 'CONFIRMADA'
      };
      const reservationPath = currentUser?.rol === 'alumno' && currentUser.id === targetUserId
        ? `/reservations/by-user/${currentUser.id}`
        : '/reservations';
      const saved = await apiPost(reservationPath, request);
      const reservation = mapReservation(saved, classes, users);
      setClasses(prev => prev.map(item => item.id === gymClass.id
        ? { ...item, cupoDisponible: Math.max(0, item.cupoDisponible - 1) }
        : item));
      setReservations(prev => [reservation, ...prev]);
      addToast('success', `¡Cupo reservado con éxito para ${gymClass.nombre}!`);
      return { success: true, message: 'Reserva confirmada.' };
    } catch (error) {
      addToast('error', `No se pudo completar la reserva: ${error.message}`);
      return { success: false, message: error.message };
    }
  };

  const reservationRequest = (reservation, status) => ({
    idUser: Number(reservation.backendReservation?.idUser || reservation.alumnoId),
    idClasse: Number(reservation.backendReservation?.idClasse || reservation.claseId),
    idCoach: reservation.backendReservation?.idCoach || (reservation.profesorId ? Number(reservation.profesorId) : null),
    reservationDate: reservation.backendReservation?.reservationDate || `${reservation.fechaClase}T08:00:00`,
    reservationStatus: status.toUpperCase()
  });

  const cancelReservation = async reservationId => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    try {
      const reservationPath = currentUser?.rol === 'alumno' && currentUser.id === res.alumnoId
        ? `/reservations/by-user/${currentUser.id}/${reservationId}`
        : `/reservations/${reservationId}`;
      const saved = await apiPut(reservationPath, reservationRequest(res, 'cancelada'));
      const updatedReservation = mapReservation(saved, classes, users);
      if (res.estado === 'confirmada') {
        setClasses(prev => prev.map(item => item.id === res.claseId
          ? { ...item, cupoDisponible: Math.min(item.cupoMaximo, item.cupoDisponible + 1) }
          : item));
      }
      setReservations(prev => prev.map(item => item.id === reservationId ? updatedReservation : item));
      addToast('info', `Reserva cancelada para ${res.claseNombre}. Cupo liberado.`);
    } catch (error) {
      addToast('error', `No se pudo cancelar la reserva: ${error.message}`);
    }
  };

  const confirmReservation = async reservationId => {
    const reservation = reservations.find(item => item.id === reservationId);
    const alreadyConfirmed = reservation && reservations.some(item => (
      item.id !== reservationId
      && item.alumnoId === reservation.alumnoId
      && item.claseId === reservation.claseId
      && item.estado === 'confirmada'
    ));
    if (alreadyConfirmed) {
      addToast('info', 'Ya tienes una reserva confirmada para esta clase; no se ocupará otro cupo.');
      return;
    }
    await updateReservationStatus(reservationId, 'confirmada');
  };

  const updateReservationStatus = async (reservationId, estado) => {
    const reservation = reservations.find(item => item.id === reservationId);
    if (!reservation) return;
    try {
      const reservationPath = currentUser?.rol === 'alumno' && currentUser.id === reservation.alumnoId
        ? `/reservations/by-user/${currentUser.id}/${reservationId}`
        : `/reservations/${reservationId}`;
      const saved = await apiPut(reservationPath, reservationRequest(reservation, estado));
      const wasConfirmed = reservation.estado === 'confirmada';
      const willBeConfirmed = estado.toLowerCase() === 'confirmada';
      if (wasConfirmed !== willBeConfirmed) {
        const change = willBeConfirmed ? -1 : 1;
        setClasses(prev => prev.map(item => item.id === reservation.claseId
          ? {
            ...item,
            cupoDisponible: Math.max(0, Math.min(item.cupoMaximo, item.cupoDisponible + change))
          }
          : item));
      }
      setReservations(prev => prev.map(item => item.id === reservationId
        ? mapReservation(saved, classes, users)
        : item));
      addToast('success', `Estado de reserva actualizado a "${estado}".`);
    } catch (error) {
      addToast('error', `No se pudo actualizar la reserva: ${error.message}`);
    }
  };

  const toggleAttendance = async (reservationId, attended) => {
    const reservation = reservations.find(item => item.id === reservationId);
    if (!reservation) return;
    try {
      const attendanceRows = await apiGet(`/assistances/by-classe/${reservation.claseId}`);
      const existing = attendanceRows.find(row => String(row.idClasse) === reservation.claseId);
      if (attended) {
        const body = {
          idUser: Number(reservation.alumnoId),
          idClasse: Number(reservation.claseId),
          arrivalTime: new Date().toISOString().slice(0, 19),
          assist: true
        };
        if (existing) await apiPut(`/assistances/${existing.idAssistance}`, body);
        else await apiPost('/assistances', body);
      } else if (existing) {
        await apiDelete(`/assistances/${existing.idAssistance}`);
      }
      setReservations(prev => prev.map(item => item.id === reservationId
        ? { ...item, asistenciaRegistrada: attended, estado: attended ? 'asistio' : 'confirmada' }
        : item));
      addToast(attended ? 'success' : 'info', attended ? 'Asistencia registrada' : 'Asistencia desmarcada');
    } catch (error) {
      addToast('error', `No se pudo actualizar la asistencia: ${error.message}`);
    }
  };

  // Subscription Actions
  const toDateTime = (value, time) => (
    String(value || '').includes('T') ? value : `${value}T${time}`
  );

  const subscriptionRequest = (subscription, overrides = {}) => ({
    userId: Number(subscription.usuarioId),
    plansId: Number(subscription.planId),
    endDate: toDateTime(overrides.fechaVencimiento || subscription.fechaVencimiento, '23:59:59'),
    state: overrides.estado ? overrides.estado === 'activa' : subscription.estado === 'activa',
    startDate: toDateTime(subscription.fechaInicio || new Date().toISOString().slice(0, 10), '00:00:00'),
    autoRenew: overrides.renovacionAutomatica ?? subscription.renovacionAutomatica,
    paymentMethod: subscription.metodoPago || ''
  });

  const renewSubscription = async subId => {
    const subscription = subscriptions.find(item => item.id === subId);
    if (!subscription) return;
    try {
      const saved = currentUser?.rol === 'alumno' && currentUser.id === subscription.usuarioId
        ? await apiPost(`/subscriptions/by-user/${currentUser.id}/${subId}/renew`, {})
        : await apiPut(`/subscriptions/${subId}`, subscriptionRequest(subscription, {
          estado: 'activa'
        }));
      setSubscriptions(prev => prev.map(item => item.id === subId
        ? mapSubscription(saved, users, plans)
        : item));
      const plan = plans.find(item => item.id === subscription.planId);
      addToast('success', `Suscripción renovada por ${plan?.duracionDias || 30} días adicionales.`);
    } catch (error) {
      addToast('error', `No se pudo renovar la suscripción: ${error.message}`);
    }
  };

  const cancelSubscription = async subId => {
    const subscription = subscriptions.find(item => item.id === subId);
    if (!subscription) return;
    try {
      const saved = currentUser?.rol === 'alumno' && currentUser.id === subscription.usuarioId
        ? await apiPost(`/subscriptions/by-user/${currentUser.id}/${subId}/cancel`, {})
        : await apiPut(`/subscriptions/${subId}`, subscriptionRequest(subscription, {
          estado: 'cancelada',
          renovacionAutomatica: false
        }));
      setSubscriptions(prev => prev.map(item => item.id === subId
        ? mapSubscription(saved, users, plans)
        : item));
      addToast('info', 'Suscripción cancelada. No se generarán cobros recurrentes.');
    } catch (error) {
      addToast('error', `No se pudo cancelar la suscripción: ${error.message}`);
    }
  };

  const createSubscription = async (userOrData, planId, paymentMethod) => {
    const subData = typeof userOrData === 'object'
      ? userOrData
      : { usuarioId: userOrData, planId, metodoPago: paymentMethod };
    const user = users.find(item => item.id === String(subData.usuarioId)) || currentUser;
    const plan = plans.find(item => item.id === String(subData.planId));
    const toLocalDate = date => [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + (plan?.duracionDias || 30));
    const startDate = subData.fechaInicio || toLocalDate(start);
    const endDate = subData.fechaVencimiento || toLocalDate(end);
    try {
      const subscriptionPath = currentUser?.rol === 'alumno' && currentUser.id === String(subData.usuarioId)
        ? `/subscriptions/by-user/${currentUser.id}`
        : '/subscriptions';
      const saved = await apiPost(subscriptionPath, {
        userId: Number(subData.usuarioId),
        plansId: Number(subData.planId),
        endDate: `${endDate}T23:59:59`,
        startDate: `${startDate}T00:00:00`,
        state: true,
        autoRenew: subData.renovacionAutomatica ?? true,
        paymentMethod: subData.metodoPago || 'Tarjeta de Crédito / Débito'
      });
      const newSub = mapSubscription({
        ...saved,
        userName: user ? `${user.nombre} ${user.apellido}` : '',
        userEmail: user?.email || '',
        planName: plan?.nombre || '',
        price: plan?.precio || 0
      }, users, plans);
      setSubscriptions(prev => [newSub, ...prev]);
      addToast('success', `Suscripción asignada a ${newSub.usuarioNombre || user?.nombre || 'el usuario'}.`);
      return { success: true, subscription: newSub };
    } catch (error) {
      addToast('error', `No se pudo crear la suscripción: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const updateSubscription = async (subId, subData) => {
    const subscription = subscriptions.find(item => item.id === subId);
    if (!subscription) return { success: false, error: 'Suscripción no encontrada.' };
    try {
      const saved = await apiPut(`/subscriptions/${subId}`, subscriptionRequest(subscription, subData));
      setSubscriptions(prev => prev.map(item => item.id === subId
        ? mapSubscription(saved, users, plans)
        : item));
      addToast('success', 'Suscripción actualizada.');
      return { success: true };
    } catch (error) {
      addToast('error', `No se pudo actualizar la suscripción: ${error.message}`);
      return { success: false, error: error.message };
    }
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
