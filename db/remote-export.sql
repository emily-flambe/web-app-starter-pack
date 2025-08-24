PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);
INSERT INTO todos VALUES(1,'hello',0,1756077573,1756077573);
INSERT INTO todos VALUES(2,'hi',0,1756077574,1756077574);
INSERT INTO todos VALUES(3,'how',0,1756077575,1756077575);
INSERT INTO todos VALUES(4,'are',0,1756077576,1756077576);
INSERT INTO todos VALUES(5,'you',0,1756077576,1756077576);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('todos',5);
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
