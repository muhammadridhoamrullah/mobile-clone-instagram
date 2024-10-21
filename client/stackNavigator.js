import React, { useContext } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screen/Home";
import Login from "./screen/Login";
import Register from "./screen/Register";
import { authContext } from "./contexts/authContext";
import LogoutButton from "./components/LogoutButton";
import { Text, TouchableOpacity } from "react-native"; // Import TouchableOpacity untuk tombol
import AddPost from "./components/AddPost";
import { Feather } from "@expo/vector-icons"; // Import Feather icons for the left header button
import AddComment from "./components/AddComment";
import ProfileScreen from "./components/ProfileScreen";
import FollowerList from "./components/FollowerList";
import FollowingList from "./components/FollowingList";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { isSignedIn } = useContext(authContext);
  const navigation = useNavigation(); // Dapatkan objek navigation

  return (
    <Stack.Navigator>
      {!isSignedIn ? (
        <>
          <Stack.Screen
            screenOptions={{ headerShown: false }}
            name="Login"
            component={Login}
          />
          <Stack.Screen
            screenOptions={{ headerShown: false }}
            name="Register"
            component={Register}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerTitle: "Home",
              headerRight: () => <LogoutButton />,
              headerLeft: () => (
                <TouchableOpacity
                  style={{ marginLeft: 15 }}
                  onPress={() => navigation.navigate("AddPost")}
                >
                  <Text style={{ color: "blue", fontSize: 16 }}>Add Post</Text>
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="AddPost"
            component={AddPost}
            options={{ title: "Add Post" }}
          />
          <Stack.Screen
            name="AddComment"
            component={AddComment}
            options={{ title: "Add Comment" }}
          />
          <Stack.Screen
            name="UserProfile"
            component={ProfileScreen}
            options={{ title: "User Profile" }}
          />
          <Stack.Screen
            name="FollowerList"
            options={{ title: "Follower List" }}
            component={FollowerList}
          />
          <Stack.Screen
            name="FollowingList"
            options={{ title: "Following List" }}
            component={FollowingList}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
