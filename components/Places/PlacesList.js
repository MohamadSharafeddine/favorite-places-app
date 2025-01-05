import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function PlacesList({ places }) {
  return (
    <FlatList data={places} keyExtractor={(item) => item.id} renderItem={{}} />
  );
}

const styles = StyleSheet.create({});
