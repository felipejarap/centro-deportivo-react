/** @vitest-environment jsdom */

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGym } from '../src/context/GymContext.jsx';
import { PlansPage } from '../src/pages/public/PlansPage.jsx';

vi.mock('../src/context/GymContext.jsx', () => ({
  useGym: vi.fn()
}));

describe('PlansPage', () => {
  let setCurrentView;
  let createSubscription;

  beforeEach(() => {
    setCurrentView = vi.fn();
    createSubscription = vi.fn().mockResolvedValue({ success: true });
    useGym.mockReturnValue({
      plans: [{
        id: '1',
        nombre: 'Plan Básico',
        precio: 15000,
        periodo: 'Mensual',
        clasesPorMes: '8 clases',
        beneficios: [],
        estado: 'activo'
      }],
      currentUser: { id: '900003', rol: 'alumno' },
      subscriptions: [],
      setCurrentView,
      setPreselectedPlanId: vi.fn(),
      createSubscription,
      addToast: vi.fn()
    });
  });

  it('lets a signed-in student choose a plan and redirects to their subscription', async () => {
    render(React.createElement(PlansPage));

    fireEvent.click(screen.getByRole('button', { name: 'Contratar este Plan' }));

    await waitFor(() => {
      expect(createSubscription).toHaveBeenCalledWith('900003', '1');
      expect(setCurrentView).toHaveBeenCalledWith('alumno-suscripcion');
    });
  });
});
