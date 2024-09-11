import * as AppleAuthentication from "expo-apple-authentication";
import { useRouter } from "expo-router";
import { Pressable, View, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function SignInWithApple() {
  const router = useRouter();

  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    const checkAppleAuth = async () => {
      try {
        const isAvailable = await AppleAuthentication.isAvailableAsync();
        setAppleAuthAvailable(isAvailable);

        if (isAvailable) {
          const credential = await SecureStore.getItemAsync("appleID");
          if (credential) {
            const parsedCredential = JSON.parse(credential);
            console.log("Is already signed in:", parsedCredential);
            router.replace("/(root)/(tabs)/home");
          }
        }
      } catch (error) {
        console.error(
          "Error checking Apple Authentication availability:",
          error
        );
      }
    };
    checkAppleAuth();
  }, []);

  const handleSignIn = async () => {
    try {
      console.log("Sign in");
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });


      if (credential) {
        const decodedToken = jwtDecode(credential.identityToken!);
        console.log("Decoded token:", decodedToken);
        const sub = decodedToken.sub;

        // chercher dans la db si la personne existe avec le sub
        const fetchUser = await fetch("/api/auth/checkUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appleId: sub,
          }),
        });
        const user = await fetchUser.json();
        console.log("user", user);

        if (user.checkUser) {

          await SecureStore.setItemAsync("appleID", JSON.stringify(decodedToken.sub));
          console.log('connexion reussi')
          router.replace("/(root)/(tabs)/home");

        }
        else {
          console.log("User not found, creating user");
          const createUser = await fetch("/api/auth/createUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: credential.identityToken,
              appleId: sub,
              email: decodedToken.email,
              provider: "apple",
            }),
          });
          console.log("create user response", createUser);
          if (!createUser.ok) {
            const errorText = await createUser.text();  // Pour obtenir plus de détails sur l'erreur
            throw new Error(`Error ${createUser.status}: ${errorText}`);
          }
          
          const data = await createUser.json();
          console.log("create user data", data);

          if (data.message === "User created") {
            await SecureStore.setItemAsync("appleID", JSON.stringify(decodedToken.sub));
            console.log('creation reussi')
            router.replace("/(root)/(tabs)/home");
          }
        }
        
      }
    } catch (e: any) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        console.log("User canceled the sign-in flow");
      } else {
        console.error("Sign in error:", e);
      }
    }
  };

  return (
    <View className="flex flex-row justify-center">
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        className="w-full h-12"
        onPress={handleSignIn}
      />
    </View>
  );
}

export function AppleLogout() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      console.log("Sign out");
      await SecureStore.deleteItemAsync("appleID");
      router.replace("/(auth)/welcome");
    } catch (e: any) {
      console.error("Sign out error:", e);
    }
  };

  return (
    <Pressable onPress={handleSignOut}>
      <Text className="text-blue-500">Sign out</Text>
    </Pressable>
  );
}

