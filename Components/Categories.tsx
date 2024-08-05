import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import { categories } from "@/assets/data/home";
import { Link } from "expo-router";

const Categories = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        padding: 15,
      }}
    >
      {categories.map((category, index) => (
        <Link
          href={{
            pathname: `${category.path}`,
          }}
          key={index}
          asChild
        >
          <Pressable>
            <View style={styles.categoryCard}>
              <Image source={category.img} />
              <Text style={styles.categoryText}>{category.text}</Text>
            </View>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  categoryCard: {
    width: 120,
    height: 120,
    backgroundColor: "#fff",
    marginEnd: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    borderRadius: 4,
    alignItems: "center",
  },
  categoryText: {
    padding: 6,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Categories;
