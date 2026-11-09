import React, { useState } from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { Button } from '../../components/Button.jsx';
import { FormField } from '../../components/FormField.jsx';
import { Card } from '../../components/Card.jsx';
import { validateLoginForm } from '../../utils/validators.js';
import { Mail, Lock, LogIn, Dumbbell, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login, switchRole, setCurrentView } = useGym();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();
    setGeneralError(null);

    // View-level validation
    const { isValid, errors: validationErrors } = validateLoginForm(email, password);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    const success = login(email, password);
    if (!success) {
      setGeneralError('Correo o contraseña incorrectos. Puedes utilizar un acceso rápido demo abajo.');
    }
  };

  const handleQuickDemo = roleId => {
    switchRole(roleId);
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-amber-500 text-neutral-950 items-center justify-center font-bold mb-2 shadow-lg shadow-amber-500/10">
            <Dumbbell className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-neutral-100 tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-neutral-400">
            Ingresa a tu cuenta de KRONOFIT para gestionar tus clases y reservas.
          </p>
        </div>

        {/* Manual Login Card */}
        <Card className="space-y-6">
          {generalError && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-lg animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField label="Correo Electrónico" error={errors.email} required>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  placeholder="ejemplo@correo.com"
                  className={`w-full bg-neutral-950 border rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors ${
                    errors.email ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
                  }`}
                />
              </div>
            </FormField>

            <FormField label="Contraseña" error={errors.password} required helperText="Demo: password123">
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-neutral-950 border rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors ${
                    errors.password ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
                  }`}
                />
              </div>
            </FormField>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={LogIn}
              className="w-full"
            >
              Ingresar a la Plataforma
            </Button>
          </form>

          {/* Registration link */}
          <div className="pt-4 border-t border-neutral-800 text-center text-xs text-neutral-400">
            ¿Aún no tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => setCurrentView('registro')}
              className="text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              Regístrate como Alumno aquí
            </button>
          </div>
        </Card>

        {/* Quick Demo Access Bar */}
        <div className="bg-neutral-900/30 border border-neutral-800/80 rounded-xl p-4 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 text-center">
            Accesos Rápidos Demo (1 Clic)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('alumno')}
              className="px-3 py-2 bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-lg text-left text-xs transition-colors cursor-pointer group"
            >
              <div className="font-semibold text-neutral-200 group-hover:text-amber-400">Alumno</div>
              <div className="text-[10px] text-neutral-500">Camila Soto</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('profesor')}
              className="px-3 py-2 bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-lg text-left text-xs transition-colors cursor-pointer group"
            >
              <div className="font-semibold text-neutral-200 group-hover:text-amber-400">Profesor</div>
              <div className="text-[10px] text-neutral-500">Carlos Rivera</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-3 py-2 bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-lg text-left text-xs transition-colors cursor-pointer group"
            >
              <div className="font-semibold text-neutral-200 group-hover:text-amber-400">Administrador</div>
              <div className="text-[10px] text-neutral-500">Valeria Montes</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
