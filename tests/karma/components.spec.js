import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Button } from '../../src/components/Button.jsx';
import { Badge } from '../../src/components/Badge.jsx';
import { Card } from '../../src/components/Card.jsx';
import { FormField } from '../../src/components/FormField.jsx';
import { Modal } from '../../src/components/Modal.jsx';
import { PermissionsMatrix } from '../../src/components/PermissionsMatrix.jsx';
import { UserForm } from '../../src/components/UserForm.jsx';
import { createUserFormMocks } from './mocks/userForm.mocks.js';

describe('Componentes de formularios con Jasmine', () => {
  afterEach(() => cleanup());

  it('Button renderiza su texto y ejecuta onClick', () => {
    const onClick = jasmine.createSpy('onClick');
    render(<Button onClick={onClick}>Guardar</Button>);

    const button = screen.getByRole('button', { name: 'Guardar' });
    fireEvent.click(button);

    expect(button).toBeTruthy();
    expect(onClick).toHaveBeenCalled();
  });

  it('Button respeta type y disabled', () => {
    render(<Button type="submit" disabled>Enviar</Button>);

    const button = screen.getByRole('button', { name: 'Enviar' });
    expect(button.getAttribute('type')).toBe('submit');
    expect(button.disabled).toBeTrue();
  });

  it('FormField muestra etiqueta, requerido y error', () => {
    render(
      <FormField label="Correo" required error="El correo es obligatorio.">
        <input name="email" />
      </FormField>
    );

    expect(document.querySelector('label').textContent.replace(/\s/g, '')).toBe('Correo*');
    expect(screen.getByText('El correo es obligatorio.')).toBeTruthy();
  });

  it('Card renderiza contenido y clases personalizadas', () => {
    render(<Card className="test-card">Contenido de prueba</Card>);

    expect(screen.getByText('Contenido de prueba')).toBeTruthy();
    expect(document.querySelector('.test-card')).toBeTruthy();
  });

  it('Badge renderiza el texto y la variante visual', () => {
    render(<Badge variant="emerald">Activo</Badge>);

    const badge = screen.getByText('Activo');
    expect(badge).toBeTruthy();
    expect(badge.className).toContain('text-emerald-400');
  });

  it('Modal muestra contenido y se cierra con Escape', () => {
    const onClose = jasmine.createSpy('onClose');
    render(
      <Modal isOpen onClose={onClose} title="Modal de prueba">
        <p>Contenido modal</p>
      </Modal>
    );

    expect(screen.getByText('Modal de prueba')).toBeTruthy();
    expect(screen.getByText('Contenido modal')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });

  it('PermissionsMatrix renderiza módulos y notifica cambios de permiso', () => {
    const onTogglePermission = jasmine.createSpy('onTogglePermission');
    const onToggleModule = jasmine.createSpy('onToggleModule');
    const { container } = render(
      <PermissionsMatrix
        selectedPermissions={['usuarios:ver']}
        onTogglePermission={onTogglePermission}
        onToggleModule={onToggleModule}
      />
    );

    expect(screen.getByText('Usuarios')).toBeTruthy();
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes[1].checked).toBeTrue();
    fireEvent.click(checkboxes[1]);

    expect(onTogglePermission).toHaveBeenCalledWith('usuarios:ver');
  });

  it('UserForm renderiza campos de registro y ejecuta submit', () => {
    const mocks = createUserFormMocks();
    const formData = {
      nombre: 'Camila',
      apellido: 'Soto',
      email: 'camila@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      rol: 'alumno',
      planId: 'plan-black'
    };

    const { container } = render(
      <UserForm
        formData={formData}
        onChange={mocks.onChange}
        onSubmit={mocks.onSubmit}
        onCancel={mocks.onCancel}
        roles={mocks.roles}
        plans={mocks.plans}
        isRegister
      />
    );

    expect(container.querySelector('[name="nombre"]').value).toBe('Camila');
    expect(screen.getByText('Socio / Alumno de KRONOFIT')).toBeTruthy();

    fireEvent.submit(container.querySelector('form'));
    expect(mocks.onSubmit).toHaveBeenCalled();
  });

  it('UserForm muestra el perfil profesional cuando el rol es profesor', () => {
    const mocks = createUserFormMocks();
    const { container } = render(
      <UserForm
        formData={{ nombre: '', apellido: '', email: '', rol: 'profesor' }}
        onChange={mocks.onChange}
        onSubmit={mocks.onSubmit}
        onCancel={mocks.onCancel}
        roles={[{ id: 'profesor', nombre: 'Profesor' }]}
        plans={mocks.plans}
      />
    );

    expect(screen.getByText('Perfil Profesional del Coach')).toBeTruthy();
    expect(container.querySelector('[name="especialidad"]')).toBeTruthy();
  });

  it('UserForm notifica cambios en los campos', () => {
    const mocks = createUserFormMocks();
    const { container } = render(
      <UserForm
        formData={{ nombre: '', apellido: '', email: '', rol: 'alumno' }}
        onChange={mocks.onChange}
        onSubmit={mocks.onSubmit}
        onCancel={mocks.onCancel}
        roles={mocks.roles}
        plans={mocks.plans}
      />
    );

    fireEvent.change(container.querySelector('[name="nombre"]'), {
      target: { name: 'nombre', value: 'Diego' }
    });

    expect(mocks.onChange).toHaveBeenCalled();
  });
});
