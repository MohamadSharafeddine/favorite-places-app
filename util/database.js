import * as SQLite from "expo-sqlite";

let db;

export const initializeDatabase = async () => {
  db = await SQLite.openDatabaseAsync("places.db");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      imageUri TEXT NOT NULL,
      address TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL
    );
  `);
};

export const insertPlace = async (title, imageUri, address, location) => {
  const result = await db.runAsync(
    "INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?);",
    title,
    imageUri,
    address,
    location.lat,
    location.lng
  );
  return result.lastInsertRowId;
};

export const fetchPlaces = async () => {
  const allRows = await db.getAllAsync("SELECT * FROM places;");
  return allRows;
};

export const fetchPlaceWithId = async (id) => {
  const firstRow = await db.getFirstAsync(
    "SELECT * FROM places WHERE id = ?;",
    id
  );
  return firstRow;
};

export const deletePlace = async (id) => {
  const result = await db.runAsync("DELETE FROM places WHERE id = ?;", id);
  return result.changes;
};

export const updatePlace = async (id, title, imageUri, address, lat, lng) => {
  const result = await db.runAsync(
    "UPDATE places SET title = ?, imageUri = ?, address = ?, lat = ?, lng = ? WHERE id = ?;",
    title,
    imageUri,
    address,
    lat,
    lng,
    id
  );
  return result.changes;
};
