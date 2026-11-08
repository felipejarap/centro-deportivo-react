/**
 * Form Validation Utilities for KRONOFIT views
 * Grouped validations called directly by page views.
 * Components remain purely presentational and receive errors via props.
 */

export const validateUserForm = (formData, options = {}) => {
  const { isRegister = false, isEdit = false, existingUsers = [], currentUserId = null } = options;
  const errors = {};

  // Nombre
  if (!formData.nombre || !formData.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio.';
  } else if (formData.nombre.trim().length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres.';
  }

  // Apellido
  if (!formData.apellido || !formData.apellido.trim()) {
    errors.apellido = 'El apellido es obligatorio.';
  } else if (formData.apellido.trim().length < 2) {
    errors.apellido = 'El apellido debe tener al menos 2 caracteres.';
  }

  // Email
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Formato de correo electrónico inválido.';
    } else {
      const emailExists = existingUsers.some(
        u => u.email.toLowerCase() === formData.email.trim().toLowerCase() && u.id !== currentUserId
      );
      if (emailExists) {
        errors.email = 'Ya existe un usuario registrado con este correo.';
      }
    }
  }

  // Password
  if (!isEdit || isRegister) {
    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe contener al menos 6 caracteres.';
    }
  }

  // Confirm Password
  if (isRegister) {
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Por favor confirma tu contraseña.';
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Las contraseñas no coinciden.';
    }
  }

  // RUT / Identificación (optional, but validated if provided)
  if (formData.rut && formData.rut.trim().length < 7) {
    errors.rut = 'El RUT/Identificación parece incompleto.';
  }

  // Especialidad (only if role is profesor)
  if (formData.rol === 'profesor' && (!formData.especialidad || !formData.especialidad.trim())) {
    errors.especialidad = 'Indica la especialidad o certificación del profesor.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRoleForm = (formData, options = {}) => {
  const { isEdit = false, existingRoles = [] } = options;
  const errors = {};

  if (!formData.nombre || !formData.nombre.trim()) {
    errors.nombre = 'El nombre del rol es obligatorio.';
  } else if (formData.nombre.trim().length < 3) {
    errors.nombre = 'El nombre debe tener al menos 3 caracteres.';
  }

  if (!isEdit) {
    if (!formData.id || !formData.id.trim()) {
      errors.id = 'El identificador (código) del rol es obligatorio.';
    } else {
      const slugPattern = /^[a-z0-9_-]+$/;
      const normalizedId = formData.id.trim().toLowerCase();
      if (!slugPattern.test(normalizedId)) {
        errors.id = 'El identificador solo puede contener letras minúsculas, números y guiones.';
      } else if (existingRoles.some(r => r.id.toLowerCase() === normalizedId)) {
        errors.id = 'Ya existe un rol con este identificador.';
      }
    }
  }

  if (!formData.permisos || formData.permisos.length === 0) {
    errors.permisos = 'Debes asignar al menos 1 permiso en los módulos para este rol.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateClassForm = formData => {
  const errors = {};

  if (!formData.nombre || !formData.nombre.trim()) {
    errors.nombre = 'El nombre de la clase es obligatorio.';
  }

  if (!formData.instructorId) {
    errors.instructorId = 'Debes seleccionar un profesor o coach.';
  }

  if (!formData.horario || !formData.horario.trim()) {
    errors.horario = 'El horario es obligatorio (Ej: 07:00 - 08:00).';
  }

  if (!formData.cupos || Number(formData.cupos) <= 0) {
    errors.cupos = 'El cupo debe ser mayor a 0.';
  }

  if (!formData.sala || !formData.sala.trim()) {
    errors.sala = 'La sala o estudio es obligatorio.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePlanForm = formData => {
  const errors = {};

  if (!formData.nombre || !formData.nombre.trim()) {
    errors.nombre = 'El nombre del plan es obligatorio.';
  }

  if (!formData.precio || Number(formData.precio) <= 0) {
    errors.precio = 'El precio debe ser mayor a 0.';
  }

  if (!formData.duracionMeses || Number(formData.duracionMeses) <= 0) {
    errors.duracionMeses = 'La duración debe ser al menos 1 mes.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginForm = (email, password) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'El correo electrónico es obligatorio.';
  }

  if (!password) {
    errors.password = 'La contraseña es obligatoria.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
