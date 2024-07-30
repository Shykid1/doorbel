// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// interface PlacesContextValue {
//   restaurants: any[];
//   isLoading: boolean;
//   error: Error | null;
// }

// const AppContext = createContext<PlacesContextValue | undefined>(undefined);

// export const PlacesProvider = ({ children }: { children: React.ReactNode }) => {
//   const [restaurants, setRestaurants] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       try {
//         const response = await axios.get(
//           `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=9.432919,-0.848452&radius=1500&type=restaurant&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`
//         );
//         setRestaurants(response.data.results);
//       } catch (error) {
//         console.error(error);
//         setError(
//           error instanceof Error ? error : new Error("An error occurred")
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchRestaurants();
//   }, []); // Empty dependency array ensures this effect runs only once on mount

//   return (
//     <AppContext.Provider value={{ restaurants, isLoading, error }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const usePlaces = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error("usePlaces must be used within a PlacesProvider");
//   }
//   return context;
// };

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import { Alert } from "react-native";
// import axios from "axios";

// // Define the structure of a place
// interface Place {
//   place_id: string;
//   name: string;
//   rating?: number;
//   user_ratings_total?: number;
//   vicinity?: string;
//   photos?: Array<{
//     photo_reference?: string;
//   }>;
// }

// // Define the structure of the context
// interface PlacesContextType {
//   restaurants: Place[];
//   groceries: Place[];
//   supermarkets: Place[];
//   pharmacies: Place[];
//   isLoading: boolean;
//   error: string | null;
//   refreshData: () => void;
// }

// // Create the context
// const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

// // API key and base URL
// const API_KEY = "YOUR_GOOGLE_PLACES_API_KEY";
// const BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

// // Provider component
// export const PlacesProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [restaurants, setRestaurants] = useState<Place[]>([]);
//   const [groceries, setGroceries] = useState<Place[]>([]);
//   const [supermarkets, setSupermarkets] = useState<Place[]>([]);
//   const [pharmacies, setPharmacies] = useState<Place[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPlaces = async (type: string) => {
//     try {
//       const { data } = await axios.get(`${BASE_URL}`, {
//         params: {
//           location: "37.7749,-122.4194", // Example: San Francisco coordinates
//           radius: 1500, // 1.5km radius
//           type,
//           key: API_KEY,
//         },
//       });

//       return data.results.map((place: any) => ({
//         id: place.place_id,
//         name: place.name,
//         address: place.vicinity,
//         // Map other properties as needed
//       }));
//     } catch (error) {
//       throw new Error(`Error fetching ${type}`);
//     }
//   };

//   const fetchAllPlaces = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const [
//         fetchedRestaurants,
//         fetchedGroceries,
//         fetchedSupermarkets,
//         fetchedPharmacies,
//       ] = await Promise.all([
//         fetchPlaces("restaurant"),
//         fetchPlaces("grocery_or_supermarket"),
//         fetchPlaces("supermarket"),
//         fetchPlaces("pharmacy"),
//       ]);

//       setRestaurants(fetchedRestaurants);
//       setGroceries(fetchedGroceries);
//       setSupermarkets(fetchedSupermarkets);
//       setPharmacies(fetchedPharmacies);
//     } catch (error) {
//       setError("Failed to fetch places. Please try again.");
//       Alert.alert("Error", "Failed to fetch places. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllPlaces();
//   }, []);

//   const refreshData = () => {
//     fetchAllPlaces();
//   };

//   const value = {
//     restaurants,
//     groceries,
//     supermarkets,
//     pharmacies,
//     isLoading,
//     error,
//     refreshData,
//   };

//   return (
//     <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>
//   );
// };

// // Custom hook to use the context
// export const usePlaces = () => {
//   const context = useContext(PlacesContext);
//   if (context === undefined) {
//     throw new Error("usePlaces must be used within a PlacesProvider");
//   }
//   return context;
// };

// PlacesContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import axios from "axios";

// Type definitions

interface openingHours {
  open_now: boolean;
  weekday_text: string[];
}
interface Place {
  id: string;
  name: string;
  address: string;
  photoUrl: string | null;
  rating: number;
  userRatingsTotal: number;
  openingHours: openingHours | null;
}

interface PlacesContextType {
  restaurants: Place[];
  groceries: Place[];
  supermarkets: Place[];
  pharmacies: Place[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

// Create the context
const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

// API configuration
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const BASE_URL = "https://maps.googleapis.com/maps/api/place";

// Provider component
export const PlacesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [restaurants, setRestaurants] = useState<Place[]>([]);
  const [groceries, setGroceries] = useState<Place[]>([]);
  const [supermarkets, setSupermarkets] = useState<Place[]>([]);
  const [pharmacies, setPharmacies] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPhotoUrl = (
    photoReference: string,
    maxWidth: number = 400
  ): string => {
    return `${BASE_URL}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${API_KEY}`;
  };

  const fetchPlaces = async (type: string): Promise<Place[]> => {
    try {
      const { data } = await axios.get(`${BASE_URL}/nearbysearch/json`, {
        params: {
          location: "9.432919,-0.848452", // Example: Tamale coordinates
          radius: 1500, // 1.5km radius
          type,
          key: API_KEY,
        },
      });

      return data.results.map((place: any) => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        photoUrl:
          place.photos && place.photos.length > 0
            ? getPhotoUrl(place.photos[0].photo_reference)
            : null,
        rating: place.rating || 0,
        userRatingsTotal: place.user_ratings_total || 0,
      }));
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      throw new Error(`Error fetching ${type}`);
    }
  };

  const fetchAllPlaces = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [
        fetchedRestaurants,
        fetchedGroceries,
        fetchedSupermarkets,
        fetchedPharmacies,
      ] = await Promise.all([
        fetchPlaces("restaurant"),
        fetchPlaces("grocery_or_supermarket"),
        fetchPlaces("supermarket"),
        fetchPlaces("pharmacy"),
      ]);

      setRestaurants(fetchedRestaurants);
      setGroceries(fetchedGroceries);
      setSupermarkets(fetchedSupermarkets);
      setPharmacies(fetchedPharmacies);
    } catch (error) {
      setError("Failed to fetch places. Please try again.");
      Alert.alert("Error", "Failed to fetch places. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPlaces();
  }, []);

  const refreshData = async () => {
    await fetchAllPlaces();
  };

  const value: PlacesContextType = {
    restaurants,
    groceries,
    supermarkets,
    pharmacies,
    isLoading,
    error,
    refreshData,
  };

  return (
    <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>
  );
};

// Custom hook to use the context
export const usePlaces = (): PlacesContextType => {
  const context = useContext(PlacesContext);
  if (context === undefined) {
    throw new Error("usePlaces must be used within a PlacesProvider");
  }
  return context;
};

// // Sample usage component
// // PlacesList.tsx
// import React from 'react';
// import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
// import { usePlaces } from './PlacesContext';

// const PlacesList: React.FC = () => {
//   const { restaurants, groceries, supermarkets, pharmacies, isLoading, error, refreshData } = usePlaces();

//   if (isLoading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity onPress={refreshData} style={styles.retryButton}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const renderItem = ({ item }: { item: Place }) => (
//     <View style={styles.itemContainer}>
//       {item.photoUrl && (
//         <Image source={{ uri: item.photoUrl }} style={styles.image} />
//       )}
//       <View style={styles.infoContainer}>
//         <Text style={styles.name}>{item.name}</Text>
//         <Text style={styles.address}>{item.address}</Text>
//         <Text style={styles.rating}>Rating: {item.rating} ({item.userRatingsTotal} reviews)</Text>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={[...restaurants, ...groceries, ...supermarkets, ...pharmacies]}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         refreshing={isLoading}
//         onRefresh={refreshData}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   image: {
//     width: 80,
//     height: 80,
//     borderRadius: 5,
//   },
//   infoContainer: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   address: {
//     fontSize: 14,
//     color: '#666',
//   },
//   rating: {
//     fontSize: 12,
//     color: '#888',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     fontSize: 16,
//     color: 'red',
//     marginBottom: 10,
//   },
//   retryButton: {
//     backgroundColor: '#007AFF',
//     padding: 10,
//     borderRadius: 5,
//   },
//   retryButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });

// export default PlacesList;

// // App.tsx
// import React from 'react';
// import { SafeAreaView } from 'react-native';
// import { PlacesProvider } from './PlacesContext';
// import PlacesList from './PlacesList';

// const App: React.FC = () => {
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <PlacesProvider>
//         <PlacesList />
//       </PlacesProvider>
//     </SafeAreaView>
//   );
// };

// export default App;
