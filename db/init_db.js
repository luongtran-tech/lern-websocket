const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
async function main() {
  const db = await open({
    filename: "chat.db",
    driver: sqlite3.Database,
  });
  // create our 'messages' table (you can ignore the 'client_offset' column for now)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS notification (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
    );
  `);
}

module.exports = main;
