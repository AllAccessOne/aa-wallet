import React from "react";
import { Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { TextField as CustomInput, Button as CustomButton } from "@app/components";
import { Copy } from "@app/assets/icon";
import { sliceAddress, copyAddress } from "@app/utils";
import { TitlePageBlack } from "@app/styles";
import { useBlockchain } from "@app/blockchain";
import { BackgroundPage, TitlePageContainer } from "../profile.css";
import { SubTitlePage, CopyAddressContainer, ContainerTextField } from "../../Transaction/transaction.css";
import { ContainerAvatar, ContainerInfo } from "./info.css";
const Info = () => {
  const { account: myAddress } = useBlockchain();
  return (
    <>
      <TitlePageContainer>
        <TitlePageBlack>This is your profile</TitlePageBlack>
        <SubTitlePage>You need to choose the correct network, address and coin to transfer to another wallet address.</SubTitlePage>
      </TitlePageContainer>
      <Grid container columns={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100 }}>
        <Grid item xs={100} lg={70}>
          <BackgroundPage>
            <Grid container columns={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100 }}>
              <Grid item xs={100} md={30}>
                <ContainerAvatar>
                  <Avatar alt='Remy Sharp' src='https://images.ctfassets.net/fu9did2d8yaw/2rUzSj8VDtr9YBmrU61c2G/a84a48f14f027886374cc618df4ae176/BAYC.png' sx={{ width: 200, height: 200 }} />
                  <CustomButton mTop='20px' mBottom='20px' text='Change avatar' styleButton='primary'></CustomButton>
                  <CopyAddressContainer onClick={() => copyAddress(myAddress)}>
                    {sliceAddress(myAddress)} <Copy />
                  </CopyAddressContainer>
                </ContainerAvatar>
              </Grid>
              <Grid item xs={100} md={70}>
                <ContainerInfo>
                  <ContainerTextField>
                    <label>User name</label>
                    <CustomInput size='small' fullWidth value={"Kiet Tran"} styleTextField='default' disabled></CustomInput>
                  </ContainerTextField>
                  <ContainerTextField>
                    <label>Gmail</label>
                    <CustomInput size='small' fullWidth value={"kiettran@lecle.co.kr"} styleTextField='default' disabled></CustomInput>
                  </ContainerTextField>
                  {/* <CustomButton width="40%" mLeft="60%" mTop="20px" mBottom="20px" text="Update" styleButton="primary" ></CustomButton> */}
                </ContainerInfo>
              </Grid>
            </Grid>
          </BackgroundPage>
        </Grid>
      </Grid>
    </>
  );
};
export default Info;
