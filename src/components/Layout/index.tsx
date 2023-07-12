import React, { useState, useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Grid } from "@mui/material";
import { lightTheme, darkTheme, GlobalStyles } from "@app/styles";
import { RoutesProps } from "@app/types/route.type";
import { routes } from "@app/configs/data";
import { useCustomSnackBar, useFetchWallet, usePushNotifications } from "@app/hooks";
import { MessagePayload } from "@firebase/messaging";
import { ShareInfo } from "@app/wallet/metadata";
import { Header, Footer, Sidebar, DeviceModal } from "../";
import { isEmpty } from "lodash";
import { KeyPair } from "@app/wallet/types";
import { useLocalStorage } from "usehooks-ts";
//import { getTorusKey } from "@app/storage/storage-service";
// import { ChainNetwork } from "@app/types/blockchain.type";
// import { Token } from "@app/types/blockchain.type";
// import { useAppSelector, useAppDispatch } from "@app/store";
// import { preProcessHistoryResponse } from "@app/utils"
// import { setHistoriesAddress } from "@app/store/redux/history/actions";
// import { getTorusKey } from "@app/storage/storage-service";
const LayoutApp: React.FC<RoutesProps> = (props: React.PropsWithChildren<RoutesProps>) => {
  const [masterKey, _] = useLocalStorage<KeyPair | null>("master-key", null);
  const [networkKey, __] = useLocalStorage<KeyPair | null>("network-key", null);

  //const [theme, setTheme] = useState("light");
  // const themeToggler = () => {
  //     theme === "light" ? setTheme("dark") : setTheme("light");
  // }
  // const dispatch = useAppDispatch();
  // const listTokenState = useAppSelector(state => state.token);
  // const networkState = useAppSelector(state => state.network);
  // const fetchData = async (currentNetwork: ChainNetwork) => {
  //   const listToken = listTokenState.currentListTokens.data.filter((tokens: Token) => tokens.rpcUrls === currentNetwork.rpcUrls && tokens.tokenContract !== undefined);
  //   const historyTransaction = await preProcessHistoryResponse(currentNetwork, myAddress, listToken);
  //   dispatch(setHistoriesAddress(historyTransaction));
  // };
  // useEffect(() => {
  //   fetchData(networkState.currentNetwork.data)
  // }, [])
  const location = useLocation();
  const { updateShareForPublicKey, getInfoWalletByNetworkKey } = useFetchWallet();
  const { handleNotification } = useCustomSnackBar();
  const checkLayout = routes.find(route => route.path === location.pathname);
  const [isDesktop, setIsDesktop] = useState(false);
  const [detectDevice, setDetectDevice] = useState<ShareInfo | null>(null);
  const [loadingDetectDevice, setLoadingDetectDevice] = useState(false);
  const handleResize = () => {
    if (window.innerWidth < 600) {
      setIsDesktop(false);
    } else {
      setIsDesktop(true);
    }
  };
  useLayoutEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const theme = "light";

  const handleDetectDevice = (message: MessagePayload) => {
    if (!message) return;
    if (isEmpty(masterKey)) return;
    if (message.notification?.title === "confirm-device") {
      // Display modal
      const share = JSON.parse(message?.notification?.body || "{}") as ShareInfo;
      setDetectDevice(share);
    }
    return;
  };

  usePushNotifications(handleDetectDevice);

  useEffect(() => {
    const channel = new BroadcastChannel("notifications");
    channel.addEventListener("message", event => {
      console.log("Receive background from SW", event.data);
      handleDetectDevice(event.data);
    });
  }, []);

  const handleConfirmDevice = async () => {
    if (isEmpty(detectDevice)) return;
    const data = await getInfoWalletByNetworkKey(networkKey as KeyPair);
    if (data.error) return;

    setLoadingDetectDevice(true);
    const { error } = await updateShareForPublicKey(data.info!, detectDevice);
    if (error) {
      setLoadingDetectDevice(false);
      handleNotification(error, "error");
      return;
    }
    handleNotification("Confirm successfully", "success");
    setDetectDevice(null);
    setLoadingDetectDevice(false);
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyles></GlobalStyles>
      <DeviceModal
        title='Confirm device'
        subTitle='Please confirm new device if you logged!'
        loading={loadingDetectDevice}
        device={detectDevice}
        isCurrent={false}
        handleClose={() => setDetectDevice(null)}
        handleConfirm={handleConfirmDevice}
      />

      {checkLayout?.layout ? (
        <Grid container columns={{ xs: 100, sm: 100, md: 100, lg: 100 }}>
          <Grid item xs={100} sm={26} md={20} lg={16}>
            <Sidebar display={isDesktop} />
          </Grid>
          <Grid item xs={100} sm={74} md={80} lg={84}>
            <Header />
            {props.children}
            <Footer />
          </Grid>
        </Grid>
      ) : (
        <div>{props.children}</div>
      )}
    </ThemeProvider>
  );
};

export default LayoutApp;
