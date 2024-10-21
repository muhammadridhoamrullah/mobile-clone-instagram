import { useContext } from "react";
import { authContext } from "../contexts/authContext";
import { TouchableOpacity, Text } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function LogoutButton() {
  const { setIsSignedIn } = useContext(authContext);

  return (
    <TouchableOpacity
      onPress={async () => {
        await SecureStore.deleteItemAsync("access_token");
        setIsSignedIn(false);
      }}
    >
      <Text style={{ color: "blue", fontWeight: "bold" }}>Logout</Text>
    </TouchableOpacity>
  );
}
