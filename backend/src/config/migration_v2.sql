-- 1. Crear tabla de libretas (lists)
CREATE TABLE lists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Crear tabla de etiquetas (tags)
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL
);

-- 3. Tabla intermedia muchos-a-muchos entre tasks y tags
CREATE TABLE task_tags (
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

-- 4. Agregar columnas nuevas a tasks
ALTER TABLE tasks ADD COLUMN list_id INTEGER REFERENCES lists(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD COLUMN priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));
ALTER TABLE tasks ADD COLUMN due_at TIMESTAMP;
ALTER TABLE tasks ADD COLUMN status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed'));

-- 5. Migrar los datos existentes: convertir 'completed' (booleano) al nuevo 'status'
UPDATE tasks SET status = 'completed' WHERE completed = TRUE;
UPDATE tasks SET status = 'pending' WHERE completed = FALSE;

-- 6. Ahora que 'status' tiene los datos correctos, eliminamos la columna vieja
ALTER TABLE tasks DROP COLUMN completed;
