import Router from "./router";
import { store } from "./store";
import { Provider } from "react-redux";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "@onflow/fcl";

config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "flow.network": "testnet",
  "0xFlowToken": "0x7e60df042a9c0868",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
});
const App = () => {
  const configGoogle: string = process.env.REACT_APP_CLIENT_GOOGLE_API_KEY as string;

  return (
    <GoogleOAuthProvider clientId={configGoogle}>
      <Provider store={store}>
        <Router />
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
