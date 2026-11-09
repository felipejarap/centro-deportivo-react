import React, { useState } from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { Button } from '../../components/Button.jsx';
import { FormField } from '../../components/FormField.jsx';
import { Card } from '../../components/Card.jsx';
import { validateLoginForm } from '../../utils/validators.js';
import { Mail, Lock, LogIn, Dumbbell, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login, setCurrentView } = useGym();
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
      setGeneralError('Correo o contraseña incorrectos, o cuenta inactiva.');
    }
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

            <FormField label="Contraseña" error={errors.password} required>
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

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-4 space-y-3">
          <p className="text-center text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Cuentas de prueba
          </p>
          <div className="grid gap-x-4 gap-y-3 text-xs text-neutral-300 sm:grid-cols-3">
            <p className="min-w-0 break-all"><span className="block break-normal text-neutral-500">Administrador</span>admin@kronofit.com</p>
            <p className="min-w-0 break-all"><span className="block break-normal text-neutral-500">Profesor</span>carlos.rivera@kronofit.com</p>
            <p className="min-w-0 break-all"><span className="block break-normal text-neutral-500">Alumno</span>camila.soto@gmail.com</p>
          </div>
          <p className="text-center text-xs text-neutral-400">
            Contraseña para las tres cuentas: <code className="text-amber-400">password123</code>
          </p>
        </div>
      </div>
    </div>
  );
};
