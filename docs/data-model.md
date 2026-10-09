

#### Data Model

# QuickNotes Data Model

## 1. Entities and Relationships
- **users**: Stores account details. (One user has Many notes).
- **notes**: Stores the note content. (One note belongs to One user; One note has Many tags).
- **tags**: Stores unique tag names (e.g., 'urgent', 'work').
- **note_tags**: Join table resolving the Many-to-Many relationship between notes and tags.

## 2. CREATE TABLE Statements (SQL)
```sql
CREATE TABLE users (
  id         INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id         INTEGER PRIMARY KEY,
  user_id    INTEGER NOT NULL,
  title      TEXT NOT NULL CHECK(length(title) <= 100),
  body       TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tags (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE note_tags (
  note_id INTEGER NOT NULL,
  tag_id  INTEGER NOT NULL,
  PRIMARY KEY (note_id, tag_id), -- Composite key prevents duplicate tags on a note
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

## 3. Example SQL Queries
Get all notes for a specific user, newest first:
   SELECT * FROM notes WHERE user_id = 1 ORDER BY created_at DESC;
Get all notes tagged 'urgent' (Using JOIN):
   SELECT notes.title, notes.body 
   FROM notes
   JOIN note_tags ON note_tags.note_id = notes.id
   JOIN tags ON tags.id = note_tags.tag_id
   WHERE tags.name = 'urgent';
Count how many notes each user has:
   SELECT users.name, COUNT(notes.id) AS note_count
   FROM users
   LEFT JOIN notes ON notes.user_id = users.id
   GROUP BY users.id;

## Indexing 
Add an index on the user_id column in the notes table:
   CREATE INDEX idx_notes_user_id ON notes(user_id);
   Reason: The most common query is fetching all notes for a logged-in user (WHERE user_id = ?). An index allows the database to jump straight to that user's notes without scanning the entire table, drastically reducing read latency.

## SQL vs NoSQL 
Choose SQL (Relational) Database for QuickNotes. The data is highly structured (users, notes, tags) with clear, strict relationships. A relational database enforces data integrity via foreign keys and constraints (like the 100-character limit on titles), ensuring correctness. While NoSQL is great for flexible schemas, the strict structure and need for complex queries (like finding all notes with a specific tag via JOINs) make SQL the superior and safer choice for this application.