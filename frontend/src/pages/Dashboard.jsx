import { useState, useEffect } from 'react';
import {
    getTasks, createTask, updateTask, deleteTask,
    getLists, createList,
    getTags, createTag, addTagToTask, removeTagFromTask,
} from '../services/api';

const priorityStyles = {
    low: 'bg-text-subtle/20 text-text-muted',
    medium: 'bg-accent/20 text-accent',
    high: 'bg-warning/20 text-warning',
};
const statusBorder = {
    pending: 'border-l-text-subtle',
    in_progress: 'border-l-accent',
    completed: 'border-l-success',
};
const priorityLabels = { low: 'Baja', medium: 'Media', high: 'Alta' };

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [lists, setLists] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueAt, setDueAt] = useState('');
    const [listId, setListId] = useState('');

    const [newListName, setNewListName] = useState('');
    const [newTagName, setNewTagName] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [tasksData, listsData, tagsData] = await Promise.all([
                    getTasks(), getLists(), getTags(),
                ]);
                setTasks(tasksData);
                setLists(listsData);
                setTags(tagsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const newTask = await createTask({
                title, priority, due_at: dueAt || null, list_id: listId || null,
            });
            setTasks([{ ...newTask, tags: [] }, ...tasks]);
            setTitle(''); setPriority('medium'); setDueAt(''); setListId('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateList = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const newList = await createList(newListName, '');
            setLists([newList, ...lists]);
            setNewListName('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateTag = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const newTag = await createTag(newTagName);
            setTags([...tags, newTag]);
            setNewTagName('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleStatusChange = async (task, newStatus) => {
        setError('');
        try {
            const updated = await updateTask(task.id, { status: newStatus });
            setTasks(tasks.map((t) => (t.id === task.id ? { ...updated, tags: task.tags } : t)));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        setError('');
        try {
            await deleteTask(id);
            setTasks(tasks.filter((t) => t.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddTag = async (taskId, tagId) => {
        if (!tagId) return;
        setError('');
        try {
            await addTagToTask(taskId, tagId);
            setTasks(await getTasks());
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRemoveTag = async (taskId, tagId) => {
        setError('');
        try {
            await removeTagFromTask(taskId, tagId);
            setTasks(await getTasks());
        } catch (err) {
            setError(err.message);
        }
    };

    const isOverdue = (task) => {
        if (!task.due_at || task.status === 'completed') return false;
        return new Date(task.due_at) < new Date();
    };

    const renderTask = (task) => {
        const overdue = isOverdue(task);
        return (
            <li
                key={task.id}
                className={`bg-surface border border-border ${overdue ? 'border-l-4 border-l-danger' : `border-l-4 ${statusBorder[task.status]}`} rounded-xl p-4 flex flex-col gap-3`}
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className={`font-medium text-text ${task.status === 'completed' ? 'line-through text-text-subtle' : ''}`}>
                            {task.title}
                        </p>
                        {task.due_at && (
                            <p className={`text-xs mt-1 ${overdue ? 'text-danger font-medium' : 'text-text-muted'}`}>
                                {overdue ? '⚠ Venció el ' : 'Vence el '}
                                {new Date(task.due_at).toLocaleString()}
                            </p>
                        )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${priorityStyles[task.priority]}`}>
                        {priorityLabels[task.priority]}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task, e.target.value)}
                        className="bg-bg border border-border rounded-lg px-2 py-1 text-sm text-text outline-none focus:border-accent"
                    >
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En proceso</option>
                        <option value="completed">Completada</option>
                    </select>

                    <button
                        onClick={() => handleDelete(task.id)}
                        className="text-sm text-text-subtle hover:text-danger transition-colors ml-auto"
                    >
                        Eliminar
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
                    {task.tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="flex items-center gap-1 bg-accent/10 text-accent text-xs px-2 py-1 rounded-full"
                        >
                            #{tag.name}
                            <button
                                onClick={() => handleRemoveTag(task.id, tag.id)}
                                className="text-accent/70 hover:text-accent"
                            >
                                ×
                            </button>
                        </span>
                    ))}

                    <select
                        onChange={(e) => handleAddTag(task.id, e.target.value)}
                        value=""
                        className="bg-transparent border border-dashed border-border rounded-full px-2 py-1 text-xs text-text-subtle outline-none"
                    >
                        <option value="">+ etiqueta</option>
                        {tags
                            .filter((tag) => !task.tags.some((t) => t.id === tag.id))
                            .map((tag) => (
                                <option key={tag.id} value={tag.id}>{tag.name}</option>
                            ))}
                    </select>
                </div>
            </li>
        );
    };

    if (loading) {
        return <p className="text-text-muted">Cargando...</p>;
    }

    const overdueTasks = tasks.filter(isOverdue);
    const otherTasks = tasks.filter((t) => !isOverdue(t));
    const stats = [
        { label: 'Pendientes', value: tasks.filter((t) => t.status === 'pending').length, color: 'text-text-muted' },
        { label: 'En proceso', value: tasks.filter((t) => t.status === 'in_progress').length, color: 'text-accent' },
        { label: 'Completadas', value: tasks.filter((t) => t.status === 'completed').length, color: 'text-success' },
        { label: 'Atrasadas', value: overdueTasks.length, color: 'text-danger' },
    ];

    return (
        <div className="grid md:grid-cols-[240px_1fr] gap-8">
            {/* Barra lateral: libretas y etiquetas */}
            <aside className="space-y-8">
                <div>
                    <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                        Libretas
                    </h2>
                    <form onSubmit={handleCreateList} className="flex gap-2 mb-3">
                        <input
                            type="text"
                            placeholder="Nueva libreta"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            required
                            className="flex-1 bg-surface border border-border rounded-lg px-2 py-1 text-sm text-text outline-none focus:border-accent"
                        />
                        <button className="text-accent text-sm hover:underline">Crear</button>
                    </form>
                    <ul className="space-y-1">
                        {lists.map((list) => (
                            <li key={list.id} className="text-sm text-text-muted">
                                {list.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                        Etiquetas
                    </h2>
                    <form onSubmit={handleCreateTag} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Nueva etiqueta"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            required
                            className="flex-1 bg-surface border border-border rounded-lg px-2 py-1 text-sm text-text outline-none focus:border-accent"
                        />
                        <button className="text-accent text-sm hover:underline">Crear</button>
                    </form>
                </div>
            </aside>

            {/* Contenido principal: tareas */}
            <main>
                <h1 className="text-2xl font-semibold text-text mb-6">Mis Tareas</h1>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-surface border border-border rounded-xl p-4">
                            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                            <p className="text-text-subtle text-xs mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {error && (
                    <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-3 py-2 mb-4">
                        {error}
                    </p>
                )}

                <form
                    onSubmit={handleCreateTask}
                    className="bg-surface border border-border rounded-xl p-4 mb-8 flex flex-wrap gap-2"
                >
                    <input
                        type="text"
                        placeholder="Título de la tarea..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="flex-1 min-w-[160px] bg-bg border border-border rounded-lg px-3 py-2 text-text outline-none focus:border-accent"
                    />
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="bg-bg border border-border rounded-lg px-2 py-2 text-text outline-none focus:border-accent"
                    >
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                    </select>
                    <input
                        type="datetime-local"
                        value={dueAt}
                        onChange={(e) => setDueAt(e.target.value)}
                        className="bg-bg border border-border rounded-lg px-2 py-2 text-text outline-none focus:border-accent"
                    />
                    <select
                        value={listId}
                        onChange={(e) => setListId(e.target.value)}
                        className="bg-bg border border-border rounded-lg px-2 py-2 text-text outline-none focus:border-accent"
                    >
                        <option value="">Sin libreta</option>
                        {lists.map((list) => (
                            <option key={list.id} value={list.id}>{list.name}</option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="bg-accent hover:bg-accent-hover text-white font-medium rounded-lg px-4 py-2 transition-colors"
                    >
                        Agregar
                    </button>
                </form>

                {overdueTasks.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-danger uppercase tracking-wide mb-3">
                            ⚠ Atrasadas
                        </h2>
                        <ul className="space-y-3">{overdueTasks.map(renderTask)}</ul>
                    </div>
                )}

                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                    Tareas
                </h2>
                {otherTasks.length === 0 && overdueTasks.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-border rounded-xl">
                        <p className="text-text-muted">No tienes tareas todavía.</p>
                        <p className="text-text-subtle text-sm mt-1">Crea la primera arriba para empezar.</p>
                    </div>
                ) : (
                    otherTasks.length > 0 && (
                            <ul className="space-y-3">{otherTasks.map(renderTask)}</ul>
                    )
                )}
            </main>
        </div>
    );
}

export default Dashboard;
