import React from "react";
import { createContext, FC, useEffect, useState } from "react";
import { getTokenFCM, onMessageListener } from "@app/configs/firebase";

import React from "react";
type NotificationContextApi = {
  token: string;
};
export const NotificationContext = createContext<NotificationContextApi>({
  token: "",
});

export const NotificationProvider: FC<any> = ({ children }) => {
  const [token, setToken] = useState<NotificationContextApi["token"]>("");

  useEffect(() => {
    getTokenFCM()
      .then(token => {
        setToken(token);
      })
      .catch(error => console.error(error));
  }, []);

  // Handle insert token by master public key
  useEffect(() => {
    onMessageListener().then(data => {
      console.log("Receive foreground: ", data);
    });
  });

  // Handle detect new device, and verify it
  useEffect(() => {
    onMessageListener().then(data => {
      console.log("Receive foreground: ", data);
    });
  });
  return (
    <NotificationContext.Provider
      value={{
        token,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
