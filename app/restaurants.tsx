import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import Colors from "../constants/Colors";
import { usePlaces } from "@/context/AppProvider";

interface Restaurant {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
  photos?: Array<{
    photo_reference?: string;
  }>;
}

// Define the structure of the places state
interface PlacesState {
  restaurants: Restaurant[];
  // Add other place types if needed
}

// Define the structure of the context value
interface PlacesContextValue {
  places: PlacesState;
  loading: boolean;
  error: string | null;
}

const Restaurants = () => {
  const { restaurants } = usePlaces();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        padding: 15,
      }}
    >
      {restaurants.map((restaurant, index) => (
        <Link href={"/details"} key={restaurant.place_id} asChild>
          <TouchableOpacity>
            <View style={styles.categoryCard}>
              {restaurant.photos && restaurant.photos.length > 0 ? (
                <Image
                  source={{
                    uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurant.photos[0].photo_reference}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`,
                  }}
                  style={styles.image}
                />
              ) : (
                <View style={[styles.image, styles.placeholderImage]}>
                  <Text>No image available</Text>
                </View>
              )}
              <View style={styles.categoryBox}>
                <Text style={styles.categoryText}>{restaurant.name}</Text>
                <Text style={{ color: Colors.green }}>
                  {restaurant.rating} ({restaurant.user_ratings_total})
                </Text>
                <Text style={{ color: Colors.medium }}>
                  {restaurant.vicinity}
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
    height: 250,
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
  },
  categoryText: {
    paddingVertical: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  image: {
    flex: 5,
    width: undefined,
    height: undefined,
  },
  placeholderImage: {
    backgroundColor: Colors.lightGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBox: {
    flex: 2,
    padding: 10,
  },
});

export default Restaurants;
