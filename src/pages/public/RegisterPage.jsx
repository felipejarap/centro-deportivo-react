import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { UserForm, Card } from '../../components/common/index.js';
import { validateUserForm } from '../../utils/validators.js';
import { Dumbbell, ArrowLeft } from 'lucide-react';

export const RegisterPage = () => {
  const { setCurrentView, preselectedPlanId, users, plans, roles, createUser, login, addToast } = useGym();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    rut: '',
    rol: 'alumno',
    estado: 'activo',
    planId: preselectedPlanId || 'plan-black',
    contactoEmergencia: '',
    especialidad: '',
    bio: ''
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedPlanId) {
      setFormData(prev => ({ ...prev, planId: preselectedPlanId }));
    }
  }, [preselectedPlanId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear individual error in view state on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (generalError) setGeneralError(null);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setGeneralError(null);

    // View-level validation
    const { isValid, errors: validationErrors } = validateUserForm(formData, {
      isRegister: true,
      existingUsers: users
    });

    if (!isValid) {
      setErrors(validationErrors);
      setGeneralError('Por favor corrige los campos indicados en el formulario.');
      return;
    }

    setIsSubmitting(true);
    const result = createUser(formData);

    if (!result.success) {
      setGeneralError(result.error);
      setIsSubmitting(false);
      return;
    }

    addToast('success', `¡Bienvenido a KRONOFIT, ${formData.nombre}! Tu cuenta ha sido activada.`);
    login(result.user);
    setCurrentView('alumno-clases');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back button */}
      <button
        type="button"
        onClick={() => setCurrentView('inicio')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al Inicio
      </button>

      {/* Header */}
      <div className="space-y-2 border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
          <Dumbbell className="w-4 h-4" />
          Registro Exclusivo de Socios
        </div>
        <h1 className="text-3xl font-display font-extrabold text-neutral-100 tracking-tight">
          Crea tu cuenta de Alumno
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Completa tus datos para activar tu perfil de cliente, reservar clases en tiempo real y acceder a tu membresía KRONOFIT.
        </p>
      </div>

      {/* Form Container rendering modular presentational UserForm */}
      <Card>
        <UserForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => setCurrentView('inicio')}
          roles={roles}
          plans={plans}
          isRegister={true}
          isSubmitting={isSubmitting}
          generalError={generalError}
        />
      </Card>

      <div className="text-center text-xs text-neutral-500">
        ¿Ya tienes cuenta activa?{' '}
        <button
          type="button"
          onClick={() => setCurrentView('login')}
          className="text-amber-400 font-semibold hover:underline cursor-pointer"
        >
          Inicia sesión aquí
        </button>
      </div>
    </div>
  );
};
