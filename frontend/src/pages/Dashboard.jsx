import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks();
                setTasks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const newTask = await createTask(title, '');
            setTasks([newTask, ...tasks]);
            setTitle('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleCompleted = async (task) => {
        setError('');
        try {
            const updated = await updateTask(task.id, { completed: !task.completed });
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

    if (loading) return <p>Cargando tareas...</p>;

    return (
        <div>
            <h2>Mis Tareas</h2>

            <form onSubmit={handleCreateTask}>
                <input
                    type="text"
                    placeholder="Nueva tarea..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <button type="submit">Agregar</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {tasks.length === 0 ? (
                <p>No tienes tareas todavía.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleCompleted(task)}
                            />
                            <span
                                style={{
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                }}
                            >
                                {task.title}
                            </span>
                            <button onClick={() => handleDelete(task.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dashboard;
