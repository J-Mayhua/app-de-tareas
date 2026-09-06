const API_URL = 'http://localhost:3000/api';

export const registerUser = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        if (data.errors) {
            throw new Error(data.errors.map((e) => e.msg).join(', '));
        }
        throw new Error(data.message || 'Error al registrar usuario');
    }

    return data;
};
