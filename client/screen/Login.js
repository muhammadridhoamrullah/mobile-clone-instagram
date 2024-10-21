import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useContext, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

import * as SecureStore from "expo-secure-store";
import { authContext } from "../contexts/authContext";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginUserInput!) {
    loginuser(input: $input) {
      access_token
    }
  }
`;

export default function Login() {
  const navigation = useNavigation();

  const { setIsSignedIn } = useContext(authContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginMutation, { data, loading, error }] = useMutation(
    LOGIN_MUTATION,
    {
      onCompleted: async (data) => {
        await SecureStore.setItemAsync(
          "access_token",
          data.loginuser.access_token
        );
        setIsSignedIn(true);
      },
    }
  );

  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1000px-Instagram_logo_2022.svg.png",
        }}
      />

      <TextInput
        onChangeText={setUsername}
        style={styles.input}
        placeholder="Email / Username"
        autoCapitalize="none"
      />
      <TextInput
        onChangeText={setPassword}
        style={styles.input}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry={true}
      />

      <TouchableOpacity
        onPress={() => {
          loginMutation({
            variables: {
              input: {
                username: username,
                password: password,
              },
            },
          });
        }}
      >
        <Text>Login</Text>
      </TouchableOpacity>
      <Text>
        Dont' have an account?{" "}
        <Text
          onPress={() => navigation.navigate("Register")}
          style={{ color: "blue" }}
        >
          Register
        </Text>
      </Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tinyLogo: {
    width: 200,
    height: 200,
    objectFit: "cover",
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: 200,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    borderRadius: 7,
    borderColor: "gray",
  },
});
