import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await loginUser(email, password);
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-sm bg-surface border border-border rounded-xl p-8">
                <h1 className="text-2xl font-semibold text-text mb-1">Bienvenido de vuelta</h1>
                <p className="text-text-muted text-sm mb-6">Ingresa para ver tus tareas.</p>

                {error && (
                    <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-3 py-2 mb-4">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm text-text-muted mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text focus:border-accent outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm text-text-muted mb-1">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text focus:border-accent outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent-hover text-white font-medium rounded-lg py-2 transition-colors"
                    >
                        Entrar
                    </button>
                </form>

                <p className="text-text-muted text-sm mt-6 text-center">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-accent hover:underline">
                        Crea una
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
