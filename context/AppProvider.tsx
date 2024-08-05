// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import { Alert } from "react-native";
// import axios from "axios";
// import * as Location from "expo-location";

// // Type definitions

// interface Coordinates {
//   latitude: number;
//   longitude: number;
// }

// interface Address {
//   formatted_address: string;
//   city: string;
//   country: string;
// }

// interface openingHours {
//   open_now: boolean;
//   weekday_text: string[];
// }

// interface Place {
//   id: string;
//   name: string;
//   address: string;
//   photoUrl: string | null;
//   rating: number;
//   userRatingsTotal: number;
//   openingHours: openingHours | null;
// }

// interface PlacesContextType {
//   restaurants: Place[];
//   groceries: Place[];
//   supermarkets: Place[];
//   pharmacies: Place[];
//   isLoading: boolean;
//   error: string | null;
//   refreshData: () => Promise<void>;
//   currentLocation: Coordinates | null;
//   currentAddress: Address | null;
// }

// // Create the context
// const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

// // API configuration
// const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
// const BASE_URL = "https://maps.googleapis.com/maps/api/place";
// const GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json";

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
//   const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(
//     null
//   );
//   const [currentAddress, setCurrentAddress] = useState<Address | null>(null);

//   const getPhotoUrl = (
//     photoReference: string,
//     maxWidth: number = 400
//   ): string => {
//     return `${BASE_URL}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${API_KEY}`;
//   };

//   const fetchPlaces = async (type: string): Promise<Place[]> => {
//     if (!currentLocation) {
//       throw new Error("Current location not available");
//     }

//     try {
//       const { data } = await axios.get(`${BASE_URL}/nearbysearch/json`, {
//         params: {
//           location: `${currentLocation.latitude},${currentLocation.longitude}`,
//           radius: 35000, // 35km radius
//           type,
//           key: API_KEY,
//         },
//       });

//       return data.results.map((place: any) => ({
//         id: place.place_id,
//         name: place.name,
//         address: place.vicinity,
//         photoUrl:
//           place.photos && place.photos.length > 0
//             ? getPhotoUrl(place.photos[0].photo_reference)
//             : null,
//         rating: place.rating || 0,
//         userRatingsTotal: place.user_ratings_total || 0,
//       }));
//     } catch (error) {
//       console.error(`Error fetching ${type}:`, error);
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
//         fetchPlaces("grocery"),
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

//   const getLocationPermission = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       setError("Permission to access location was denied");
//       return false;
//     }
//     return true;
//   };

//   const getCurrentLocation = async () => {
//     const hasPermission = await getLocationPermission();
//     if (!hasPermission) return;

//     try {
//       const location = await Location.getCurrentPositionAsync({});
//       setCurrentLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//       await reverseGeocode(location.coords.latitude, location.coords.longitude);
//     } catch (error) {
//       console.error("Error getting current location:", error);
//       setError("Failed to get current location");
//     }
//   };

//   const reverseGeocode = async (latitude: number, longitude: number) => {
//     try {
//       const response = await axios.get(GEOCODING_URL, {
//         params: {
//           latlng: `${latitude},${longitude}`,
//           key: API_KEY,
//         },
//       });

//       if (response.data.results.length > 0) {
//         const result = response.data.results[0];
//         const city = result.address_components.find((component: any) =>
//           component.types.includes("locality")
//         )?.long_name;
//         const country = result.address_components.find((component: any) =>
//           component.types.includes("country")
//         )?.long_name;

//         setCurrentAddress({
//           formatted_address: result.formatted_address,
//           city: city || "",
//           country: country || "",
//         });
//       }
//     } catch (error) {
//       console.error("Error in reverse geocoding:", error);
//       setError("Failed to get address from coordinates");
//     }
//   };

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   useEffect(() => {
//     if (currentLocation) {
//       fetchAllPlaces();
//     }
//   }, [currentLocation]);

//   const refreshData = async () => {
//     await getCurrentLocation();
//     await fetchAllPlaces();
//   };

//   const value: PlacesContextType = {
//     restaurants,
//     groceries,
//     supermarkets,
//     pharmacies,
//     isLoading,
//     error,
//     refreshData,
//     currentLocation,
//     currentAddress,
//   };

//   return (
//     <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>
//   );
// };

// // Custom hook to use the context
// export const usePlaces = (): PlacesContextType => {
//   const context = useContext(PlacesContext);
//   if (context === undefined) {
//     throw new Error("usePlaces must be used within a PlacesProvider");
//   }
//   return context;
// };

// AppProvider.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import axios from "axios";
import * as Location from "expo-location";

// Type definitions
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Address {
  formatted_address: string;
  city: string;
  country: string;
}

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
  currentLocation: Coordinates | null;
  currentAddress: Address | null;
  isLocationLoading: boolean;
  locationError: string | null;
  refreshLocation: () => Promise<void>;
}

// Create the context
const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

// API configuration
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const BASE_URL = "https://maps.googleapis.com/maps/api/place";
const GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json";

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
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(
    null
  );
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getPhotoUrl = (
    photoReference: string,
    maxWidth: number = 400
  ): string => {
    return `${BASE_URL}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${API_KEY}`;
  };

  const fetchPlaces = async (type: string): Promise<Place[]> => {
    if (!currentLocation) {
      throw new Error("Current location not available");
    }

    try {
      const { data } = await axios.get(`${BASE_URL}/nearbysearch/json`, {
        params: {
          location: `${currentLocation.latitude},${currentLocation.longitude}`,
          radius: 35000, // 35km radius
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
        openingHours: place.opening_hours || null,
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
        fetchPlaces("grocery"),
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

  const getLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationError("Permission to access location was denied");
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    setIsLocationLoading(true);
    setLocationError(null);

    const hasPermission = await getLocationPermission();
    if (!hasPermission) {
      setIsLocationLoading(false);
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      await reverseGeocode(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error("Error getting current location:", error);
      setLocationError("Failed to get current location");
    } finally {
      setIsLocationLoading(false);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(GEOCODING_URL, {
        params: {
          latlng: `${latitude},${longitude}`,
          key: API_KEY,
        },
      });

      if (response.data.results.length > 0) {
        const result = response.data.results[0];
        const city = result.address_components.find((component: any) =>
          component.types.includes("locality")
        )?.long_name;
        const country = result.address_components.find((component: any) =>
          component.types.includes("country")
        )?.long_name;

        setCurrentAddress({
          formatted_address: result.formatted_address,
          city: city || "",
          country: country || "",
        });
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      setError("Failed to get address from coordinates");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      fetchAllPlaces();
    }
  }, [currentLocation]);

  const refreshData = async () => {
    await getCurrentLocation();
    await fetchAllPlaces();
  };

  const refreshLocation = async () => {
    await getCurrentLocation();
  };

  const value: PlacesContextType = {
    restaurants,
    groceries,
    supermarkets,
    pharmacies,
    isLoading,
    error,
    refreshData,
    currentLocation,
    currentAddress,
    isLocationLoading,
    locationError,
    refreshLocation,
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
