import React from 'react';
import {
  Eye,
  PlusCircle,
  Pencil,
  Trash,
  ClipboardCheck
} from 'lucide-react';

export const SYSTEM_MODULES = [
  {
    id: 'usuarios',
    nombre: 'Usuarios',
    descripcion: 'Administración de cuentas, perfiles de socios, profesores y administradores',
    acciones: ['ver', 'crear', 'editar', 'eliminar']
  },
  {
    id: 'roles',
    nombre: 'Roles',
    descripcion: 'Configuración de roles de acceso y matriz de permisos del sistema',
    acciones: ['ver', 'crear', 'editar', 'eliminar']
  },
  {
    id: 'clases',
    nombre: 'Clases',
    descripcion: 'Catálogo de sesiones de entrenamiento, programación y aforos',
    acciones: ['ver', 'crear', 'editar', 'eliminar', 'asistencia']
  },
  {
    id: 'planes',
    nombre: 'Planes',
    descripcion: 'Planes de membresía, tarifas, periodicidad y beneficios',
    acciones: ['ver', 'crear', 'editar', 'eliminar']
  },
  {
    id: 'reservas',
    nombre: 'Reservas',
    descripcion: 'Control de cupos, reservas de alumnos y cancelaciones de turnos',
    acciones: ['ver', 'crear', 'editar', 'eliminar']
  },
  {
    id: 'suscripciones',
    nombre: 'Suscripciones',
    descripcion: 'Gestión de pagos, cobros recurrentes y vigencia de membresías',
    acciones: ['ver', 'crear', 'editar', 'eliminar']
  }
];

export const getPermissionId = (moduloId, accion) => `${moduloId}:${accion}`;

export const PermissionsMatrix = ({
  selectedPermissions = [],
  onTogglePermission,
  onToggleModule,
  readOnly = false,
  compact = false
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800 shadow-inner bg-neutral-900/30">
      <table className="w-full min-w-[640px] text-left text-xs border-collapse">
        <thead className={compact ? 'sticky top-0 z-10' : ''}>
          <tr className="border-b border-neutral-800 bg-neutral-950/90 text-neutral-400 font-bold uppercase tracking-wider text-[11px]">
            <th className="py-3 px-4 w-5/12">Módulo del Sistema</th>
            <th className="py-3 px-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-sky-400">
                <Eye className="w-3.5 h-3.5" />
                <span>Ver</span>
              </div>
            </th>
            <th className="py-3 px-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Crear</span>
              </div>
            </th>
            <th className="py-3 px-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-amber-400">
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar</span>
              </div>
            </th>
            <th className="py-3 px-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-rose-400">
                <Trash className="w-3.5 h-3.5" />
                <span>Eliminar</span>
              </div>
            </th>
            <th className="py-3 px-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-purple-400">
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Asistencia</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40">
          {SYSTEM_MODULES.map(mod => {
            const modPermIds = mod.acciones.map(acc => getPermissionId(mod.id, acc));
            const allChecked = modPermIds.every(id => selectedPermissions.includes(id));
            const someChecked = modPermIds.some(id => selectedPermissions.includes(id));

            const permVerId = getPermissionId(mod.id, 'ver');
            const permCrearId = getPermissionId(mod.id, 'crear');
            const permEditarId = getPermissionId(mod.id, 'editar');
            const permEliminarId = getPermissionId(mod.id, 'eliminar');
            const permAsistenciaId = mod.id === 'clases' ? getPermissionId(mod.id, 'asistencia') : null;

            const hasVer = selectedPermissions.includes(permVerId);
            const hasCrear = selectedPermissions.includes(permCrearId);
            const hasEditar = selectedPermissions.includes(permEditarId);
            const hasEliminar = selectedPermissions.includes(permEliminarId);
            const hasAsistencia = permAsistenciaId ? selectedPermissions.includes(permAsistenciaId) : false;

            return (
              <tr key={mod.id} className="hover:bg-neutral-900/40 transition-colors">
                {/* Module Name and Master Checkbox */}
                <td className="py-3 px-4">
                  <div className="flex items-start gap-3">
                    {!readOnly && onToggleModule ? (
                      <input
                        type="checkbox"
                        checked={allChecked}
                        ref={el => {
                          if (el) el.indeterminate = someChecked && !allChecked;
                        }}
                        onChange={() => onToggleModule(mod)}
                        className="mt-1 w-4 h-4 rounded border-neutral-700 text-amber-500 focus:ring-amber-500 bg-neutral-900 cursor-pointer"
                        title="Marcar / desmarcar todo el módulo"
                      />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-neutral-100 uppercase tracking-wide text-xs">
                        {mod.nombre}
                      </div>
                      {!compact && (
                        <div className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                          {mod.descripcion}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Ver Column */}
                <td className="py-3 px-3 text-center">
                  <label className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-colors ${readOnly ? '' : 'hover:bg-neutral-800/80 cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      disabled={readOnly}
                      checked={hasVer}
                      onChange={() => onTogglePermission && onTogglePermission(permVerId)}
                      className="w-4 h-4 rounded border-neutral-700 text-sky-500 focus:ring-sky-500 bg-neutral-900 cursor-pointer disabled:cursor-default"
                    />
                  </label>
                </td>

                {/* Crear Column */}
                <td className="py-3 px-3 text-center">
                  <label className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-colors ${readOnly ? '' : 'hover:bg-neutral-800/80 cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      disabled={readOnly}
                      checked={hasCrear}
                      onChange={() => onTogglePermission && onTogglePermission(permCrearId)}
                      className="w-4 h-4 rounded border-neutral-700 text-emerald-500 focus:ring-emerald-500 bg-neutral-900 cursor-pointer disabled:cursor-default"
                    />
                  </label>
                </td>

                {/* Editar Column */}
                <td className="py-3 px-3 text-center">
                  <label className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-colors ${readOnly ? '' : 'hover:bg-neutral-800/80 cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      disabled={readOnly}
                      checked={hasEditar}
                      onChange={() => onTogglePermission && onTogglePermission(permEditarId)}
                      className="w-4 h-4 rounded border-neutral-700 text-amber-500 focus:ring-amber-500 bg-neutral-900 cursor-pointer disabled:cursor-default"
                    />
                  </label>
                </td>

                {/* Eliminar Column */}
                <td className="py-3 px-3 text-center">
                  <label className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-colors ${readOnly ? '' : 'hover:bg-neutral-800/80 cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      disabled={readOnly}
                      checked={hasEliminar}
                      onChange={() => onTogglePermission && onTogglePermission(permEliminarId)}
                      className="w-4 h-4 rounded border-neutral-700 text-rose-500 focus:ring-rose-500 bg-neutral-900 cursor-pointer disabled:cursor-default"
                    />
                  </label>
                </td>

                {/* Asistencia Column (Only for Clases) */}
                <td className="py-3 px-3 text-center">
                  {permAsistenciaId ? (
                    <label className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-colors ${readOnly ? '' : 'hover:bg-neutral-800/80 cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        disabled={readOnly}
                        checked={hasAsistencia}
                        onChange={() => onTogglePermission && onTogglePermission(permAsistenciaId)}
                        className="w-4 h-4 rounded border-neutral-700 text-purple-500 focus:ring-purple-500 bg-neutral-900 cursor-pointer disabled:cursor-default"
                      />
                    </label>
                  ) : (
                    <span className="text-neutral-700 font-mono text-xs select-none">
                      —
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
