import Router from "./router";
import { store } from "./store/store";
import { Provider } from "react-redux";
import React from "react";

const App = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

export default App;
