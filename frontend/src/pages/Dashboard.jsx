import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, getLists, createList } from '../services/api';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Campos del formulario de nueva tarea
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueAt, setDueAt] = useState('');
    const [listId, setListId] = useState('');

    // Campo para crear una nueva libreta
    const [newListName, setNewListName] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [tasksData, listsData] = await Promise.all([getTasks(), getLists()]);
                setTasks(tasksData);
                setLists(listsData);
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
                title,
                priority,
                due_at: dueAt || null,
                list_id: listId || null,
            });
            setTasks([newTask, ...tasks]);
            setTitle('');
            setPriority('medium');
            setDueAt('');
            setListId('');
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

    const handleStatusChange = async (task, newStatus) => {
        setError('');
        try {
            const updated = await updateTask(task.id, { status: newStatus });
            setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
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

    if (loading) return <p>Cargando...</p>;

    return (
        <div>
            <h2>Mis Libretas</h2>
            <form onSubmit={handleCreateList}>
                <input
                    type="text"
                    placeholder="Nueva libreta..."
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    required
                />
                <button type="submit">Crear libreta</button>
            </form>
            <ul>
                {lists.map((list) => (
                    <li key={list.id}>{list.name}</li>
                ))}
            </ul>

            <hr />

            <h2>Mis Tareas</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleCreateTask}>
                <input
                    type="text"
                    placeholder="Título de la tarea..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                </select>

                <input
                    type="datetime-local"
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                />

                <select value={listId} onChange={(e) => setListId(e.target.value)}>
                    <option value="">Sin libreta</option>
                    {lists.map((list) => (
                        <option key={list.id} value={list.id}>
                            {list.name}
                        </option>
                    ))}
                </select>

                <button type="submit">Agregar tarea</button>
            </form>

            {tasks.length === 0 ? (
                <p>No tienes tareas todavía.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <strong>{task.title}</strong> — Prioridad: {task.priority}
                            {task.due_at && ` — Vence: ${new Date(task.due_at).toLocaleString()}`}

                            <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task, e.target.value)}
                            >
                                <option value="pending">Pendiente</option>
                                <option value="in_progress">En proceso</option>
                                <option value="completed">Completada</option>
                            </select>

                            <button onClick={() => handleDelete(task.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dashboard;
