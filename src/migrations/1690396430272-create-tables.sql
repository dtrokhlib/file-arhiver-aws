
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(100),
  firstName VARCHAR(100),
  lastName VARCHAR(100)
);

CREATE TABLE files(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  filename VARCHAR(100),
  extension VARCHAR(10),
  userId INTEGER,
  FOREIGN KEY (userId) REFERENCES users (id)
);