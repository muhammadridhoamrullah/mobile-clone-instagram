import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { gql, useMutation } from "@apollo/client";

// Define the like mutation
const LIKE_MUTATION = gql`
  mutation likePost($input: createLike) {
    createLikePost(input: $input) {
      message
    }
  }
`;

const PostCard = ({ post }) => {
  const navigation = useNavigation();
  const [likesCount, setLikesCount] = useState(
    post.likes ? post.likes.length : 0
  );
  const [liked, setLiked] = useState(false); // State to track if the post is liked by the user

  const [likePost] = useMutation(LIKE_MUTATION, {
    onCompleted: (data) => {
      console.log(data.createLikePost.message);
    },
    onError: (error) => {
      console.error("Error liking post:", error);
      // Rollback state if the mutation fails
      setLikesCount(likesCount - 1);
      setLiked(false);
    },
  });

  const handleAddComment = () => {
    navigation.navigate("AddComment", { postId: post._id });
  };

  const handleLike = () => {
    if (!liked) {
      setLikesCount(likesCount + 1);
      setLiked(true);
      likePost({
        variables: {
          input: { PostId: post._id },
        },
      });
    }
  };

  const handleProfileNavigation = () => {
    navigation.navigate("UserProfile", {
      userId: post.author._id,
      username: post.author.name,
    });
  };

  return (
    <View style={styles.postContainer}>
      {/* Header Post */}
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={handleProfileNavigation}>
          <Text style={styles.author}>{post.author.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Gambar Post */}
      <Image source={{ uri: post.imgUrl }} style={styles.postImage} />

      {/* Footer Post: Icon Like, Comment, Share */}
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.iconContainer} onPress={handleLike}>
          <Feather name="heart" size={24} color={liked ? "red" : "black"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handleAddComment}
        >
          <Feather name="message-circle" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <FontAwesome name="share" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Jumlah Likes */}
      <View style={styles.likes}>
        <Text>{likesCount} likes</Text>
      </View>

      {/* Username dan content */}
      <View style={styles.usernameContainer}>
        <TouchableOpacity onPress={handleProfileNavigation}>
          <Text style={styles.username}>{post.author.name}</Text>
        </TouchableOpacity>
        <Text style={styles.content}>{post.content}</Text>
      </View>

      {/* Komentar */}
      <View style={styles.comments}>
        {post.comments &&
          post.comments.map((comment, index) => (
            <View key={index} style={styles.commentPost}>
              <Text style={styles.commentUsername}>{comment.username}: </Text>
              <Text>{comment.content}</Text>
            </View>
          ))}
      </View>

      {/* Tambah Komentar */}
      <View style={styles.addCommentContainer}>
        <TouchableOpacity
          onPress={handleAddComment}
          style={styles.addCommentButton}
        >
          <Text style={styles.addCommentText}>Add Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  commentPost: {
    flexDirection: "row",
    marginBottom: 5,
  },
  commentUsername: {
    fontWeight: "600",
    marginRight: 5,
  },
  addCommentContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  addCommentButton: {
    backgroundColor: "#3897f0",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addCommentText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default PostCard;
