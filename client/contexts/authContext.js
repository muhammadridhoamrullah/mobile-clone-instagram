import { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export const authContext = createContext(null);

export default function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const checkLogin = async () => {
    // const token = await SecureStore.getItemAsync("access_token");
    const token = await SecureStore.getItemAsync("access_token");
    // const parsedAccessToken = JSON.parse(token);

    // console.log(parsedAccessToken, "ini ptoken");

    token ? setIsSignedIn(true) : setIsSignedIn(false);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <authContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      {children}
    </authContext.Provider>
  );
}
