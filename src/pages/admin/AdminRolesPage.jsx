import React, { useState } from 'react';
import { useGym } from '../../context/GymContext.jsx';
import {
  PageHeader,
  FilterBar,
  Modal,
  ConfirmModal,
  Badge,
  Button,
  FormField
} from '../../components/common/index.js';
import { PermissionsMatrix, SYSTEM_MODULES, getPermissionId } from '../../components/roles/PermissionsMatrix.jsx';
import { validateRoleForm } from '../../utils/validators.js';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Users,
  Key,
  ChevronRight,
  Pencil
} from 'lucide-react';

export const AdminRolesPage = () => {
  const {
    roles,
    users,
    systemPermissions,
    createRole,
    updateRole,
    deleteRole,
    addToast
  } = useGym();

  const allPermissions = systemPermissions || [];

  // Expanded accordion state per role: default first role expanded
  const [expandedRoles, setExpandedRoles] = useState(() => {
    const initial = {};
    if (roles && roles.length > 0) {
      initial[roles[0].id] = true;
    }
    return initial;
  });

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteConfirmRole, setDeleteConfirmRole] = useState(null);

  // Form state held in view
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    permisos: []
  });

  const [formErrors, setFormErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  // Toggle single accordion
  const toggleAccordion = roleId => {
    setExpandedRoles(prev => ({
      ...prev,
      [roleId]: !prev[roleId]
    }));
  };

  const expandAll = () => {
    const next = {};
    roles.forEach(r => {
      next[r.id] = true;
    });
    setExpandedRoles(next);
  };

  const collapseAll = () => {
    setExpandedRoles({});
  };

  // Open modal for Create Role
  const handleOpenCreate = () => {
    setEditingRole(null);
    setFormData({
      id: '',
      nombre: '',
      descripcion: '',
      permisos: ['clases:ver', 'reservas:ver']
    });
    setFormErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit Role
  const handleOpenEdit = role => {
    setEditingRole(role);
    setFormData({
      id: role.id,
      nombre: role.nombre,
      descripcion: role.descripcion || '',
      permisos: Array.isArray(role.permisos) ? [...role.permisos] : []
    });
    setFormErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  // Toggle permission in Modal Form
  const handleToggleFormPermission = permId => {
    setFormData(prev => {
      const exists = prev.permisos.includes(permId);
      const updated = exists
        ? prev.permisos.filter(p => p !== permId)
        : [...prev.permisos, permId];
      return { ...prev, permisos: updated };
    });
    if (formErrors.permisos) {
      setFormErrors(prev => ({ ...prev, permisos: null }));
    }
  };

  // Toggle entire module in Modal Form
  const handleToggleFormModuleAll = mod => {
    const modPermIds = mod.acciones.map(acc => getPermissionId(mod.id, acc));
    const allSelected = modPermIds.every(id => formData.permisos.includes(id));

    setFormData(prev => {
      let updated;
      if (allSelected) {
        updated = prev.permisos.filter(id => !modPermIds.includes(id));
      } else {
        const toAdd = modPermIds.filter(id => !prev.permisos.includes(id));
        updated = [...prev.permisos, ...toAdd];
      }
      return { ...prev, permisos: updated };
    });
    if (formErrors.permisos) {
      setFormErrors(prev => ({ ...prev, permisos: null }));
    }
  };

  // Direct toggle in Accordion row
  const handleDirectTogglePermission = (role, permId) => {
    const currentPerms = Array.isArray(role.permisos) ? role.permisos : [];
    const exists = currentPerms.includes(permId);
    const updatedPerms = exists
      ? currentPerms.filter(p => p !== permId)
      : [...currentPerms, permId];

    if (updatedPerms.length === 0) {
      addToast('error', 'El rol debe mantener al menos 1 permiso habilitado.');
      return;
    }

    const res = updateRole(role.id, {
      nombre: role.nombre,
      descripcion: role.descripcion,
      permisos: updatedPerms
    });

    if (res.success) {
      addToast('info', `Permisos de "${role.nombre}" actualizados correctamente.`);
    } else {
      addToast('error', res.error || 'No se pudo actualizar el permiso.');
    }
  };

  // Direct toggle for all permissions of a module directly in Accordion
  const handleDirectToggleModuleAll = (role, mod) => {
    const currentPerms = Array.isArray(role.permisos) ? role.permisos : [];
    const modPermIds = mod.acciones.map(acc => getPermissionId(mod.id, acc));
    const allSelected = modPermIds.every(id => currentPerms.includes(id));

    let updatedPerms;
    if (allSelected) {
      updatedPerms = currentPerms.filter(id => !modPermIds.includes(id));
    } else {
      const toAdd = modPermIds.filter(id => !currentPerms.includes(id));
      updatedPerms = [...currentPerms, ...toAdd];
    }

    if (updatedPerms.length === 0) {
      addToast('error', 'El rol debe mantener al menos 1 permiso habilitado.');
      return;
    }

    const res = updateRole(role.id, {
      nombre: role.nombre,
      descripcion: role.descripcion,
      permisos: updatedPerms
    });

    if (res.success) {
      addToast('info', `Permisos del módulo ${mod.nombre} actualizados para "${role.nombre}".`);
    } else {
      addToast('error', res.error || 'No se pudo actualizar el módulo.');
    }
  };

  // Handle Form Submit with View-level validation
  const handleSubmit = e => {
    e.preventDefault();
    setGeneralError(null);

    const { isValid, errors } = validateRoleForm(formData, {
      isEdit: !!editingRole,
      existingRoles: roles
    });

    if (!isValid) {
      setFormErrors(errors);
      setGeneralError('Por favor completa los campos requeridos antes de guardar.');
      return;
    }

    if (editingRole) {
      const res = updateRole(editingRole.id, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        permisos: formData.permisos
      });
      if (!res.success) {
        setGeneralError(res.error);
        return;
      }
      addToast('success', `Rol "${formData.nombre}" actualizado con éxito.`);
    } else {
      const res = createRole({
        id: formData.id.toLowerCase().trim(),
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        permisos: formData.permisos
      });
      if (!res.success) {
        setGeneralError(res.error);
        return;
      }
      addToast('success', `Nuevo rol "${formData.nombre}" creado con éxito.`);
      setExpandedRoles(prev => ({
        ...prev,
        [formData.id.toLowerCase().trim()]: true
      }));
    }

    setIsModalOpen(false);
  };

  // Filter roles
  const filteredRoles = roles.filter(r => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.nombre.toLowerCase().includes(term) ||
      r.id.toLowerCase().includes(term) ||
      (r.descripcion && r.descripcion.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Reusable PageHeader */}
      <PageHeader
        category="Administración · Mantenedor de Roles"
        title="Mantenedor de Roles y Permisos"
        description="Administra los roles disponibles en el sistema (Administrador, Profesor, Alumno y personalizados) y configura los permisos granulares por módulo mediante el acordeón interactivo."
        action={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Crear Nuevo Rol
          </Button>
        }
      />

      {/* Reusable FilterBar */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar rol por nombre, código o función..."
      >
        <span className="text-neutral-500 text-[11px] font-semibold mr-2">
          {roles.length} {roles.length === 1 ? 'rol registrado' : 'roles registrados'}
        </span>
        <Button variant="outline" size="sm" onClick={expandAll}>
          Desplegar todos
        </Button>
        <Button variant="outline" size="sm" onClick={collapseAll}>
          Colapsar todos
        </Button>
      </FilterBar>

      {/* Roles Maintainer Table with Expandable Accordions */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/70 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center"></th>
                <th className="py-3 px-4">Rol del Sistema</th>
                <th className="py-3 px-4">Identificador</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Usuarios</th>
                <th className="py-3 px-4">Permisos Habilitados</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredRoles.map(role => {
                const userCount = users.filter(u => u.rol === role.id).length;
                const isSystem = role.esSistema || role.id === 'admin';
                const isExpanded = !!expandedRoles[role.id];
                const activePermsCount = role.permisos?.length || 0;

                return (
                  <React.Fragment key={role.id}>
                    {/* Primary Role Row */}
                    <tr
                      className={`transition-colors cursor-pointer ${
                        isExpanded
                          ? 'bg-neutral-900/90 text-neutral-100'
                          : 'hover:bg-neutral-900/50 text-neutral-300'
                      }`}
                      onClick={() => toggleAccordion(role.id)}
                    >
                      {/* Arrow / Chevron Toggle Column */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            toggleAccordion(role.id);
                          }}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            isExpanded
                              ? 'bg-amber-500 text-neutral-950 font-bold rotate-90 shadow-sm shadow-amber-500/20'
                              : 'bg-neutral-800 text-neutral-400 hover:text-amber-400 hover:bg-neutral-700'
                          }`}
                          title={isExpanded ? 'Colapsar módulos' : 'Desplegar módulos'}
                        >
                          <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                        </button>
                      </td>

                      {/* Role Name & Description */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-100 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>{role.nombre}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5 max-w-md">
                          {role.descripcion || 'Sin descripción'}
                        </p>
                      </td>

                      {/* ID / Slug */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800">
                          {role.id}
                        </span>
                      </td>

                      {/* Role Type */}
                      <td className="py-3.5 px-4">
                        <Badge variant={isSystem ? 'amber' : 'sky'}>
                          {isSystem ? (
                            <>
                              <Lock className="w-2.5 h-2.5 inline mr-1" /> Sistema
                            </>
                          ) : (
                            'Personalizado'
                          )}
                        </Badge>
                      </td>

                      {/* Assigned Users Count */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-xs text-neutral-300">
                          <Users className="w-3.5 h-3.5 text-neutral-500" />
                          <span className="font-semibold">{userCount}</span>
                        </span>
                      </td>

                      {/* Active Permissions Count */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-neutral-950 rounded-full h-1.5 overflow-hidden border border-neutral-800">
                            <div
                              className="bg-amber-500 h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round((activePermsCount / (allPermissions.length || 1)) * 100)
                                )}%`
                              }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-bold text-amber-400">
                            {activePermsCount}/{allPermissions.length}
                          </span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(role)}
                            className="p-1.5 text-neutral-400 hover:text-amber-400 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                            title="Editar información del rol"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {!isSystem && (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmRole(role)}
                              className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                              title="Eliminar rol"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Accordion Content Row (Reusing PermissionsMatrix component) */}
                    {isExpanded && (
                      <tr className="bg-neutral-950 border-b border-neutral-800">
                        <td colSpan={7} className="p-0">
                          <div className="p-4 sm:p-6 space-y-4 bg-neutral-950/95 border-t border-neutral-850">
                            {/* Accordion Sub-header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-800">
                              <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                                  <Key className="w-4 h-4 text-amber-500" />
                                  <span>Matriz de Permisos por Módulo:</span>
                                  <span className="text-amber-400 normal-case font-display text-sm">
                                    {role.nombre}
                                  </span>
                                </div>
                                <p className="text-[11px] text-neutral-400 mt-0.5">
                                  Activa o desactiva las casillas para conceder o revocar permisos directamente en cada módulo.
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  icon={Pencil}
                                  onClick={() => handleOpenEdit(role)}
                                >
                                  Editar en Modal
                                </Button>
                              </div>
                            </div>

                            {/* Reusable PermissionsMatrix Component */}
                            <PermissionsMatrix
                              selectedPermissions={role.permisos}
                              onTogglePermission={permId => handleDirectTogglePermission(role, permId)}
                              onToggleModule={mod => handleDirectToggleModuleAll(role, mod)}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {filteredRoles.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <Shield className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-neutral-300">No se encontraron roles</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      No hay roles que coincidan con la búsqueda &quot;{searchTerm}&quot;.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reusable Modal for Create/Edit Role */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRole ? `Editar Rol: ${editingRole.nombre}` : 'Crear Nuevo Rol'}
        icon={Key}
        maxWidth="3xl"
      >
        {generalError && (
          <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-lg">
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Nombre del Rol" error={formErrors.nombre} required>
              <input
                type="text"
                value={formData.nombre}
                onChange={e => {
                  setFormData({ ...formData, nombre: e.target.value });
                  if (formErrors.nombre) setFormErrors({ ...formErrors, nombre: null });
                }}
                placeholder="Ej: Recepcionista, Coordinador..."
                className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                  formErrors.nombre ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
                }`}
              />
            </FormField>

            <FormField label="Identificador (Slug)" error={formErrors.id} required>
              <input
                type="text"
                disabled={!!editingRole}
                value={formData.id}
                onChange={e => {
                  setFormData({ ...formData, id: e.target.value });
                  if (formErrors.id) setFormErrors({ ...formErrors, id: null });
                }}
                placeholder="ej: recepcion, coordinador..."
                className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 font-mono focus:outline-none transition-colors ${
                  editingRole
                    ? 'opacity-60 cursor-not-allowed border-neutral-800'
                    : formErrors.id
                    ? 'border-rose-500'
                    : 'border-neutral-800 focus:border-amber-500'
                }`}
              />
            </FormField>
          </div>

          <FormField label="Descripción del Rol">
            <textarea
              rows={2}
              value={formData.descripcion}
              onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe las responsabilidades y alcance de este rol..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </FormField>

          {/* Reusable PermissionsMatrix Component in Modal Form */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Asignación de Permisos por Módulo <span className="text-amber-500">*</span>
                </label>
                <p className="text-[11px] text-neutral-400">
                  Especifica a qué módulo tendrá permiso y qué tipo de permisos tendrá este rol.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800">
                {formData.permisos.length} seleccionados
              </span>
            </div>

            {formErrors.permisos && (
              <p className="text-[11px] text-rose-400">{formErrors.permisos}</p>
            )}

            <div className="max-h-80 overflow-y-auto pr-1">
              <PermissionsMatrix
                compact={true}
                selectedPermissions={formData.permisos}
                onTogglePermission={handleToggleFormPermission}
                onToggleModule={handleToggleFormModuleAll}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="md">
              {editingRole ? 'Guardar Cambios' : 'Crear Rol'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reusable ConfirmModal for Delete Role */}
      <ConfirmModal
        isOpen={!!deleteConfirmRole}
        onClose={() => setDeleteConfirmRole(null)}
        onConfirm={() => {
          if (deleteConfirmRole) {
            deleteRole(deleteConfirmRole.id);
            addToast('info', `Rol "${deleteConfirmRole.nombre}" eliminado.`);
            setDeleteConfirmRole(null);
          }
        }}
        title="¿Eliminar Rol?"
        message={
          deleteConfirmRole
            ? `¿Confirmas la eliminación del rol ${deleteConfirmRole.nombre} (${deleteConfirmRole.id})? Esta acción revocará todos sus permisos.`
            : ''
        }
        confirmText="Eliminar Definitivamente"
        cancelText="Cancelar"
        isDanger={true}
      />
    </div>
  );
};
