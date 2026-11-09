import React, { useState } from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { PageHeader } from '../../components/PageHeader.jsx';
import { FilterBar } from '../../components/FilterBar.jsx';
import { Modal } from '../../components/Modal.jsx';
import { ConfirmModal } from '../../components/ConfirmModal.jsx';
import { Badge } from '../../components/Badge.jsx';
import { Button } from '../../components/Button.jsx';
import { UserForm } from '../../components/UserForm.jsx';
import { validateUserForm } from '../../utils/validators.js';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2
} from 'lucide-react';

export const AdminUsersPage = () => {
  const { users, roles, plans, createUser, updateUser, deleteUser, addToast } = useGym();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

  // Form state held in view
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    rut: '',
    rol: 'alumno',
    estado: 'activo',
    planId: 'plan-black',
    especialidad: '',
    bio: '',
    contactoEmergencia: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.apellido.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.rut && u.rut.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === 'todos' || u.rol === roleFilter;
    const matchesStatus = statusFilter === 'todos' || u.estado === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      telefono: '',
      rut: '',
      rol: 'alumno',
      estado: 'activo',
      planId: 'plan-black',
      especialidad: '',
      bio: '',
      contactoEmergencia: ''
    });
    setFormErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = user => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      password: '',
      telefono: user.telefono || '',
      rut: user.rut || '',
      rol: user.rol || 'alumno',
      estado: user.estado || 'activo',
      planId: user.planId || 'plan-black',
      especialidad: user.especialidad || '',
      bio: user.bio || '',
      contactoEmergencia: user.contactoEmergencia || ''
    });
    setFormErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
    if (generalError) setGeneralError(null);
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    setGeneralError(null);

    // View-level validation
    const { isValid, errors } = validateUserForm(formData, {
      isEdit: !!editingUser,
      existingUsers: users,
      currentUserId: editingUser?.id
    });

    if (!isValid) {
      setFormErrors(errors);
      setGeneralError('Por favor corrige los campos con error antes de continuar.');
      return;
    }

    setIsSubmitting(true);

    if (editingUser) {
      const result = updateUser(editingUser.id, formData);
      if (!result.success) {
        setGeneralError(result.error);
        setIsSubmitting(false);
        return;
      }
      addToast('success', `Usuario ${formData.nombre} ${formData.apellido} actualizado.`);
    } else {
      const result = createUser(formData);
      if (!result.success) {
        setGeneralError(result.error);
        setIsSubmitting(false);
        return;
      }
      addToast('success', `Usuario ${formData.nombre} ${formData.apellido} creado exitosamente.`);
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (deleteConfirmUser) {
      deleteUser(deleteConfirmUser.id);
      addToast('info', `Usuario ${deleteConfirmUser.nombre} eliminado.`);
      setDeleteConfirmUser(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Reusable PageHeader */}
      <PageHeader
        category="Administración · Mantenedor de Usuarios"
        title="Gestión de Usuarios & Personal"
        description="Crea, edita y administra las cuentas de administradores, profesores y alumnos del gimnasio."
        action={
          <Button
            variant="primary"
            size="md"
            icon={UserPlus}
            onClick={handleOpenCreate}
          >
            Crear Nuevo Usuario
          </Button>
        }
      />

      {/* Reusable FilterBar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre, correo o RUT..."
      >
        {/* Dynamic Role Filter */}
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="text-[11px] uppercase font-bold text-neutral-500">Rol:</span>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            <option value="todos">Todos los Roles</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="text-[11px] uppercase font-bold text-neutral-500">Estado:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            <option value="todos">Todos los Estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </div>
      </FilterBar>

      {/* Users Table */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">RUT / Identificación</th>
                <th className="py-3 px-4">Rol Asignado</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Teléfono</th>
                <th className="py-3 px-4">Registro</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  const roleObj = roles.find(r => r.id === u.rol);

                  return (
                    <tr key={u.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.nombre)}+${encodeURIComponent(u.apellido)}&background=171717&color=f59e0b`}
                            alt={u.nombre}
                            className="w-8 h-8 rounded-full object-cover border border-neutral-800"
                          />
                          <div>
                            <div className="font-bold text-neutral-200">
                              {u.nombre} {u.apellido}
                            </div>
                            <div className="text-[11px] text-neutral-400">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-neutral-300 font-mono text-[11px]">
                        {u.rut || '—'}
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            u.rol === 'admin'
                              ? 'amber'
                              : u.rol === 'profesor'
                              ? 'sky'
                              : 'emerald'
                          }
                        >
                          {roleObj ? roleObj.nombre : u.rol}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            u.estado === 'activo'
                              ? 'emerald'
                              : u.estado === 'inactivo'
                              ? 'amber'
                              : 'rose'
                          }
                        >
                          {u.estado}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-neutral-400 text-[11px]">
                        {u.telefono || '—'}
                      </td>

                      <td className="py-3 px-4 text-neutral-400 text-[11px]">
                        {u.fechaRegistro}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-neutral-400 hover:text-amber-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                            title="Editar usuario"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmUser(u)}
                            className="p-1.5 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reusable Modal for Create/Edit User */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Usuario en Mantenedor' : 'Crear Nuevo Usuario (Mantenedor)'}
        icon={Users}
        maxWidth="2xl"
      >
        <UserForm
          formData={formData}
          errors={formErrors}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          roles={roles}
          plans={plans}
          isEdit={!!editingUser}
          isSubmitting={isSubmitting}
          generalError={generalError}
        />
      </Modal>

      {/* Reusable ConfirmModal for Deleting User */}
      <ConfirmModal
        isOpen={!!deleteConfirmUser}
        onClose={() => setDeleteConfirmUser(null)}
        onConfirm={handleDeleteUser}
        title="¿Eliminar Usuario?"
        message={
          deleteConfirmUser
            ? `¿Estás seguro de que deseas eliminar a ${deleteConfirmUser.nombre} ${deleteConfirmUser.apellido} (${deleteConfirmUser.email})? Esta acción removerá sus accesos al sistema.`
            : ''
        }
        confirmText="Eliminar Definitivamente"
        cancelText="Cancelar"
        isDanger={true}
      />
    </div>
  );
};
