import Router from "./router";
import { store } from "./store";
import { Provider } from "react-redux";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  const configGoogle: string = process.env.CLIENT_GOOGLE_API_KEY as string;

  return (
    <GoogleOAuthProvider clientId={configGoogle || "75654006966-s37ejl8kvu35bog54p8bl6aa8dn5ioe4.apps.googleusercontent.com"}>
      <Provider store={store}>
        <Router />
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
