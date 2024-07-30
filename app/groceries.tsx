import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { usePlaces, PlacesContextValue } from "@/context/AppProvider";

const Groceries = () => {
  const { places, loading, error }: PlacesContextValue = usePlaces();

  if (loading) {
    return <Text>Loading groceries...</Text>;
  }

  if (error) {
    return <Text>Error: {error.toString()}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={places.groceries}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.vicinity}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Groceries;
