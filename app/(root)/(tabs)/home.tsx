import { AppleLogout } from "@/components/buttons/AppleAuth";
import { View, Text } from "react-native";
import * as SecureStore from "expo-secure-store";

import React, { useEffect, useState } from "react";

export default function Home() {
  const [appleID, setAppleID] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppleID = async () => {
      const id = await SecureStore.getItemAsync("appleID");
      setAppleID(id);
    };
    fetchAppleID();
  }, []);

  return (
    <View className="flex flex-col justify-center items-center h-screen">
      <Text>Tab [Home]</Text>
      <Text>Apple ID: {appleID}</Text>
      <AppleLogout />
    </View>
  );
}
