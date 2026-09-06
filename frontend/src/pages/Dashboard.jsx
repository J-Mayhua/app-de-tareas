import { useState, useEffect } from 'react';
import { getTasks, createTask } from '../services/api';

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
                            {task.title} — {task.completed ? 'Completada' : 'Pendiente'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dashboard;
