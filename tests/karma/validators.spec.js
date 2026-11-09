import {
  validateClassForm,
  validateLoginForm,
  validatePlanForm,
  validateRoleForm,
  validateUserForm
} from '../../src/utils/validators.js';

describe('Validadores de formularios con Jasmine', () => {
  describe('login', () => {
    it('rechaza correo y contraseña vacíos', () => {
      const result = validateLoginForm('', '');
      expect(result.isValid).toBeFalse();
      expect(result.errors.email).toBeTruthy();
      expect(result.errors.password).toBeTruthy();
    });

    it('rechaza correo vacío', () => {
      const result = validateLoginForm('', 'password123');
      expect(result.errors.email).toBeTruthy();
    });

    it('rechaza contraseña vacía', () => {
      const result = validateLoginForm('user@example.com', '');
      expect(result.errors.password).toBeTruthy();
    });

    it('acepta credenciales informadas', () => {
      expect(validateLoginForm('user@example.com', 'password123').isValid).toBeTrue();
    });
  });

  describe('registro de usuario', () => {
    const validUser = {
      nombre: 'Camila',
      apellido: 'Soto',
      email: 'camila@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      rol: 'alumno'
    };

    it('exige los datos obligatorios', () => {
      const result = validateUserForm({}, { isRegister: true });
      expect(result.isValid).toBeFalse();
      expect(result.errors.nombre).toBeTruthy();
      expect(result.errors.email).toBeTruthy();
    });

    it('rechaza un correo inválido', () => {
      const result = validateUserForm({ ...validUser, email: 'correo-invalido' }, { isRegister: true });
      expect(result.errors.email).toBe('Formato de correo electrónico inválido.');
    });

    it('rechaza contraseñas que no coinciden', () => {
      const result = validateUserForm(
        { ...validUser, confirmPassword: 'otra-clave' },
        { isRegister: true }
      );
      expect(result.errors.confirmPassword).toBe('Las contraseñas no coinciden.');
    });

    it('acepta un registro válido', () => {
      expect(validateUserForm(validUser, { isRegister: true }).isValid).toBeTrue();
    });
  });

  describe('roles', () => {
    it('exige nombre, slug y permisos', () => {
      const result = validateRoleForm({}, { existingRoles: [] });
      expect(result.isValid).toBeFalse();
      expect(result.errors.nombre).toBeTruthy();
      expect(result.errors.id).toBeTruthy();
      expect(result.errors.permisos).toBeTruthy();
    });

    it('rechaza un slug con caracteres inválidos', () => {
      const result = validateRoleForm(
        { nombre: 'Soporte', id: 'Soporte General', permisos: ['usuarios:ver'] },
        { existingRoles: [] }
      );
      expect(result.errors.id).toContain('solo puede contener');
    });

    it('rechaza un slug duplicado', () => {
      const result = validateRoleForm(
        { nombre: 'Soporte', id: 'soporte', permisos: ['usuarios:ver'] },
        { existingRoles: [{ id: 'soporte' }] }
      );
      expect(result.errors.id).toBe('Ya existe un rol con este identificador.');
    });

    it('acepta un rol válido', () => {
      expect(validateRoleForm(
        { nombre: 'Soporte', id: 'soporte', permisos: ['usuarios:ver'] },
        { existingRoles: [] }
      ).isValid).toBeTrue();
    });
  });

  describe('clases', () => {
    const validClass = {
      nombre: 'CrossFit',
      instructorId: 'usr-prof-1',
      horario: '07:00 - 08:00',
      cupos: 10,
      sala: 'Box Principal'
    };

    it('exige los campos principales', () => {
      expect(Object.keys(validateClassForm({}).errors)).toHaveSize(5);
    });

    it('exige un profesor o coach', () => {
      expect(validateClassForm({ ...validClass, instructorId: '' }).errors.instructorId).toBeTruthy();
    });

    it('rechaza cupos no válidos', () => {
      expect(validateClassForm({ ...validClass, cupos: 0 }).errors.cupos).toBeTruthy();
    });

    it('acepta una clase válida', () => {
      expect(validateClassForm(validClass).isValid).toBeTrue();
    });
  });

  describe('planes', () => {
    const validPlan = { nombre: 'Plan Black', precio: 30000, duracionMeses: 12 };

    it('exige nombre, precio y duración', () => {
      const result = validatePlanForm({});
      expect(result.isValid).toBeFalse();
      expect(result.errors.nombre).toBeTruthy();
      expect(result.errors.precio).toBeTruthy();
      expect(result.errors.duracionMeses).toBeTruthy();
    });

    it('rechaza un precio inválido', () => {
      expect(validatePlanForm({ ...validPlan, precio: 0 }).errors.precio).toBeTruthy();
    });

    it('rechaza una duración inválida', () => {
      expect(validatePlanForm({ ...validPlan, duracionMeses: 0 }).errors.duracionMeses).toBeTruthy();
    });

    it('acepta un plan válido', () => {
      expect(validatePlanForm(validPlan).isValid).toBeTrue();
    });
  });
});
