import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, StyleSheet, Text, View, Image, TextInput } from "react-native";

const REGISTER_MUTATION = gql`
  mutation Register($input: CreateUserInput!) {
    createUser(input: $input) {
      _id
      name
      username
      email
      # Jika diperlukan, tambahkan properti lain yang ingin Anda ambil setelah registrasi berhasil
    }
  }
`;

export default function Register() {
  const navigation = useNavigation();

  // State untuk menyimpan data registrasi
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  // Fungsi untuk menangani perubahan pada input
  const handleChange = (name, value) => {
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  // Penggunaan useMutation untuk melakukan registrasi
  const [registerMutation, { data, loading, error }] = useMutation(
    REGISTER_MUTATION,
    {
      onCompleted: async (data) => {
        // Di sini, Anda dapat menangani respons dari mutasi setelah selesai
        // Contoh: Simpan access token jika diperlukan
        // await SecureStore.setItemAsync("access_token", data.createUser.access_token);
        // Arahkan pengguna ke halaman yang sesuai setelah pendaftaran sukses
        console.log("Registrasi berhasil:", data);
        // Misalnya, arahkan pengguna ke halaman utama aplikasi setelah pendaftaran berhasil
        navigation.navigate("Login");
      },
      onError: (error) => {
        // Di sini, Anda dapat menangani kesalahan yang terjadi selama mutasi
        console.error("Error saat registrasi:", error);
        // Misalnya, tampilkan pesan kesalahan kepada pengguna
        // atau tangani kesalahan secara tepat
      },
    }
  );

  // Return dari komponen Register
  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1000px-Instagram_logo_2022.svg.png",
        }}
      />

      {/* Input untuk nama */}
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        placeholder="Name"
        onChangeText={(text) => handleChange("name", text)}
      />

      {/* Input untuk username */}
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        placeholder="Username"
        onChangeText={(text) => handleChange("username", text)}
      />

      {/* Input untuk email */}
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        placeholder="Email"
        onChangeText={(text) => handleChange("email", text)}
      />

      {/* Input untuk password */}
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        placeholder="Password"
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry={true} // Untuk menyembunyikan teks password
      />

      {/* Tombol untuk melakukan registrasi */}
      <Button
        color="blue"
        title="Register"
        onPress={() => {
          // Panggil registerMutation dengan data registrasi saat tombol ditekan
          registerMutation({
            variables: {
              input: registerData, // Mengirimkan data registrasi ke server GraphQL
            },
          });
        }}
      />

      {/* Link untuk login jika sudah memiliki akun */}
      <Text>
        Already have an account?{" "}
        <Text
          style={{ color: "blue" }}
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Text>
      </Text>

      {/* StatusBar untuk menampilkan status aplikasi */}
      <StatusBar style="auto" />
    </View>
  );
}

// Styles untuk komponen Register
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
