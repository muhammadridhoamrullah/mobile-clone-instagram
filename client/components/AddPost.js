import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { gql, useMutation } from "@apollo/client";

// Definisikan operasi mutasi GraphQL
const POST_MUTATION = gql`
  mutation CreatePost($input: CreatePosting!) {
    createPost(input: $input) {
      message
    }
  }
`;

const AddPost = () => {
  const navigation = useNavigation();

  // State untuk menyimpan nilai input dari form
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tags, setTags] = useState("");

  // Gunakan useMutation hook untuk mendefinisikan mutasi
  const [createPost, { loading, error }] = useMutation(POST_MUTATION, {
    // Redirect ke halaman Home jika mutasi berhasil
    onCompleted: () => {
      navigation.navigate("Home");
    },
    // Tampilkan pesan error jika terjadi kesalahan
    onError: (error) => {
      console.error("Mutation error:", error);
      Alert.alert("Error", "Gagal menambahkan postingan. Silakan coba lagi.");
    },
  });

  // Handler untuk menangani submit form
  const handleAddPost = async () => {
    try {
      // Panggil mutasi createPost dengan menggunakan nilai dari state
      await createPost({
        variables: {
          input: {
            content: content,
            imgUrl: imgUrl || null,
            tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
          },
        },
      });

      // Reset form setelah berhasil memposting
      setContent("");
      setImgUrl("");
      setTags("");
    } catch (error) {
      console.error("Mutation error:", error);
      Alert.alert("Error", `Gagal menambahkan postingan: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Postingan</Text>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder="Apa yang Anda pikirkan?"
        multiline
      />
      <Text style={styles.label}>URL Gambar:</Text>
      <TextInput
        style={styles.input}
        value={imgUrl}
        onChangeText={setImgUrl}
        placeholder="URL Gambar (opsional)"
      />
      <Text style={styles.label}>Tag:</Text>
      <TextInput
        style={styles.input}
        value={tags}
        onChangeText={setTags}
        placeholder="Tag (opsional, pisahkan dengan koma)"
      />
      <Button title="Post" onPress={handleAddPost} disabled={loading} />
      {loading && <Text>Posting...</Text>}
      {error && <Text>Error: {error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
});

export default AddPost;
