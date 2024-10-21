import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const COMMENT_MUTATION = gql`
  mutation createCommentPost($input: createComment) {
    createCommentPost(input: $input) {
      message
    }
  }
`;

const AddCommentScreen = ({ route }) => {
  const { postId } = route.params;
  const [content, setContent] = useState("");
  const [createCommentPost, { data, loading, error }] =
    useMutation(COMMENT_MUTATION);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      await createCommentPost({
        variables: {
          input: {
            PostId: postId,
            content,
          },
        },
      });
      navigation.navigate("Home"); // Navigate to home after successful comment
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={content}
        onChangeText={setContent}
        placeholder="Add your comment here"
        multiline
        numberOfLines={4}
      />
      <Button
        title={loading ? "Submitting..." : "Submit Comment"}
        onPress={handleSubmit}
        disabled={loading}
      />
      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
      {data && (
        <Text style={styles.successText}>{data.createCommentPost.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  textInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  errorText: {
    color: "red",
    marginTop: 8,
  },
  successText: {
    color: "green",
    marginTop: 8,
  },
});

export default AddCommentScreen;
