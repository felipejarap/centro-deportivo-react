/** @vitest-environment jsdom */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGym } from '../src/context/GymContext.jsx';
import { StudentReservationsPage } from '../src/pages/student/StudentReservationsPage.jsx';

vi.mock('../src/context/GymContext.jsx', () => ({
  useGym: vi.fn()
}));

describe('StudentReservationsPage', () => {
  beforeEach(() => {
    useGym.mockReturnValue({
      currentUser: { id: '900003', rol: 'alumno' },
      reservations: [
        { id: '1', alumnoId: '900003', claseId: '1', estado: 'confirmada', claseNombre: 'Futbol', fechaClase: '2026-11-23' },
        { id: '4', alumnoId: '900003', claseId: '1', estado: 'cancelada', claseNombre: 'Futbol', fechaClase: '2026-11-23' },
        { id: '5', alumnoId: '900003', claseId: '1', estado: 'cancelada', claseNombre: 'Futbol', fechaClase: '2026-11-23' }
      ],
      cancelReservation: vi.fn(),
      confirmReservation: vi.fn(),
      setCurrentView: vi.fn()
    });
  });

  it('does not offer to reconfirm cancelled duplicates when the class is already confirmed', () => {
    render(React.createElement(StudentReservationsPage));

    expect(screen.queryByRole('button', { name: 'Re-confirmar' })).toBeNull();
    expect(screen.getAllByText('Ya tienes una reserva confirmada')).toHaveLength(2);
  });
});
