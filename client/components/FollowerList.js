import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useQuery, gql } from "@apollo/client";

const GET_FOLLOWERS = gql`
  query getFollower($followingId: ID!) {
    getFollower(followingId: $followingId) {
      follower {
        username
      }
    }
  }
`;

const FollowerList = ({ route }) => {
  const { followingId } = route.params;
  const { data, loading, error } = useQuery(GET_FOLLOWERS, {
    variables: { followingId },
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  return (
    <FlatList
      data={data.getFollower}
      keyExtractor={(item) => item.follower.username}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.follower.username}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default FollowerList;
