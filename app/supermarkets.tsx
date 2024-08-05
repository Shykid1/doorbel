import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { usePlaces } from "@/context/AppProvider";
import { Link } from "expo-router";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const Supermarkets = () => {
  const { supermarkets, isLoading, error } = usePlaces();

  if (isLoading) {
    return <Text>Loading supermarkets...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: 15,
      }}
    >
      {supermarkets.map((supermarket) => (
        <Link
          href={{
            pathname: "/details/[id]",
            params: { id: supermarket.id },
          }}
          key={supermarket.id}
          asChild
        >
          <TouchableOpacity>
            <View style={styles.categoryCard}>
              {supermarket.photoUrl && supermarket.photoUrl.length > 0 ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: supermarket.photoUrl }}
                    style={styles.image}
                  />
                  <Text style={styles.deliveryText}>30 minutes delivery</Text>
                </View>
              ) : (
                <View style={[styles.image, styles.placeholderImage]}>
                  <Text>No image available</Text>
                </View>
              )}
              <View style={styles.categoryBox}>
                <Text style={styles.categoryText}>{supermarket.name}</Text>
                <Text style={styles.ratingText}>
                  <FontAwesome name="star" size={15} color="gold" />
                  {supermarket.rating} ({supermarket.userRatingsTotal})
                </Text>
                <Text style={styles.vicinityText}>
                  <FontAwesome6 name="location-dot" size={15} color="black" />
                  {` ${supermarket.address}`}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "semibold",
                    color: "grey",
                  }}
                >
                  Fried Rice • Plain Rice • Banku • More
                </Text>
                <Text
                  style={{ fontSize: 13, fontWeight: "bold", color: "grey" }}
                >
                  Meals from <Text style={{ color: "green" }}>GHC 15</Text> to{" "}
                  <Text style={{ color: "green" }}>GHC 50</Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    width: 300,
    height: 350,
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
    display: "flex",
  },
  categoryText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
  },
  imageContainer: {
    flex: 2,
    position: "relative",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "50%",
    borderRadius: 4,
    objectFit: "cover",
  },
  deliveryText: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
  },
  placeholderImage: {
    backgroundColor: Colors.lightGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBox: {
    flex: 2,
    padding: 10,
    height: 50,
    marginTop: 0,
    // marginBottom: 90,
    gap: 5,
  },
  ratingText: {
    color: Colors.green,
    fontSize: 14,
    marginVertical: 4,
    letterSpacing: 2,
  },
  vicinityText: {
    color: Colors.medium,
    fontSize: 12,
    marginBottom: 2,
  },
});

export default Supermarkets;
