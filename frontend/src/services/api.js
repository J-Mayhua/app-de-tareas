const API_URL = 'http://localhost:3000/api';

// ---------- Auth ----------

export const registerUser = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        if (data.errors) throw new Error(data.errors.map((e) => e.msg).join(', '));
        throw new Error(data.message || 'Error al registrar usuario');
    }

    return data;
};

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        if (data.errors) throw new Error(data.errors.map((e) => e.msg).join(', '));
        throw new Error(data.message || 'Error al iniciar sesión');
    }

    return data;
};

// ---------- Helper interno ----------

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// ---------- Tasks ----------

export const getTasks = async () => {
    const response = await fetch(`${API_URL}/tasks`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener tareas');
    return data.tasks;
};

export const createTask = async (taskData) => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(taskData),
    });

    const data = await response.json();
    if (!response.ok) {
        if (data.errors) throw new Error(data.errors.map((e) => e.msg).join(', '));
        throw new Error(data.message || 'Error al crear tarea');
    }
    return data.task;
};

export const updateTask = async (id, updates) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (!response.ok) {
        if (data.errors) throw new Error(data.errors.map((e) => e.msg).join(', '));
        throw new Error(data.message || 'Error al actualizar tarea');
    }
    return data.task;
};

export const deleteTask = async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al eliminar tarea');
    return data;
};

export const addTagToTask = async (taskId, tagId) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}/tags`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ tag_id: tagId }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al agregar etiqueta');
    return data;
};

export const removeTagFromTask = async (taskId, tagId) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}/tags/${tagId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al quitar etiqueta');
    return data;
};

// ---------- Lists ----------

export const getLists = async () => {
    const response = await fetch(`${API_URL}/lists`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener libretas');
    return data.lists;
};

export const createList = async (name, description) => {
    const response = await fetch(`${API_URL}/lists`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name, description }),
    });

    const data = await response.json();
    if (!response.ok) {
        if (data.errors) throw new Error(data.errors.map((e) => e.msg).join(', '));
        throw new Error(data.message || 'Error al crear libreta');
    }
    return data.list;
};

// ---------- Tags ----------

export const getTags = async () => {
    const response = await fetch(`${API_URL}/tags`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener etiquetas');
    return data.tags;
};

export const createTag = async (name) => {
    const response = await fetch(`${API_URL}/tags`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name }),
    });

    const data = await response.json();
    if (!response.ok) {
        if (data.errors) throw new Error(data.errors.map((e) => e.msg).join(', '));
        throw new Error(data.message || 'Error al crear etiqueta');
    }
    return data.tag;
};
