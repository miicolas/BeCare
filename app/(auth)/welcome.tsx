import { Text, View, Image, Pressable } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignInWithApple } from "../../components/buttons/AppleAuth";

const Onboarding = () => {

  const { loading } = useAuth();

  if (loading) {
    return (
      <View className="flex flex-col justify-center items-center h-screen">
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView className="p-4 w-screen flex flex-col justify-between h-screen ">
      <View className="flex flex-col justify-between  mt-10">
        <Text className="text-5xl font-bold">
          Track your emotions to make your life better
        </Text>
        <Image
          source={require("../../assets/images/bg-welcome.png")}
          className="w-full h-[30rem] absolute top-20 -z-10 "
        />
      </View>

      <View className="">
        <SignInWithApple />
      
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
