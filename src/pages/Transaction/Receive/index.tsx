import React from "react";
import { Grid } from "@mui/material";
import { TitlePage } from "../../../styles";
import CustomInput from "../../../components/TextField";
import { Copy } from "../../../assets/icon";
import QRCode from "react-qr-code";
import { TitlePageContainer, SubTitlePage, ReceiveTagHeader, BackgroundPage, ContainerFlexSpace, CopyAddressContainer, AddressContainer, ContainerQRCode, BackgroundPageQR } from "./receive.css";
import { useBlockchain } from "@app/blockchain";
import { copyAddress } from "@app/utils";

const Receive = () => {
  const { account: myAddress } = useBlockchain();
  return (
    <Grid container columns={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100 }}>
      <Grid item xs={100}>
        <TitlePageContainer>
          <TitlePage>Scan QR code</TitlePage>
        </TitlePageContainer>
      </Grid>
      <Grid item xs={100} sm={100} md={100} lg={50} xl={55}>
        <SubTitlePage>Use the camera on your device to scan the code, then wait for a confirmation from your old device.</SubTitlePage>
        <BackgroundPage>
          <ContainerFlexSpace>
            <ReceiveTagHeader>Address</ReceiveTagHeader>
            <CopyAddressContainer
              onClick={() => {
                copyAddress(myAddress);
              }}
            >
              <Copy /> Copy
            </CopyAddressContainer>
          </ContainerFlexSpace>
          <AddressContainer>
            <CustomInput size='small' disabled value={myAddress} variant='outlined' fullWidth margin='normal' styleTextField='disable' />
          </AddressContainer>
        </BackgroundPage>
      </Grid>
      <Grid item xs={100} sm={100} md={100} lg={50} xl={45}>
        <ContainerQRCode>
          <BackgroundPageQR>
            <QRCode value={myAddress || ""}></QRCode>
          </BackgroundPageQR>
        </ContainerQRCode>
      </Grid>
    </Grid>
  );
};
export default Receive;
