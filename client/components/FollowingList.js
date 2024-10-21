import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useQuery, gql } from "@apollo/client";

const GET_FOLLOWING = gql`
  query getFollowing($followerId: ID!) {
    getFollowing(followerId: $followerId) {
      following {
        username
      }
    }
  }
`;

const FollowingList = ({ route }) => {
  const { followerId } = route.params;
  const { data, loading, error } = useQuery(GET_FOLLOWING, {
    variables: { followerId },
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  return (
    <FlatList
      data={data.getFollowing}
      keyExtractor={(item) => item.following.username}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.following.username}</Text>
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

export default FollowingList;
