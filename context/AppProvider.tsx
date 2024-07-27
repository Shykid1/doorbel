import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface PlacesContextValue {
  restaurants: any[];
  isLoading: boolean;
  error: Error | null;
}

const AppContext = createContext<PlacesContextValue | undefined>(undefined);

export const PlacesProvider = ({ children }: { children: React.ReactNode }) => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=9.432919,-0.848452&radius=1500&type=restaurant&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`
        );
        setRestaurants(response.data.results);
      } catch (error) {
        console.error(error);
        setError(
          error instanceof Error ? error : new Error("An error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <AppContext.Provider value={{ restaurants, isLoading, error }}>
      {children}
    </AppContext.Provider>
  );
};

export const usePlaces = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("usePlaces must be used within a PlacesProvider");
  }
  return context;
};
