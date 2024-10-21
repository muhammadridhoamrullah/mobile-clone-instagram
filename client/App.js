import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image, TextInput } from "react-native";
import Login from "./screen/Login";
import Register from "./screen/Register";
import Home from "./screen/Home";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./stackNavigator";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import AuthProvider from "./contexts/authContext";

export default function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <AuthProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ApolloProvider>
    </>
  );
}
