
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  is_disabled BOOLEAN DEFAULT false
);

CREATE TABLE files(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sid VARCHAR(100) UNIQUE NOT NULL,
  filename VARCHAR(100) NOT NULL,
  extension VARCHAR(10) NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE roles(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE permissions(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  list jsonb,
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE roles_permissions (
  roles_id int REFERENCES roles (id) ON UPDATE CASCADE ON DELETE CASCADE,
  permissions_id int REFERENCES permissions (id) ON UPDATE CASCADE,
  CONSTRAINT roles_permissions_pkey PRIMARY KEY (roles_id, permissions_id)
);
