import { classFunctionalImage, classWellnessImage } from '../data/initialData.js';

const roleAliases = {
  admin: 'admin',
  administrador: 'admin',
  profesor: 'profesor',
  entrenador: 'profesor',
  alumno: 'alumno',
  cliente: 'alumno'
};

const formatLocalDate = value => {
  const [year, month, day] = String(value || '').slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return '';
  return new Date(year, month - 1, day).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const roleKey = name => {
  const normalized = String(name || '').trim().toLowerCase();
  return roleAliases[normalized] || normalized.replace(/\s+/g, '-');
};

export const mapRole = role => ({
  id: roleKey(role.name),
  backendId: role.id,
  nombre: role.name,
  descripcion: role.description || '',
  permisos: Array.isArray(role.permissions) ? role.permissions : [],
  esSistema: roleKey(role.name) === 'admin' || roleKey(role.name) === 'profesor' || roleKey(role.name) === 'alumno'
});

export const mapUser = user => ({
  id: String(user.id),
  nombre: user.firstName || user.paternalSurname || user.username || '',
  apellido: user.lastName || user.maternalSurname || '',
  email: user.email || '',
  telefono: user.phone || '',
  rut: user.rut || '',
  rol: roleKey(user.typeUser?.name),
  fechaRegistro: user.registrationDate || '',
  estado: user.active === false ? 'inactivo' : 'activo',
  planId: user.planId ? String(user.planId) : '',
  especialidad: user.specialty || '',
  bio: user.bio || '',
  contactoEmergencia: user.emergencyContact || '',
  avatar: user.avatar || '',
  backendRoleId: user.typeUser?.id
});

export const mapClass = gymClass => {
  const startDateValue = gymClass.startDate || '';
  const start = startDateValue ? new Date(startDateValue) : null;
  const end = gymClass.endDate ? new Date(gymClass.endDate) : null;
  const startTime = start && !Number.isNaN(start.getTime())
    ? start.toTimeString().slice(0, 5)
    : '';
  const endTime = end && !Number.isNaN(end.getTime())
    ? end.toTimeString().slice(0, 5)
    : '';
  const day = start && !Number.isNaN(start.getTime())
    ? start.toLocaleDateString('es-CL', { weekday: 'long' })
    : '';
  const category = gymClass.category || gymClass.typeClasse?.name || 'Clase deportiva';

  return {
    id: String(gymClass.id),
    nombre: gymClass.name || category,
    descripcion: gymClass.description || '',
    profesorId: gymClass.coachId ? String(gymClass.coachId) : '',
    profesorNombre: gymClass.coachName || 'Coach KRONOFIT',
    categoria: category,
    intensidad: gymClass.intensity || 'Media',
    sala: gymClass.room || 'Sala principal',
    horario: `${day}${day ? ' ' : ''}${startTime}${endTime ? ` - ${endTime}` : ''}`.trim(),
    fecha: startDateValue,
    fechaVisible: formatLocalDate(startDateValue),
    dias: day ? [day] : [],
    horaInicio: startTime || '08:00',
    horaFin: endTime || '09:00',
    cupoMaximo: gymClass.maximumCapacity || 0,
    cupoDisponible: gymClass.spotsAvailable || 0,
    imagen: gymClass.image || (category.toLowerCase().includes('bienestar')
      ? classWellnessImage
      : classFunctionalImage),
    estado: gymClass.active === false ? 'inactiva' : 'activa',
    backendTypeId: gymClass.typeClasse?.id
  };
};

export const mapPlan = plan => ({
  id: String(plan.id),
  nombre: plan.name,
  precio: Number(plan.price),
  moneda: '$',
  periodo: plan.period || 'Mensual',
  duracionMeses: plan.durationMonths || Math.max(1, Math.round((plan.durationDays || 30) / 30)),
  clasesPorMes: plan.classesPerMonth || 'Clases según disponibilidad',
  beneficios: Array.isArray(plan.benefits)
    ? plan.benefits
    : String(plan.benefits || '').split('\n').filter(Boolean),
  destacado: Boolean(plan.featured),
  estado: plan.active === false ? 'inactivo' : 'activo',
  usuariosActivos: plan.activeSubscriptions || 0
});

export const mapReservation = (reservation, classes = [], users = []) => {
  const gymClass = reservation.classe || classes.find(item => item.id === String(reservation.idClasse));
  const student = reservation.user || users.find(item => item.id === String(reservation.idUser));
  const coach = reservation.coach;
  return {
    id: String(reservation.idReservation),
    claseId: String(reservation.idClasse),
    claseNombre: gymClass?.name || gymClass?.nombre || gymClass?.typeClasse?.name || 'Clase deportiva',
    claseHorario: gymClass?.startDate || gymClass?.fecha || '',
    claseSala: gymClass?.room || gymClass?.sala || '',
    alumnoId: String(reservation.idUser),
    alumnoNombre: [
      student?.firstName || student?.nombre || student?.paternalSurname,
      student?.lastName || student?.apellido || student?.maternalSurname
    ].filter(Boolean).join(' '),
    alumnoEmail: student?.email || '',
    profesorId: reservation.idCoach ? String(reservation.idCoach) : gymClass?.profesorId || '',
    profesorNombre: [
      coach?.firstName || coach?.paternalSurname || coach?.username,
      coach?.lastName || coach?.maternalSurname
    ].filter(Boolean).join(' ') || gymClass?.coachName || gymClass?.profesorNombre || '',
    fechaClase: reservation.reservationDate || '',
    fechaVisible: formatLocalDate(reservation.reservationDate),
    fechaReserva: reservation.createdAt || '',
    estado: String(reservation.reservationStatus || '').toLowerCase(),
    asistenciaRegistrada: Boolean(reservation.attended),
    backendReservation: reservation
  };
};

export const mapSubscription = (subscription, users = [], plans = []) => {
  const user = users.find(item => item.id === String(subscription.userId));
  const plan = plans.find(item => item.id === String(subscription.plansId));
  return {
    id: String(subscription.id),
    usuarioId: String(subscription.userId),
    usuarioNombre: subscription.userName || (user ? `${user.nombre} ${user.apellido}` : ''),
    usuarioEmail: subscription.userEmail || user?.email || '',
    planId: String(subscription.plansId),
    planNombre: subscription.planName || plan?.nombre || '',
    precio: Number(subscription.price || plan?.precio || 0),
    fechaInicio: subscription.startDate || '',
    fechaVencimiento: subscription.endDate || '',
    renovacionAutomatica: Boolean(subscription.autoRenew),
    estado: subscription.state ? 'activa' : 'cancelada',
    metodoPago: subscription.paymentMethod || ''
  };
};
