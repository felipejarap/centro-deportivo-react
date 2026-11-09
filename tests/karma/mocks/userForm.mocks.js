export const createUserFormMocks = () => ({
  onChange: jasmine.createSpy('onChange'),
  onSubmit: jasmine.createSpy('onSubmit').and.callFake(event => event.preventDefault()),
  onCancel: jasmine.createSpy('onCancel'),
  roles: [{ id: 'alumno', nombre: 'Alumno' }],
  plans: [{ id: 'plan-black', nombre: 'Plan Black', precio: 30000 }]
});
