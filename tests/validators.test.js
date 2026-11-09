import { describe, expect, it } from 'vitest';
import {
  validateClassForm,
  validateLoginForm,
  validatePlanForm,
  validateRoleForm,
  validateUserForm
} from '../src/utils/validators.js';

describe('Formulario de login', () => {
  it('exige correo y contraseña', () => {
    const result = validateLoginForm('', '');

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('El correo electrónico es obligatorio.');
    expect(result.errors.password).toBe('La contraseña es obligatoria.');
  });

  it('exige el correo cuando solo se informa la contraseña', () => {
    const result = validateLoginForm('', 'password123');

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('El correo electrónico es obligatorio.');
  });

  it('exige la contraseña cuando solo se informa el correo', () => {
    const result = validateLoginForm('usuario@example.com', '');

    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBe('La contraseña es obligatoria.');
  });

  it('acepta correo y contraseña informados', () => {
    const result = validateLoginForm('usuario@example.com', 'password123');

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });
});

describe('Formulario de registro', () => {
  it('rechaza contraseñas diferentes y profesores sin especialidad', () => {
    const result = validateUserForm(
      {
        nombre: 'Carlos',
        apellido: 'Rivera',
        email: 'carlos@example.com',
        password: 'password123',
        confirmPassword: 'different-password',
        rol: 'profesor',
        especialidad: ''
      },
      { isRegister: true }
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.confirmPassword).toBe('Las contraseñas no coinciden.');
    expect(result.errors.especialidad).toBe('Indica la especialidad o certificación del profesor.');
  });

  it('exige los datos personales y las credenciales obligatorias', () => {
    const result = validateUserForm({}, { isRegister: true });

    expect(result.isValid).toBe(false);
    expect(result.errors.nombre).toBe('El nombre es obligatorio.');
    expect(result.errors.apellido).toBe('El apellido es obligatorio.');
    expect(result.errors.email).toBe('El correo electrónico es obligatorio.');
    expect(result.errors.password).toBe('La contraseña es obligatoria.');
    expect(result.errors.confirmPassword).toBe('Por favor confirma tu contraseña.');
  });

  it('rechaza nombres y contraseñas demasiado cortos', () => {
    const result = validateUserForm(
      {
        nombre: 'A',
        apellido: 'B',
        email: 'usuario@example.com',
        password: '123',
        confirmPassword: '123',
        rol: 'alumno'
      },
      { isRegister: true }
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.nombre).toBe('El nombre debe tener al menos 2 caracteres.');
    expect(result.errors.apellido).toBe('El apellido debe tener al menos 2 caracteres.');
    expect(result.errors.password).toBe('La contraseña debe contener al menos 6 caracteres.');
  });

  it('rechaza correos duplicados', () => {
    const result = validateUserForm(
      {
        nombre: 'Camila',
        apellido: 'Soto',
        email: 'camila@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        rol: 'alumno'
      },
      {
        isRegister: true,
        existingUsers: [{ id: 'usr-1', email: 'CAMILA@example.com' }]
      }
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Ya existe un usuario registrado con este correo.');
  });
});

describe('Formulario de roles', () => {
  it('rechaza slug inválido y roles sin permisos', () => {
    const result = validateRoleForm(
      {
        nombre: 'Recepción',
        id: 'Recepción principal',
        permisos: []
      },
      { existingRoles: [] }
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.id).toBe(
      'El identificador solo puede contener letras minúsculas, números y guiones.'
    );
    expect(result.errors.permisos).toBe(
      'Debes asignar al menos 1 permiso en los módulos para este rol.'
    );
  });

  it('exige nombre, identificador y permisos', () => {
    const result = validateRoleForm({}, { existingRoles: [] });

    expect(result.isValid).toBe(false);
    expect(result.errors.nombre).toBe('El nombre del rol es obligatorio.');
    expect(result.errors.id).toBe('El identificador (código) del rol es obligatorio.');
    expect(result.errors.permisos).toBe(
      'Debes asignar al menos 1 permiso en los módulos para este rol.'
    );
  });

  it('rechaza nombres de rol demasiado cortos', () => {
    const result = validateRoleForm(
      { nombre: 'AB', id: 'soporte', permisos: ['usuarios:ver'] },
      { existingRoles: [] }
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.nombre).toBe('El nombre debe tener al menos 3 caracteres.');
  });

  it('rechaza identificadores duplicados', () => {
    const result = validateRoleForm(
      { nombre: 'Soporte', id: 'soporte', permisos: ['usuarios:ver'] },
      { existingRoles: [{ id: 'SOPORTE' }] }
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.id).toBe('Ya existe un rol con este identificador.');
  });
});

describe('Formulario de clases', () => {
  it('exige todos los campos principales', () => {
    const result = validateClassForm({});

    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(5);
  });

  it('exige seleccionar un profesor o coach', () => {
    const result = validateClassForm({
      nombre: 'CrossFit',
      instructorId: '',
      horario: '07:00 - 08:00',
      cupos: 10,
      sala: 'Box Principal'
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.instructorId).toBe('Debes seleccionar un profesor o coach.');
  });

  it('rechaza cupos iguales o menores que cero', () => {
    const result = validateClassForm({
      nombre: 'CrossFit',
      instructorId: 'usr-prof-1',
      horario: '07:00 - 08:00',
      cupos: 0,
      sala: 'Box Principal'
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.cupos).toBe('El cupo debe ser mayor a 0.');
  });

  it('acepta una clase completa y válida', () => {
    const result = validateClassForm({
      nombre: 'CrossFit',
      instructorId: 'usr-prof-1',
      horario: '07:00 - 08:00',
      cupos: 10,
      sala: 'Box Principal'
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });
});

describe('Formulario de planes', () => {
  it('exige nombre, precio y duración', () => {
    const result = validatePlanForm({});

    expect(result.isValid).toBe(false);
    expect(result.errors.nombre).toBe('El nombre del plan es obligatorio.');
    expect(result.errors.precio).toBe('El precio debe ser mayor a 0.');
    expect(result.errors.duracionMeses).toBe('La duración debe ser al menos 1 mes.');
  });

  it('rechaza un precio igual o menor que cero', () => {
    const result = validatePlanForm({ nombre: 'Plan Black', precio: 0, duracionMeses: 12 });

    expect(result.isValid).toBe(false);
    expect(result.errors.precio).toBe('El precio debe ser mayor a 0.');
  });

  it('rechaza una duración igual o menor que cero', () => {
    const result = validatePlanForm({ nombre: 'Plan Black', precio: 30000, duracionMeses: 0 });

    expect(result.isValid).toBe(false);
    expect(result.errors.duracionMeses).toBe('La duración debe ser al menos 1 mes.');
  });

  it('acepta un plan completo y válido', () => {
    const result = validatePlanForm({ nombre: 'Plan Black', precio: 30000, duracionMeses: 12 });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });
});
