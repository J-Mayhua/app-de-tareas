import { useState, useEffect } from 'react';
import { getTasks } from '../services/api';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (loading) return <p>Cargando tareas...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Mis Tareas</h2>
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
