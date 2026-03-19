import { DatabaseSync } from 'node:sqlite';

interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

const db = new DatabaseSync(':memory:');

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export const userRepository = {
  create(user: Omit<User, 'id' | 'createdAt'>): User {
    const stmt = db.prepare('INSERT INTO users (username, email) VALUES (?, ?)');
    const result = stmt.run(user.username, user.email);
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as unknown as User;
    return row;
  },
};
