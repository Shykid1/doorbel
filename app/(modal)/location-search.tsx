// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import React, { useState } from "react";
// import MapView, { Marker } from "react-native-maps";
// import Colors from "@/constants/Colors";
// import { useNavigation } from "expo-router";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import { Ionicons } from "@expo/vector-icons";

// const LocationSearch = () => {
//   const navigation = useNavigation();
//   const [location, setLocation] = useState({
//     latitude: 9.432919,
//     longitude: -0.848452,
//     latitudeDelta: 0.005,
//     longitudeDelta: 0.005,
//   });

//   return (
//     <View style={{ flex: 1 }}>
//       <GooglePlacesAutocomplete
//         placeholder="Search or move the map"
//         fetchDetails={true}
//         onPress={(data, details) => {
//           const point = details?.geometry?.location;
//           if (!point) return;
//           setLocation({
//             ...location,
//             latitude: point.lat,
//             longitude: point.lng,
//           });
//         }}
//         query={{
//           key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
//           language: "en",
//         }}
//         renderLeftButton={() => (
//           <View style={styles.boxIcon}>
//             <Ionicons name="search-outline" size={24} color={Colors.medium} />
//           </View>
//         )}
//         styles={{
//           container: {
//             flex: 0,
//           },
//           textInput: {
//             backgroundColor: Colors.grey,
//             paddingLeft: 35,
//             borderRadius: 10,
//           },
//           textInputContainer: {
//             padding: 8,
//             backgroundColor: "#fff",
//           },
//         }}
//       />
//       <MapView showsUserLocation={true} style={styles.map} region={location}>
//         <Marker key={location.latitude} coordinate={location} />
//       </MapView>
//       <View style={styles.absoluteBox}>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.buttonText}>Confirm</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   map: {
//     flex: 1,
//   },
//   absoluteBox: {
//     position: "absolute",
//     bottom: 20,
//     width: "100%",
//   },
//   button: {
//     backgroundColor: Colors.primary,
//     padding: 16,
//     margin: 16,
//     alignItems: "center",
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   boxIcon: {
//     position: "absolute",
//     left: 15,
//     top: 18,
//     zIndex: 1,
//   },
// });

// export default LocationSearch;

// LocationSearch.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import { usePlaces } from "@/context/AppProvider";

const LocationSearch = () => {
  const navigation = useNavigation();
  const { currentLocation, isLocationLoading, locationError, refreshLocation } =
    usePlaces();
  const [destination, setDestination] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [eta, setEta] = useState<string | null>(null);

  const [mapRegion, setMapRegion] = useState({
    latitude: 9.432919,
    longitude: -0.848452,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  useEffect(() => {
    if (currentLocation) {
      setMapRegion({
        ...mapRegion,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    }
  }, [currentLocation]);

  const calculateETA = async (destinationPlace: any) => {
    if (!currentLocation || !destinationPlace) {
      console.log("Current location or destination not available");
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${currentLocation.latitude},${currentLocation.longitude}&destinations=place_id:${destinationPlace.place_id}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.status !== "OK") {
        console.error(
          "Distance Matrix API error:",
          data.status,
          data.error_message
        );
        setEta("Unable to calculate ETA");
        return;
      }

      if (
        data.rows &&
        data.rows.length > 0 &&
        data.rows[0].elements &&
        data.rows[0].elements.length > 0
      ) {
        const element = data.rows[0].elements[0];
        if (element.status === "OK" && element.duration) {
          setEta(element.duration.text);
        } else {
          console.log("No valid route found");
          setEta("No route available");
        }
      } else {
        console.log("Unexpected API response structure");
        setEta("ETA calculation failed");
      }
    } catch (error) {
      console.error("Error calculating ETA:", error);
      setEta("Error calculating ETA");
    }
  };

  if (isLocationLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text>Getting your location...</Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{locationError}</Text>
        <TouchableOpacity style={styles.button} onPress={refreshLocation}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <GooglePlacesAutocomplete
        placeholder="Search for a destination"
        fetchDetails={true}
        onPress={(data, details) => {
          const point = details?.geometry?.location;
          if (!point) return;
          setDestination({
            latitude: point.lat,
            longitude: point.lng,
          });
          setMapRegion({
            ...mapRegion,
            latitude: point.lat,
            longitude: point.lng,
          });
          calculateETA(details);
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          language: "en",
        }}
        renderLeftButton={() => (
          <View style={styles.boxIcon}>
            <Ionicons name="search-outline" size={24} color={Colors.medium} />
          </View>
        )}
        styles={{
          container: { flex: 0 },
          textInput: {
            backgroundColor: Colors.grey,
            paddingLeft: 35,
            borderRadius: 10,
          },
          textInputContainer: {
            padding: 8,
            backgroundColor: "#fff",
          },
        }}
      />
      <MapView style={styles.map} region={mapRegion} showsUserLocation={true}>
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
          />
        )}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor="blue"
          />
        )}
      </MapView>
      <View style={styles.absoluteBox}>
        {eta && <Text style={styles.etaText}>ETA: {eta}</Text>}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  absoluteBox: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  boxIcon: {
    position: "absolute",
    left: 15,
    top: 18,
    zIndex: 1,
  },
  etaText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default LocationSearch;
