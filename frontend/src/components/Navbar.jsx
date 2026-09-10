import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="flex items-center justify-between mb-10">
            <div className="flex items-baseline gap-2">
                <h1 className="text-xl font-semibold text-text">Listo</h1>
                <span className="text-text-subtle text-sm">tus tareas, en orden</span>
            </div>
            <button
                onClick={handleLogout}
                className="text-sm text-text-muted hover:text-danger transition-colors"
            >
                Cerrar sesión
            </button>
        </header>
    );
}

export default Navbar;
