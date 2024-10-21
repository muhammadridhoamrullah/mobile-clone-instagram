import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import PostCard from "../components/PostCard";

export const POST_QUERY = gql`
  query Query {
    getPost {
      _id
      content
      tags
      imgUrl
      createdAt
      updatedAt
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      author {
        name
      }
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(POST_QUERY);
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) return <Text>Loading ...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const filteredPosts = data.getPost.filter((post) =>
    post.author && post.author.name
      ? post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      : false
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by author name"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <FlatList
        data={filteredPosts}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {}}>
            <PostCard post={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  postContainer: {
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  author: {
    fontSize: 16,
    fontWeight: "600",
  },
  postImage: {
    width: "100%",
    height: 300,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    marginTop: 10,
  },
  iconContainer: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  likes: {
    paddingHorizontal: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  usernameContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 8,
  },
  username: {
    fontWeight: "bold",
    marginRight: 8,
  },
  content: {
    flex: 1,
    flexWrap: "wrap",
  },
  comments: {
    paddingHorizontal: 15,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
  commentUsername: {
    fontWeight: "600",
    marginRight: 5,
  },
});
