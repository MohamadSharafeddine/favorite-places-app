import * as SQLite from "expo-sqlite";
import { Place } from "../models/place";

let db;

const openDatabase = async () => {
  db = await SQLite.openDatabaseAsync("places.db");
  console.log("Database opened");
};

export const initializeDatabase = async () => {
  try {
    await openDatabase();
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
    console.log("Table created or already exists");
  } catch (error) {
    console.error("Failed to initialize database", error);
    throw error;
  }
};

export const insertPlace = async (place) => {
  try {
    const result = await db.runAsync(
      "INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?);",
      place.title,
      place.imageUri,
      place.address,
      place.location.lat,
      place.location.lng
    );
    console.log("Place inserted", result);
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Failed to insert place", error);
    throw error;
  }
};

export const fetchPlaces = async () => {
  try {
    const allRows = await db.getAllAsync("SELECT * FROM places;");
    console.log("Fetched places", allRows);
    const places = [];
    for (const db of allRows) {
      places.push(
        new Place(
          db.title,
          db.imageUri,
          { address: db.address, lat: db.lat, lng: db.lng },
          db.id
        )
      );
    }
    console.log("Places", places);
    return places;
  } catch (error) {
    console.error("Failed to fetch places", error);
    throw error;
  }
};

export const fetchPlaceWithId = async (id) => {
  try {
    const firstRow = await db.getFirstAsync(
      "SELECT * FROM places WHERE id = ?;",
      id
    );
    console.log("Fetched place with id", firstRow);
    return firstRow;
  } catch (error) {
    console.error("Failed to fetch place with id", error);
    throw error;
  }
};

export const deletePlace = async (id) => {
  try {
    const result = await db.runAsync("DELETE FROM places WHERE id = ?;", id);
    console.log("Place deleted", result);
    return result.changes;
  } catch (error) {
    console.error("Failed to delete place", error);
    throw error;
  }
};

export const updatePlace = async (place) => {
  try {
    const result = await db.runAsync(
      "UPDATE places SET title = ?, imageUri = ?, address = ?, lat = ?, lng = ? WHERE id = ?;",
      place.title,
      place.imageUri,
      place.address,
      place.location.lat,
      place.location.lng,
      place.id
    );
    console.log("Place updated", result);
    return result.changes;
  } catch (error) {
    console.error("Failed to update place", error);
    throw error;
  }
};
