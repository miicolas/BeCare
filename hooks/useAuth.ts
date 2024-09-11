import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAvailable = await AppleAuthentication.isAvailableAsync();
        if (isAvailable) {
          const credential = await SecureStore.getItemAsync("appleID");
          if (credential) {
            router.replace("/(root)/(tabs)/home");
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return { loading };
};