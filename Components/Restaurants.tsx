import React from "react";
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
      {restaurants.map((restaurant) => (
        <Link
          href={{
            pathname: "/details/[id]",
            params: { id: restaurant.place_id },
          }}
          key={restaurant.place_id}
          asChild
        >
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
                <Text style={styles.ratingText}>
                  {restaurant.rating} ({restaurant.user_ratings_total})
                </Text>
                <Text style={styles.vicinityText}>{restaurant.vicinity}</Text>
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
    height: 260,
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
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
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
    height: 40,
    marginTop: 0,
    marginBottom: 30,
  },
  ratingText: {
    color: Colors.green,
    fontSize: 14,
    marginBottom: 2,
  },
  vicinityText: {
    color: Colors.medium,
    fontSize: 12,
    marginBottom: 2,
  },
});

// const styles = StyleSheet.create({
//   categoryCard: {
//     width: 300,
//     height: 250,
//     backgroundColor: "#fff",
//     marginEnd: 10,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.06,
//     borderRadius: 4,
//   },
//   categoryText: {
//     paddingVertical: 5,
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   image: {
//     flex: 5,
//     width: undefined,
//     height: undefined,
//   },
//   placeholderImage: {
//     backgroundColor: Colors.lightGrey,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   categoryBox: {
//     flex: 2,
//     padding: 10,
//     height: 20,
//     marginTop: 0,
//   },
//   ratingText: {
//     color: Colors.green,
//     fontSize: 14,
//     marginBottom: 2,
//   },
//   vicinityText: {
//     color: Colors.medium,
//     fontSize: 12,
//     marginBottom: 2,
//   },
// });

export default Restaurants;
