import classFunctionalImage from '../assets/class_functional_1794172184894.jpg';
import classWellnessImage from '../assets/class_wellness_1794172196807.jpg';
import heroGymImage from '../assets/hero_gym_modern_1794172172469.jpg';

export { classFunctionalImage, classWellnessImage, heroGymImage };

export const SYSTEM_PERMISSIONS = [
  // Módulo Usuarios
  { id: 'usuarios:ver', accion: 'ver', modulo: 'Usuarios', nombre: 'Ver Usuarios', descripcion: 'Visualizar lista y datos de usuarios' },
  { id: 'usuarios:crear', accion: 'crear', modulo: 'Usuarios', nombre: 'Crear Usuarios', descripcion: 'Registrar nuevos administradores, profesores y alumnos' },
  { id: 'usuarios:editar', accion: 'editar', modulo: 'Usuarios', nombre: 'Editar Usuarios', descripcion: 'Modificar datos personales y estado de cuentas' },
  { id: 'usuarios:eliminar', accion: 'eliminar', modulo: 'Usuarios', nombre: 'Eliminar Usuarios', descripcion: 'Eliminar usuarios del sistema' },

  // Módulo Roles
  { id: 'roles:ver', accion: 'ver', modulo: 'Roles', nombre: 'Ver Roles', descripcion: 'Visualizar roles y sus permisos asignados' },
  { id: 'roles:crear', accion: 'crear', modulo: 'Roles', nombre: 'Crear Roles', descripcion: 'Crear nuevos roles con permisos personalizados' },
  { id: 'roles:editar', accion: 'editar', modulo: 'Roles', nombre: 'Editar Roles', descripcion: 'Modificar nombres y asignar/revocar permisos' },
  { id: 'roles:eliminar', accion: 'eliminar', modulo: 'Roles', nombre: 'Eliminar Roles', descripcion: 'Eliminar roles personalizados' },

  // Módulo Clases
  { id: 'clases:ver', accion: 'ver', modulo: 'Clases', nombre: 'Ver Clases', descripcion: 'Explorar catálogo de clases, salas y horarios' },
  { id: 'clases:crear', accion: 'crear', modulo: 'Clases', nombre: 'Crear Clases', descripcion: 'Programar nuevas sesiones y definir aforos' },
  { id: 'clases:editar', accion: 'editar', modulo: 'Clases', nombre: 'Editar Clases', descripcion: 'Actualizar profesores, horarios y cupos' },
  { id: 'clases:eliminar', accion: 'eliminar', modulo: 'Clases', nombre: 'Eliminar Clases', descripcion: 'Remover clases del catálogo' },
  { id: 'clases:asistencia', accion: 'asistencia', modulo: 'Clases', nombre: 'Tomar Asistencia', descripcion: 'Registrar asistencia interactiva de alumnos' },

  // Módulo Planes
  { id: 'planes:ver', accion: 'ver', modulo: 'Planes', nombre: 'Ver Planes', descripcion: 'Consultar planes de membresía y tarifas' },
  { id: 'planes:crear', accion: 'crear', modulo: 'Planes', nombre: 'Crear Planes', descripcion: 'Dar de alta nuevos planes tarifarios' },
  { id: 'planes:editar', accion: 'editar', modulo: 'Planes', nombre: 'Editar Planes', descripcion: 'Modificar precios, periodos y beneficios' },
  { id: 'planes:eliminar', accion: 'eliminar', modulo: 'Planes', nombre: 'Eliminar Planes', descripcion: 'Remover planes de membresía' },

  // Módulo Reservas
  { id: 'reservas:ver', accion: 'ver', modulo: 'Reservas', nombre: 'Ver Reservas', descripcion: 'Consultar turnos y reservas de clases' },
  { id: 'reservas:crear', accion: 'crear', modulo: 'Reservas', nombre: 'Crear Reserva', descripcion: 'Reservar cupo en una clase' },
  { id: 'reservas:editar', accion: 'editar', modulo: 'Reservas', nombre: 'Confirmar Reserva', descripcion: 'Modificar o re-confirmar reserva' },
  { id: 'reservas:eliminar', accion: 'eliminar', modulo: 'Reservas', nombre: 'Cancelar Reserva', descripcion: 'Cancelar reserva y liberar cupo' },

  // Módulo Suscripciones
  { id: 'suscripciones:ver', accion: 'ver', modulo: 'Suscripciones', nombre: 'Ver Suscripciones', descripcion: 'Consultar estado y vencimientos' },
  { id: 'suscripciones:crear', accion: 'crear', modulo: 'Suscripciones', nombre: 'Crear Suscripción', descripcion: 'Asignar membresía a un usuario' },
  { id: 'suscripciones:editar', accion: 'editar', modulo: 'Suscripciones', nombre: 'Renovar Suscripción', descripcion: 'Extender vigencia de membresía' },
  { id: 'suscripciones:eliminar', accion: 'eliminar', modulo: 'Suscripciones', nombre: 'Cancelar Suscripción', descripcion: 'Pausar o cancelar cobros' }
];

export const INITIAL_ROLES = [
  {
    id: 'admin',
    nombre: 'Administrador General',
    descripcion: 'Control total de la plataforma: gestión completa de usuarios, roles, clases, planes, reservas y suscripciones.',
    permisos: [
      'usuarios:ver', 'usuarios:crear', 'usuarios:editar', 'usuarios:eliminar',
      'roles:ver', 'roles:crear', 'roles:editar', 'roles:eliminar',
      'clases:ver', 'clases:crear', 'clases:editar', 'clases:eliminar', 'clases:asistencia',
      'planes:ver', 'planes:crear', 'planes:editar', 'planes:eliminar',
      'reservas:ver', 'reservas:crear', 'reservas:editar', 'reservas:eliminar',
      'suscripciones:ver', 'suscripciones:crear', 'suscripciones:editar', 'suscripciones:eliminar'
    ],
    esSistema: true
  },
  {
    id: 'profesor',
    nombre: 'Profesor / Coach',
    descripcion: 'Acceso a sus clases asignadas, registro de asistencia interactiva y consulta de fichas de alumnos.',
    permisos: [
      'clases:ver',
      'clases:asistencia',
      'usuarios:ver',
      'reservas:ver'
    ],
    esSistema: true
  },
  {
    id: 'alumno',
    nombre: 'Alumno / Cliente',
    descripcion: 'Consulta de catálogo de clases, reserva de cupos en tiempo real y administración de membresía personal.',
    permisos: [
      'clases:ver',
      'reservas:ver',
      'reservas:crear',
      'reservas:eliminar',
      'planes:ver',
      'suscripciones:ver',
      'suscripciones:editar',
      'suscripciones:eliminar'
    ],
    esSistema: true
  }
];

export const INITIAL_USERS = [
  {
    id: 'usr-admin-1',
    nombre: 'Valeria',
    apellido: 'Montes',
    email: 'admin@kronofit.com',
    password: 'password123',
    telefono: '+56 9 8765 4321',
    rut: '14.283.941-K',
    rol: 'admin',
    fechaRegistro: '2025-01-10',
    estado: 'activo',
    bio: 'Directora de operaciones y administradora general de sedes KRONOFIT.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'usr-prof-1',
    nombre: 'Carlos',
    apellido: 'Rivera',
    email: 'carlos.rivera@kronofit.com',
    password: 'password123',
    telefono: '+56 9 7654 3210',
    rut: '16.892.401-3',
    rol: 'profesor',
    fechaRegistro: '2025-02-01',
    estado: 'activo',
    especialidad: 'CrossFit, Fuerza y Acondicionamiento Físico',
    bio: 'Head Coach certificado CrossFit Level 3 con más de 9 años de experiencia en rendimiento atlético y fuerza funcional.',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'usr-prof-2',
    nombre: 'Elena',
    apellido: 'Vásquez',
    email: 'elena.vasquez@kronofit.com',
    password: 'password123',
    telefono: '+56 9 6543 2109',
    rut: '17.432.190-8',
    rol: 'profesor',
    fechaRegistro: '2025-02-15',
    estado: 'activo',
    especialidad: 'Vinyasa Yoga, Pilates Mat y Movilidad Articular',
    bio: 'Instructora certificada RYT-500. Especializada en prevención de lesiones, flexibilidad activa y alineación corporal.',
    avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'usr-alum-1',
    nombre: 'Camila',
    apellido: 'Soto',
    email: 'camila.soto@gmail.com',
    password: 'password123',
    telefono: '+56 9 9123 4567',
    rut: '19.821.450-2',
    rol: 'alumno',
    fechaRegistro: '2025-03-01',
    estado: 'activo',
    planId: 'plan-black',
    contactoEmergencia: 'Roberto Soto (+56 9 9876 1122)',
    bio: 'Diseñadora gráfica apasionada por el entrenamiento de fuerza y running 10k.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'usr-alum-2',
    nombre: 'Matías',
    apellido: 'Fernández',
    email: 'matias.f@gmail.com',
    password: 'password123',
    telefono: '+56 9 8234 5678',
    rut: '20.144.590-7',
    rol: 'alumno',
    fechaRegistro: '2025-03-10',
    estado: 'activo',
    planId: 'plan-black',
    contactoEmergencia: 'Claudia Rojas (+56 9 7788 9900)',
    bio: 'Ingeniero de software. Entrenando para mejorar postura y ganar masa muscular.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'usr-alum-3',
    nombre: 'Francisca',
    apellido: 'Morales',
    email: 'fran.morales@hotmail.com',
    password: 'password123',
    telefono: '+56 9 7345 6789',
    rut: '18.910.223-4',
    rol: 'alumno',
    fechaRegistro: '2025-03-15',
    estado: 'activo',
    planId: 'plan-basic',
    contactoEmergencia: 'Andrés Morales (+56 9 6655 4433)',
    bio: 'Amante del spinning matutino y sesiones de yoga relajante.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'usr-alum-4',
    nombre: 'Diego',
    apellido: 'Araya',
    email: 'diego.araya@outlook.com',
    password: 'password123',
    telefono: '+56 9 6456 7890',
    rut: '19.456.789-1',
    rol: 'alumno',
    fechaRegistro: '2025-03-20',
    estado: 'activo',
    planId: 'plan-elite',
    contactoEmergencia: 'Mariana Silva (+56 9 5544 3322)',
    bio: 'Preparándose para triatlón sprint, entrena 5 días a la semana.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  }
];

export const INITIAL_PLANS = [
  {
    id: 'plan-basic',
    nombre: 'Plan Básico Fit',
    precio: 29990,
    moneda: '$',
    periodo: 'Mensual',
    duracionMeses: 1,
    clasesPorMes: '8 clases al mes',
    beneficios: [
      'Acceso a sala de pesas y cardio',
      '8 clases grupales al mes',
      'Evaluación física inicial básica',
      'Acceso a vestuarios y casilleros',
      'App web para reservas'
    ],
    destacado: false,
    estado: 'activo',
    usuariosActivos: 142
  },
  {
    id: 'plan-black',
    nombre: 'Plan Black KRONOFIT',
    precio: 45990,
    moneda: '$',
    periodo: 'Mensual',
    duracionMeses: 1,
    clasesPorMes: 'Clases Ilimitadas',
    beneficios: [
      'Acceso ilimitado a todas las sedes KRONOFIT',
      'Clases grupales ilimitadas (CrossFit, HIIT, Yoga, Spinning)',
      'Reserva prioritaria con 7 días de anticipación',
      '1 pase de invitado gratis al mes',
      'Bioimpedancia y plan nutricional trimestral',
      'Acceso a zona spa y sauna'
    ],
    destacado: true,
    estado: 'activo',
    usuariosActivos: 384
  },
  {
    id: 'plan-elite',
    nombre: 'Plan Elite VIP Anual',
    precio: 399990,
    moneda: '$',
    periodo: 'Anual',
    duracionMeses: 12,
    clasesPorMes: 'Clases Ilimitadas',
    beneficios: [
      'Todo lo incluido en Plan Black KRONOFIT',
      'Sesión mensual 1 a 1 con Head Coach',
      'Kit de bienvenida KRONOFIT Performance (mochila + shaker)',
      'Casillero VIP exclusivo con toalla incluida',
      '2 meses de congelamiento de plan gratis al año',
      'Descuento 20% en tienda deportiva y cafetería'
    ],
    destacado: false,
    estado: 'activo',
    usuariosActivos: 89
  }
];

export const INITIAL_CLASSES = [
  {
    id: 'cls-1',
    nombre: 'CrossFit & WOD Performance',
    descripcion: 'Entrenamiento de alta intensidad con levantamientos olímpicos, gimnásticos y acondicionamiento metabólico.',
    profesorId: 'usr-prof-1',
    profesorNombre: 'Carlos Rivera',
    categoria: 'CrossFit & Funcional',
    intensidad: 'Extrema',
    sala: 'Box Principal (Piso 1)',
    horario: 'Lunes y Miércoles 07:00 - 08:00',
    dias: ['Lunes', 'Miércoles'],
    horaInicio: '07:00',
    horaFin: '08:00',
    cupoMaximo: 16,
    cupoDisponible: 13,
    imagen: classFunctionalImage,
    estado: 'activa'
  },
  {
    id: 'cls-2',
    nombre: 'Power Lifting & Fuerza Pura',
    descripcion: 'Desarrollo de fuerza máxima enfocado en sentadilla, press banca y peso muerto con biomecánica asistida.',
    profesorId: 'usr-prof-1',
    profesorNombre: 'Carlos Rivera',
    categoria: 'Fuerza & Levantamiento',
    intensidad: 'Alta',
    sala: 'Zona de Racks Olímpicos',
    horario: 'Martes y Jueves 18:30 - 19:30',
    dias: ['Martes', 'Jueves'],
    horaInicio: '18:30',
    horaFin: '19:30',
    cupoMaximo: 12,
    cupoDisponible: 10,
    imagen: heroGymImage,
    estado: 'activa'
  },
  {
    id: 'cls-3',
    nombre: 'Vinyasa Flow & Descompresión',
    descripcion: 'Secuencia dinámica sincronizada con respiración para flexibilizar la cadena muscular y liberar tensión articular.',
    profesorId: 'usr-prof-2',
    profesorNombre: 'Elena Vásquez',
    categoria: 'Yoga & Movilidad',
    intensidad: 'Media',
    sala: 'Estudio Bambú Zen (Piso 2)',
    horario: 'Lunes y Viernes 09:00 - 10:00',
    dias: ['Lunes', 'Viernes'],
    horaInicio: '09:00',
    horaFin: '10:00',
    cupoMaximo: 20,
    cupoDisponible: 17,
    imagen: classWellnessImage,
    estado: 'activa'
  },
  {
    id: 'cls-4',
    nombre: 'HIIT Conditioning & Core Burn',
    descripcion: 'Intervalos aeróbicos y anaeróbicos con trineos, cuerdas de batalla y trabajo de zona media para máxima quema calórica.',
    profesorId: 'usr-prof-1',
    profesorNombre: 'Carlos Rivera',
    categoria: 'Cardio & HIIT',
    intensidad: 'Alta',
    sala: 'Pista de Césped Sintético',
    horario: 'Viernes 19:00 - 20:00',
    dias: ['Viernes'],
    horaInicio: '19:00',
    horaFin: '20:00',
    cupoMaximo: 18,
    cupoDisponible: 16,
    imagen: classFunctionalImage,
    estado: 'activa'
  },
  {
    id: 'cls-5',
    nombre: 'Pilates Reformer & Postura',
    descripcion: 'Control postural, alineación espinal y tonificación profunda sin impacto articular.',
    profesorId: 'usr-prof-2',
    profesorNombre: 'Elena Vásquez',
    categoria: 'Yoga & Movilidad',
    intensidad: 'Media',
    sala: 'Estudio Bambú Zen (Piso 2)',
    horario: 'Miércoles y Sábado 10:30 - 11:30',
    dias: ['Miércoles', 'Sábado'],
    horaInicio: '10:30',
    horaFin: '11:30',
    cupoMaximo: 14,
    cupoDisponible: 11,
    imagen: classWellnessImage,
    estado: 'activa'
  }
];

export const INITIAL_RESERVATIONS = [
  {
    id: 'res-1',
    claseId: 'cls-1',
    claseNombre: 'CrossFit & WOD Performance',
    claseHorario: 'Lunes y Miércoles 07:00 - 08:00',
    claseSala: 'Box Principal (Piso 1)',
    alumnoId: 'usr-alum-1',
    alumnoNombre: 'Camila Soto',
    alumnoEmail: 'camila.soto@gmail.com',
    profesorId: 'usr-prof-1',
    profesorNombre: 'Carlos Rivera',
    fechaClase: '2026-11-10',
    fechaReserva: '2026-11-06 14:20',
    estado: 'confirmada',
    asistenciaRegistrada: true,
    asistenciaHora: '07:05'
  },
  {
    id: 'res-2',
    claseId: 'cls-1',
    claseNombre: 'CrossFit & WOD Performance',
    claseHorario: 'Lunes y Miércoles 07:00 - 08:00',
    claseSala: 'Box Principal (Piso 1)',
    alumnoId: 'usr-alum-2',
    alumnoNombre: 'Matías Fernández',
    alumnoEmail: 'matias.f@gmail.com',
    profesorId: 'usr-prof-1',
    profesorNombre: 'Carlos Rivera',
    fechaClase: '2026-11-10',
    fechaReserva: '2026-11-07 09:12',
    estado: 'confirmada',
    asistenciaRegistrada: false
  },
  {
    id: 'res-3',
    claseId: 'cls-1',
    claseNombre: 'CrossFit & WOD Performance',
    claseHorario: 'Lunes y Miércoles 07:00 - 08:00',
    claseSala: 'Box Principal (Piso 1)',
    alumnoId: 'usr-alum-4',
    alumnoNombre: 'Diego Araya',
    alumnoEmail: 'diego.araya@outlook.com',
    profesorId: 'usr-prof-1',
    profesorNombre: 'Carlos Rivera',
    fechaClase: '2026-11-10',
    fechaReserva: '2026-11-07 11:30',
    estado: 'confirmada',
    asistenciaRegistrada: true,
    asistenciaHora: '06:58'
  },
  {
    id: 'res-4',
    claseId: 'cls-3',
    claseNombre: 'Vinyasa Flow & Descompresión',
    claseHorario: 'Lunes y Viernes 09:00 - 10:00',
    claseSala: 'Estudio Bambú Zen (Piso 2)',
    alumnoId: 'usr-alum-1',
    alumnoNombre: 'Camila Soto',
    alumnoEmail: 'camila.soto@gmail.com',
    profesorId: 'usr-prof-2',
    profesorNombre: 'Elena Vásquez',
    fechaClase: '2026-11-11',
    fechaReserva: '2026-11-06 15:40',
    estado: 'confirmada',
    asistenciaRegistrada: false
  },
  {
    id: 'res-5',
    claseId: 'cls-3',
    claseNombre: 'Vinyasa Flow & Descompresión',
    claseHorario: 'Lunes y Viernes 09:00 - 10:00',
    claseSala: 'Estudio Bambú Zen (Piso 2)',
    alumnoId: 'usr-alum-3',
    alumnoNombre: 'Francisca Morales',
    alumnoEmail: 'fran.morales@hotmail.com',
    profesorId: 'usr-prof-2',
    profesorNombre: 'Elena Vásquez',
    fechaClase: '2026-11-11',
    fechaReserva: '2026-11-07 10:00',
    estado: 'confirmada',
    asistenciaRegistrada: false
  },
  {
    id: 'res-6',
    claseId: 'cls-2',
    claseNombre: 'Power Lifting & Fuerza Pura',
    claseHorario: 'Martes y Jueves 18:30 - 19:30',
    claseSala: 'Zona de Racks Olímpicos',
    alumnoId: 'usr-alum-2',
    alumnoNombre: 'Matías Fernández',
    alumnoEmail: 'matias.f@gmail.com',
    profesorId: 'usr-prof-1',
    profesorNombre: 'Carlos Rivera',
    fechaClase: '2026-11-12',
    fechaReserva: '2026-11-08 08:30',
    estado: 'confirmada',
    asistenciaRegistrada: false
  }
];

export const INITIAL_SUBSCRIPTIONS = [
  {
    id: 'sub-1',
    usuarioId: 'usr-alum-1',
    usuarioNombre: 'Camila Soto',
    usuarioEmail: 'camila.soto@gmail.com',
    planId: 'plan-black',
    planNombre: 'Plan Black KRONOFIT',
    precio: 45990,
    fechaInicio: '2026-10-15',
    fechaVencimiento: '2026-11-15',
    renovacionAutomatica: true,
    estado: 'activa',
    metodoPago: 'Tarjeta de Crédito (•••• 4921)'
  },
  {
    id: 'sub-2',
    usuarioId: 'usr-alum-2',
    usuarioNombre: 'Matías Fernández',
    usuarioEmail: 'matias.f@gmail.com',
    planId: 'plan-black',
    planNombre: 'Plan Black KRONOFIT',
    precio: 45990,
    fechaInicio: '2026-10-20',
    fechaVencimiento: '2026-11-20',
    renovacionAutomatica: true,
    estado: 'activa',
    metodoPago: 'Tarjeta de Débito (•••• 1084)'
  },
  {
    id: 'sub-3',
    usuarioId: 'usr-alum-3',
    usuarioNombre: 'Francisca Morales',
    usuarioEmail: 'fran.morales@hotmail.com',
    planId: 'plan-basic',
    planNombre: 'Plan Básico Fit',
    precio: 29990,
    fechaInicio: '2026-10-01',
    fechaVencimiento: '2026-11-01',
    renovacionAutomatica: false,
    estado: 'vencida',
    metodoPago: 'Transferencia Bancaria'
  },
  {
    id: 'sub-4',
    usuarioId: 'usr-alum-4',
    usuarioNombre: 'Diego Araya',
    usuarioEmail: 'diego.araya@outlook.com',
    planId: 'plan-elite',
    planNombre: 'Plan Elite VIP Anual',
    precio: 399990,
    fechaInicio: '2026-03-20',
    fechaVencimiento: '2027-03-20',
    renovacionAutomatica: true,
    estado: 'activa',
    metodoPago: 'Tarjeta de Crédito (•••• 8820)'
  }
];
