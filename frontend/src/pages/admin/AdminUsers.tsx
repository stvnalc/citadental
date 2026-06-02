import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, X, Loader2, Shield, User as UserIcon } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: 'admin' | 'staff' | 'patient';
  createdAt: string;
}

const roleBadge = (role: string) => {
  const styles: Record<string, string> = {
    admin: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    staff: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    patient: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  };
  const labels: Record<string, string> = { admin: 'Admin', staff: 'Staff', patient: 'Paciente' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[role] || styles.patient}`}>
      {role === 'admin' ? <Shield className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
      {labels[role] || role}
    </span>
  );
};

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<'admin' | 'staff' | 'patient'>('patient');
  const [formPassword, setFormPassword] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async (query?: string, role?: string) => {
    try {
      const params: Record<string, string> = {};
      if (query) params.search = query;
      if (role) params.role = role;
      const { data } = await adminAPI.getUsers(params);
      setUsers(data.users || []);
    } catch {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    if (searchTimer) clearTimeout(searchTimer);
    setSearchTimer(setTimeout(() => loadUsers(value, roleFilter), 400));
  };

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
    setLoading(true);
    loadUsers(search, value);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormFirstName('');
    setFormLastName('');
    setFormEmail('');
    setFormPhone('');
    setFormRole('patient');
    setFormPassword('');
    setModalOpen(true);
  };

  const openEditModal = (u: UserData) => {
    setEditingUser(u);
    setFormFirstName(u.firstName);
    setFormLastName(u.lastName);
    setFormEmail(u.email);
    setFormPhone(u.phone || '');
    setFormRole(u.role);
    setFormPassword('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        const data: any = {
          firstName: formFirstName,
          lastName: formLastName,
          email: formEmail,
          phone: formPhone || null,
          role: formRole,
        };
        if (formPassword) data.password = formPassword;
        await adminAPI.updateUser(editingUser.id, data);
        toast.success('Usuario actualizado');
      } else {
        await adminAPI.createUser({
          firstName: formFirstName,
          lastName: formLastName,
          email: formEmail,
          phone: formPhone || null,
          role: formRole,
          password: formPassword,
        });
        toast.success('Usuario creado');
      }
      setModalOpen(false);
      loadUsers(search, roleFilter);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al guardar usuario');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await adminAPI.deleteUser(id);
      toast.success('Usuario eliminado');
      setDeleteConfirm(null);
      loadUsers(search, roleFilter);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al eliminar usuario');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
        <button
          onClick={openCreateModal}
          className="gradient-dental px-4 py-2.5 rounded-lg font-semibold text-white text-sm hover:opacity-90 transition-opacity flex items-center gap-2 w-fit"
        >
          <Plus className="h-4 w-4" />
          Agregar Usuario
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar usuario..."
            className="w-full rounded-lg border bg-card pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => handleRoleFilter(e.target.value)}
          className="rounded-lg border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="patient">Paciente</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border bg-card shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Usuario</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Teléfono</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Rol</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Registrado</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
                      {u.firstName?.[0]}{u.lastName?.[0]}
                    </div>
                    <span className="text-sm font-medium text-foreground">{u.firstName} {u.lastName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{u.phone || '—'}</td>
                <td className="px-4 py-3">{roleBadge(u.role)}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(u.createdAt).toLocaleDateString('es-VE')}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(u.id)}
                      disabled={u.id === currentUser?.id}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-muted-foreground hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title={u.id === currentUser?.id ? 'No puedes eliminarte a ti mismo' : 'Eliminar'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="p-8 text-center text-muted-foreground text-sm">No se encontraron usuarios.</p>}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {users.map((u) => (
          <div key={u.id} className="rounded-xl border bg-card p-4 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                  {u.firstName?.[0]}{u.lastName?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
              {roleBadge(u.role)}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{u.phone || '—'}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => openEditModal(u)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(u.id)}
                  disabled={u.id === currentUser?.id}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {users.length === 0 && <p className="text-center text-muted-foreground py-8">No se encontraron usuarios.</p>}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative rounded-xl border bg-card p-6 shadow-card max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-semibold text-foreground mb-2">¿Eliminar usuario?</h3>
            <p className="text-sm text-muted-foreground mb-6">Esta acción no se puede deshacer. Se eliminarán todas las citas y notificaciones asociadas a este usuario.</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-secondary transition-colors">
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setModalOpen(false)} />
          <div className="relative rounded-xl border bg-card p-6 shadow-card max-w-md w-full animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                {editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nombre</label>
                  <input
                    value={formFirstName}
                    onChange={e => setFormFirstName(e.target.value)}
                    required
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Apellido</label>
                  <input
                    value={formLastName}
                    onChange={e => setFormLastName(e.target.value)}
                    required
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Apellido"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Teléfono</label>
                <input
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="+58 412-555-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Rol</label>
                <select
                  value={formRole}
                  onChange={e => setFormRole(e.target.value as any)}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="patient">Paciente</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {editingUser ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña'}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={e => setFormPassword(e.target.value)}
                  {...(!editingUser ? { required: true, minLength: 6 } : {})}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={editingUser ? '••••••••' : 'Mínimo 6 caracteres'}
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="gradient-dental px-6 py-2.5 rounded-lg font-semibold text-white text-sm hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
