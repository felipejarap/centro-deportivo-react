import { describe, expect, it } from 'vitest';
import { mapReservation } from '../src/services/gymMappers.js';

describe('mapReservation', () => {
  it('uses the teacher user returned by the users service', () => {
    const result = mapReservation({
      idReservation: 1,
      idUser: 20,
      idClasse: 30,
      idCoach: 40,
      reservationStatus: 'CONFIRMADA',
      coach: {
        id: 40,
        username: 'maria',
        paternalSurname: 'Gonzalez',
        maternalSurname: 'Lopez'
      }
    });

    expect(result.profesorId).toBe('40');
    expect(result.profesorNombre).toBe('Gonzalez Lopez');
  });

  it('uses the student full name returned by the users service', () => {
    const result = mapReservation({
      idReservation: 2,
      idUser: 20,
      idClasse: 30,
      reservationStatus: 'CONFIRMADA',
      user: {
        id: 20,
        firstName: 'Camila',
        lastName: 'Soto',
        paternalSurname: 'Soto',
        maternalSurname: 'Perez'
      }
    });

    expect(result.alumnoNombre).toBe('Camila Soto');
  });
});
