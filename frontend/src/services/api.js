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

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
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
        throw new Error(data.message || 'Error al iniciar sesión');
    }

    return data; // contiene { message, token, user }
};
export const getTasks = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/tasks`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al obtener tareas');
    }

    return data.tasks;
};

export const createTask = async (title, description) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
    });

    const data = await response.json();

    if (!response.ok) {
        if (data.errors) {
            throw new Error(data.errors.map((e) => e.msg).join(', '));
        }
        throw new Error(data.message || 'Error al crear tarea');
    }

    return data.task;
};
export const updateTask = async (id, updates) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar tarea');
    }

    return data.task;
};

export const deleteTask = async (id) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar tarea');
    }

    return data;
};
