import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useRoute, useNavigation } from "@react-navigation/native";

const FOLLOW_MUTATION = gql`
  mutation followUser($input: FollowUserInput!) {
    createFollow(input: $input) {
      message
    }
  }
`;

const UserProfile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId, avatarUrl, username } = route.params;

  const [followed, setFollowed] = useState(false);

  const [followUser] = useMutation(FOLLOW_MUTATION, {
    onCompleted: (data) => {
      console.log(data.createFollow.message);
      setFollowed(true);
    },
    onError: (error) => {
      console.error("Error following user:", error);
      setFollowed(false);
    },
  });

  const handleFollow = () => {
    followUser({ variables: { input: { followingId: userId } } });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <Text style={styles.username}>{username}</Text>
      <TouchableOpacity
        style={[styles.followButton, followed && styles.followedButton]}
        onPress={handleFollow}
        disabled={followed}
      >
        <Text style={styles.followButtonText}>
          {followed ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.listButton}
        onPress={() =>
          navigation.navigate("FollowerList", { followingId: userId })
        }
      >
        <Text style={styles.listButtonText}>Followers</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.listButton}
        onPress={() =>
          navigation.navigate("FollowingList", { followerId: userId })
        }
      >
        <Text style={styles.listButtonText}>Following</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  followButton: {
    backgroundColor: "#3897f0",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 100,
    marginBottom: 10,
  },
  followedButton: {
    backgroundColor: "#ccc",
  },
  followButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  listButton: {
    backgroundColor: "#3897f0",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 100,
    marginVertical: 5,
  },
  listButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default UserProfile;
