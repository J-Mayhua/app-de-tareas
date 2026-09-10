import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            await registerUser(email, password);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-sm bg-surface border border-border rounded-xl p-8">
                <h1 className="text-2xl font-semibold text-text mb-1">Crear cuenta</h1>
                <p className="text-text-muted text-sm mb-6">Organiza tus tareas desde hoy.</p>

                {error && (
                    <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-3 py-2 mb-4">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-success text-sm bg-success/10 border border-success/30 rounded-lg px-3 py-2 mb-4">
                        Cuenta creada. Redirigiendo a inicio de sesión...
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
                        <p className="text-text-subtle text-xs mt-1">Mínimo 6 caracteres.</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent-hover text-white font-medium rounded-lg py-2 transition-colors"
                    >
                        Registrarse
                    </button>
                </form>

                <p className="text-text-muted text-sm mt-6 text-center">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-accent hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
