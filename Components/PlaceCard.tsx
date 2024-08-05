// PlaceCard.tsx
import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import Colors from "../constants/Colors";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

interface Place {
  id: string;
  name: string;
  rating?: number;
  userRatingsTotal?: number;
  address?: string;
  photoUrl?: string | null;
}

interface PlaceCardProps {
  place: Place;
  type: "restaurant" | "grocery" | "pharmacy" | "supermarket";
  images: string[];
}

const getRandomImage = (images: string[]) => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

const PlaceCard: React.FC<PlaceCardProps> = ({ place, type, images }) => {
  const getTypeSpecificInfo = () => {
    switch (type) {
      case "restaurant":
        return "Fried Rice • Plain Rice • Banku • More";
      case "grocery":
        return "Fresh Produce • Dairy • Bakery • More";
      case "pharmacy":
        return "Prescriptions • OTC Medicines • Health Products";
      case "supermarket":
        return "Groceries • Household Items • Fresh Food • More";
      default:
        return "";
    }
  };

  return (
    <Link
      href={{
        pathname: "/details/[id]",
        params: { id: place.id },
      }}
      asChild
    >
      <Pressable>
        <View style={styles.categoryCard}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: getRandomImage(images) }}
              style={styles.image}
            />
            <Text style={styles.deliveryText}>30 minutes delivery</Text>
          </View>
          <View style={styles.categoryBox}>
            <Text style={styles.categoryText}>{place.name}</Text>
            <Text style={styles.ratingText}>
              <FontAwesome name="star" size={15} color="gold" />
              {place.rating} ({place.userRatingsTotal})
            </Text>
            <Text style={styles.vicinityText}>
              <FontAwesome6 name="location-dot" size={15} color="black" />
              {` ${place.address}`}
            </Text>
            {type === "restaurant" && (
              <>
                <Text style={styles.typeInfo}>{getTypeSpecificInfo()}</Text>
                <Text style={styles.priceRange}>
                  Meals from <Text style={{ color: "green" }}>GHC 15</Text> to{" "}
                  <Text style={{ color: "green" }}>GHC 50</Text>
                </Text>
              </>
            )}
          </View>
        </View>
      </Pressable>
    </Link>
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
  categoryBox: {
    flex: 2,
    padding: 10,
    height: 50,
    marginTop: 0,
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
  typeInfo: {
    fontSize: 13,
    fontWeight: "500",
    color: "grey",
  },
  priceRange: {
    fontSize: 13,
    fontWeight: "bold",
    color: "grey",
  },
});

export default PlaceCard;
