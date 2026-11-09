import React, { useState } from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { PageHeader } from '../../components/PageHeader.jsx';
import { FilterBar } from '../../components/FilterBar.jsx';
import { Modal } from '../../components/Modal.jsx';
import { ConfirmModal } from '../../components/ConfirmModal.jsx';
import { Button } from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import { FormField } from '../../components/FormField.jsx';
import { classFunctionalImage } from '../../data/initialData.js';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';

export const AdminClassesPage = () => {
  const { classes, users, createClass, updateClass, deleteClass, addToast } = useGym();

  const professors = users.filter(u => u.rol === 'profesor');

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deleteConfirmClass, setDeleteConfirmClass] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    profesorId: '',
    categoria: 'CrossFit & Funcional',
    intensidad: 'Media',
    sala: 'Box Principal (Piso 1)',
    horario: 'Lunes y Miércoles 08:00 - 09:00',
    cupoMaximo: 16,
    imagen: classFunctionalImage,
    estado: 'activa'
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const filteredClasses = classes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.profesorNombre.toLowerCase().includes(search.toLowerCase()) ||
    c.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingClass(null);
    setFormData({
      nombre: '',
      descripcion: '',
      profesorId: professors[0]?.id || '',
      categoria: 'CrossFit & Funcional',
      intensidad: 'Media',
      sala: 'Box Principal (Piso 1)',
      horario: 'Lunes y Miércoles 08:00 - 09:00',
      cupoMaximo: 16,
      imagen: classFunctionalImage,
      estado: 'activa'
    });
    setErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = cls => {
    setEditingClass(cls);
    setFormData({
      nombre: cls.nombre,
      descripcion: cls.descripcion,
      profesorId: cls.profesorId,
      categoria: cls.categoria,
      intensidad: cls.intensidad,
      sala: cls.sala,
      horario: cls.horario,
      cupoMaximo: cls.cupoMaximo,
      imagen: cls.imagen,
      estado: cls.estado
    });
    setErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  // View-level validation for classes
  const validateForm = () => {
    const errs = {};
    if (!formData.nombre || !formData.nombre.trim()) {
      errs.nombre = 'El nombre de la clase es obligatorio.';
    }

    if (!formData.horario || !formData.horario.trim()) {
      errs.horario = 'El horario y días son obligatorios.';
    }

    if (!formData.sala || !formData.sala.trim()) {
      errs.sala = 'La sala asignada es obligatoria.';
    }

    const quota = Number(formData.cupoMaximo);
    if (isNaN(quota) || quota <= 0) {
      errs.cupoMaximo = 'El cupo debe ser mayor a 0.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      setGeneralError('Por favor completa todos los campos requeridos correctamente.');
      return;
    }

    if (editingClass) {
      updateClass(editingClass.id, formData);
      addToast('success', `Clase "${formData.nombre}" actualizada.`);
    } else {
      createClass(formData);
      addToast('success', `Clase "${formData.nombre}" creada con éxito.`);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Reusable PageHeader */}
      <PageHeader
        category="Administración · Mantenedor de Clases"
        title="Gestión del Catálogo de Clases"
        description="Programa nuevas disciplinas, asigna profesores, configura aforos y define salas de entrenamiento."
        action={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Nueva Clase
          </Button>
        }
      />

      {/* Reusable FilterBar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por clase, profesor o categoría..."
      />

      {/* Classes Table */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Clase & Categoría</th>
                <th className="py-3 px-4">Profesor Asignado</th>
                <th className="py-3 px-4">Horario</th>
                <th className="py-3 px-4">Sala</th>
                <th className="py-3 px-4">Cupos</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    No se encontraron clases registradas.
                  </td>
                </tr>
              ) : (
                filteredClasses.map(cls => (
                  <tr key={cls.id} className="hover:bg-neutral-900/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={cls.imagen}
                          alt={cls.nombre}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover ring-1 ring-neutral-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-neutral-100">{cls.nombre}</div>
                          <div className="text-[11px] text-amber-400">{cls.categoria} · {cls.intensidad}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-200 font-medium">
                      {cls.profesorNombre}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-300">
                      {cls.horario}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-400">
                      {cls.sala}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-neutral-200">
                        {cls.cupoActual} / {cls.cupoMaximo}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={cls.estado === 'activa' ? 'emerald' : 'neutral'}>
                        {cls.estado}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cls)}
                          className="p-1.5 text-neutral-400 hover:text-amber-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="Editar clase"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmClass(cls)}
                          className="p-1.5 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="Eliminar clase"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reusable Modal for Create/Edit Class */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? 'Editar Clase' : 'Crear Nueva Clase'}
        icon={Calendar}
        maxWidth="2xl"
      >
        {generalError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-lg">
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Nombre de la Clase" error={errors.nombre} required>
              <input
                type="text"
                value={formData.nombre}
                onChange={e => {
                  setFormData({ ...formData, nombre: e.target.value });
                  if (errors.nombre) setErrors({ ...errors, nombre: null });
                }}
                placeholder="Ej: Powerlifting & Técnica"
                className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                  errors.nombre ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
                }`}
              />
            </FormField>

            <FormField label="Profesor / Coach" required>
              <select
                value={formData.profesorId}
                onChange={e => setFormData({ ...formData, profesorId: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
              >
                {professors.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} {p.apellido} ({p.especialidad || 'Coach'})
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Horario & Días" error={errors.horario} required>
              <input
                type="text"
                value={formData.horario}
                onChange={e => {
                  setFormData({ ...formData, horario: e.target.value });
                  if (errors.horario) setErrors({ ...errors, horario: null });
                }}
                placeholder="Ej: Lunes y Miércoles 08:00 - 09:00"
                className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                  errors.horario ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
                }`}
              />
            </FormField>

            <FormField label="Sala Asignada" error={errors.sala} required>
              <input
                type="text"
                value={formData.sala}
                onChange={e => {
                  setFormData({ ...formData, sala: e.target.value });
                  if (errors.sala) setErrors({ ...errors, sala: null });
                }}
                placeholder="Ej: Box Principal (Piso 1)"
                className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                  errors.sala ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
                }`}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Cupo Máximo de Alumnos" error={errors.cupoMaximo} required>
              <input
                type="number"
                value={formData.cupoMaximo}
                onChange={e => {
                  setFormData({ ...formData, cupoMaximo: e.target.value });
                  if (errors.cupoMaximo) setErrors({ ...errors, cupoMaximo: null });
                }}
                className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                  errors.cupoMaximo ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
                }`}
              />
            </FormField>

            <FormField label="Nivel de Intensidad">
              <select
                value={formData.intensidad}
                onChange={e => setFormData({ ...formData, intensidad: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Extrema">Extrema</option>
              </select>
            </FormField>
          </div>

          <FormField label="Descripción">
            <textarea
              rows={2}
              value={formData.descripcion}
              onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Detalles sobre ejercicios, material necesario..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="md">
              {editingClass ? 'Guardar Cambios' : 'Crear Clase'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reusable ConfirmModal for Deleting Class */}
      <ConfirmModal
        isOpen={!!deleteConfirmClass}
        onClose={() => setDeleteConfirmClass(null)}
        onConfirm={() => {
          if (deleteConfirmClass) {
            deleteClass(deleteConfirmClass.id);
            addToast('info', `Clase "${deleteConfirmClass.nombre}" eliminada.`);
            setDeleteConfirmClass(null);
          }
        }}
        title="¿Eliminar Clase?"
        message={
          deleteConfirmClass
            ? `¿Deseas eliminar la clase ${deleteConfirmClass.nombre}? Esta acción afectará las reservas asociadas.`
            : ''
        }
        confirmText="Eliminar Clase"
        cancelText="Cancelar"
        isDanger={true}
      />
    </div>
  );
};
