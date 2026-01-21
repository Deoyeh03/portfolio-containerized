"use client";

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/api';
import { Plus, Trash2, Edit, Save, X, Loader2, GripVertical } from 'lucide-react';

interface Role {
    _id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    order: number;
    isActive: boolean;
}

const iconOptions = ['Server', 'Database', 'Globe', 'Shield', 'Wrench', 'Briefcase', 'Code', 'Layers', 'Zap', 'Lock'];

export default function RolesManagerPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [message, setMessage] = useState('');

    const emptyRole: Omit<Role, '_id'> = {
        title: '',
        subtitle: '',
        description: '',
        icon: 'Briefcase',
        order: 0,
        isActive: true
    };

    const [newRole, setNewRole] = useState(emptyRole);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await api.get('/roles');
            setRoles(res.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            await api.post('/roles', { ...newRole, order: roles.length });
            setNewRole(emptyRole);
            setIsCreating(false);
            fetchRoles();
            setMessage('Role created successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error creating role');
        }
    };

    const handleUpdate = async (role: Role) => {
        try {
            await api.put(`/roles/${role._id}`, role);
            setEditingRole(null);
            fetchRoles();
            setMessage('Role updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error updating role');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this role?')) return;
        try {
            await api.delete(`/roles/${id}`);
            fetchRoles();
            setMessage('Role deleted successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error deleting role');
        }
    };

    if (loading) {
        return (
            <AdminLayout activePage="roles">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-primary w-8 h-8" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout activePage="roles">
            <div className="max-w-6xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Role Cards</h1>
                        <p className="text-muted-foreground mt-1">Manage the role cards displayed on homepage</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Role
                    </button>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {message}
                    </div>
                )}

                {/* Create New Role Form */}
                {isCreating && (
                    <div className="bg-white/5 border border-primary/30 p-6 rounded-2xl mb-6">
                        <h3 className="text-lg font-bold text-white mb-4">New Role</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                value={newRole.title}
                                onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                                placeholder="Role Title"
                                className="px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                            />
                            <input
                                type="text"
                                value={newRole.subtitle}
                                onChange={(e) => setNewRole({ ...newRole, subtitle: e.target.value })}
                                placeholder="Subtitle"
                                className="px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                            />
                        </div>
                        <textarea
                            value={newRole.description}
                            onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                            placeholder="Description"
                            rows={2}
                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white mb-4"
                        />
                        <div className="flex items-center gap-4 mb-4">
                            <select
                                value={newRole.icon}
                                onChange={(e) => setNewRole({ ...newRole, icon: e.target.value })}
                                className="px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                            >
                                {iconOptions.map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleCreate} className="px-4 py-2 bg-primary text-black rounded-lg font-bold flex items-center gap-2">
                                <Save size={16} /> Save
                            </button>
                            <button onClick={() => setIsCreating(false)} className="px-4 py-2 border border-white/10 rounded-lg flex items-center gap-2">
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Roles List */}
                <div className="space-y-4">
                    {roles.map((role) => (
                        <div key={role._id} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            {editingRole?._id === role._id ? (
                                // Edit Mode
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={editingRole.title}
                                            onChange={(e) => setEditingRole({ ...editingRole, title: e.target.value })}
                                            className="px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                                        />
                                        <input
                                            type="text"
                                            value={editingRole.subtitle}
                                            onChange={(e) => setEditingRole({ ...editingRole, subtitle: e.target.value })}
                                            className="px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                                        />
                                    </div>
                                    <textarea
                                        value={editingRole.description}
                                        onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                                        rows={2}
                                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => handleUpdate(editingRole)} className="px-4 py-2 bg-primary text-black rounded-lg font-bold flex items-center gap-2">
                                            <Save size={16} /> Save
                                        </button>
                                        <button onClick={() => setEditingRole(null)} className="px-4 py-2 border border-white/10 rounded-lg flex items-center gap-2">
                                            <X size={16} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <GripVertical className="text-muted-foreground cursor-move" size={20} />
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{role.title}</h3>
                                            <p className="text-sm text-primary">{role.subtitle}</p>
                                            <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingRole(role)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(role._id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {roles.length === 0 && !isCreating && (
                    <div className="text-center py-12 text-muted-foreground">
                        No roles found. Click "Add Role" to create one.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
