import { Grid } from "@mui/material";
import { Page } from "../../styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import base from "../../styles/theme/base";
import { createBreakpoint } from "styled-components-breakpoint";
import Typography from "@mui/material/Typography";
import React from "react";
import CustomButton from "../../components/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import CustomInput from "../../components/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { NetworkContainer } from "../../components/Network";
import { myListCoin, historyData } from "../../configs/data/test";
import { Copy } from "../../assets/icon";
import QRCode from "react-qr-code";

import { HaaderPageBalance, OverviewHeaderTopCoin, TextHeaderOverview, SubHeaderPage } from "../Overview/overview.css";
import { TitlePage } from "../../styles";
import styled from "styled-components";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const breakpoint = createBreakpoint(base.breakpoints);

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <OverviewHeaderTopCoin>
          <Typography>{children}</Typography>
        </OverviewHeaderTopCoin>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const Transaction = () => {
  const myAdress = "0x15375...b080f";
  const myFullAddress = "0xea5a9433df5ea7f57206668e71d8577362dfed02";
  const [value, setValue] = React.useState(0);
  const [token, setToken] = React.useState("ETH");

  const handleChange2 = (event: any) => {
    setToken(event.target.value as string);
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Page>
      <Grid container columns={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100 }}>
        <Grid item xs={100} sm={100} md={100} lg={50} xl={60}>
          <OverviewHeaderTopCoin>
            <TabsCustom value={value} onChange={handleChange} aria-label='basic tabs example'>
              <TabTransfer label='Transfer' {...a11yProps(0)} />
              <TabTransfer label='Receive' {...a11yProps(1)} />
            </TabsCustom>
          </OverviewHeaderTopCoin>
        </Grid>
        <Grid item xs={100} sm={100} md={50} lg={50} xl={40}>
          <NetworkContainerFixed>
            <NetworkContainer />
          </NetworkContainerFixed>
        </Grid>

        <Grid container columns={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100 }}>
          <Grid>
            <ContainerTabs value={value} index={0}>
              <TilePageContainer>
                <TitlePage>Transfer your Ethereum</TitlePage>
              </TilePageContainer>
              <SubTitlePage>You need to choose the correct network, address and coin to transfer to another wallet address.</SubTitlePage>
            </ContainerTabs>
          </Grid>
          <Grid item xs={100} sm={100} md={100} lg={50} xl={55}>
            <ContainerTabs value={value} index={0}>
              <BackgroundPage>
                <FormControl fullWidth>
                  <InputLabelCustom required id='select-token'>
                    Select coin
                  </InputLabelCustom>
                  <SelectCustom labelId='select-token' id='token' value={token} label='Select coin' size='medium' onChange={handleChange2}>
                    {myListCoin.map(coin => (
                      <MenuItem value={coin.symbol}>
                        <SelectCoin>
                          <img width={"20px"} src={coin.img}></img>
                          {coin.name}
                        </SelectCoin>
                      </MenuItem>
                    ))}
                  </SelectCustom>
                  <CustomInput size='medium' margin='normal' styleTextField='default' label='Transfer to' required></CustomInput>
                  <CustomInput size='medium' margin='dense' styleTextField='default' label='Amount' required></CustomInput>
                  <ContainerFlexSpace>
                    <div>Maxium desposit</div>
                    <div>0.00001 ETH</div>
                  </ContainerFlexSpace>
                  <ContainerFlexSpace>
                    <div>Network desposit</div>
                    <div>$12.34</div>
                  </ContainerFlexSpace>
                  <ContainerFlexSpace>
                    <TextHeaderOverview>Total cost</TextHeaderOverview>
                    <TextHeaderOverview>$12.34</TextHeaderOverview>
                  </ContainerFlexSpace>
                  <ContainerRight>
                    <CustomButton text='Transfer' styleButton='primary' width='150px' height='50px'></CustomButton>
                  </ContainerRight>
                </FormControl>
              </BackgroundPage>
            </ContainerTabs>
          </Grid>
          <Grid item xs={100} sm={100} md={100} lg={50} xl={45}>
            <ContainerTabs value={value} index={0}>
              <BackgroundPage>
                <ReceiveTagHeader>Account balance</ReceiveTagHeader>
                <CopyAddressContainer>
                  {myAdress} <Copy />{" "}
                </CopyAddressContainer>
                <BalanceNumberCard>
                  {myListCoin.find(coin => coin.symbol === token)?.balance} {token}
                </BalanceNumberCard>
              </BackgroundPage>
            </ContainerTabs>
          </Grid>
        </Grid>
        <Grid container columns={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100 }}>
          <Grid item xs={100}>
            <TabPanel value={value} index={1}>
              <TilePageContainer>
                <TitlePage>Scan QR code</TitlePage>
              </TilePageContainer>
            </TabPanel>
          </Grid>
          <Grid item xs={100} sm={100} md={100} lg={50} xl={55}>
            <TabPanel value={value} index={1}>
              <SubTitlePage>Use the camera on your device to scan the code, then wait for a confirmation from your old device.</SubTitlePage>
              <BackgroundPage>
                <ContainerFlexSpace>
                  <ReceiveTagHeader>Address</ReceiveTagHeader>
                  <CopyAddressContainer>
                    <Copy /> Copy
                  </CopyAddressContainer>
                </ContainerFlexSpace>
                <AddressContainer>
                  <CustomInput disabled defaultValue={myFullAddress} variant='outlined' fullWidth size='medium' margin='normal' styleTextField='disable' />
                </AddressContainer>
              </BackgroundPage>
            </TabPanel>
          </Grid>
          <Grid item xs={100} sm={100} md={100} lg={50} xl={45}>
            <TabPanel value={value} index={1}>
              <ContainerQRCode>
                <BackgroundPageQR>
                  <QRCode value={myFullAddress}></QRCode>
                </BackgroundPageQR>
              </ContainerQRCode>
            </TabPanel>
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};
export default Transaction;
const BackgroundPageQR = styled.div`
  background-color: white;
  border: 1px solid #fafafa;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 5px 5px 5px 5px rgba(88, 88, 88, 0.2);
`;

const AddressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ContainerQRCode = styled.div`
  margin: 30px 0;
`;
const ReceiveTagHeader = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.neutrals.gray600};
`;
const SubTitlePage = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: ${({ theme }) => theme.fontSizes.xs + "px"};
  line-height: 24px;

  color: ${({ theme }) => theme.colors.neutrals.gray600};
  ${breakpoint("xs")`
    width: 100%;
`}
  ${breakpoint("sm")`
     margin: 20px 0;
     width: 100%;
  `}
  ${breakpoint("md")`
     margin: 20px 0;
     width: 100%;
  `}
  ${breakpoint("lg")`
     margin: 20px 0;
     width: 60%;
  `}
`;

const BackgroundPage = styled.div`
  background-color: #fafafa;
  padding: 40px;
  border-radius: 8px;
`;

const SelectCoin = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  img {
    margin-right: 10px;
  }
`;
const SelectCustom = styled(Select)`
  border-radius: 8px !important;
  margin: 0;
`;
const InputLabelCustom = styled(InputLabel)`
  border-radius: 8px !important;
`;
const ContainerFlexSpace = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;
const ContainerTabs = styled(TabPanel)`
  .css-ahj2mt-MuiTypography-root {
    width: 100%;
  }
`;
const ContainerRight = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  margin-top: 30px;
`;
export const CopyAddressContainer = styled.a`
  cursor: pointer;
  display: flex;
  justify-content: left;
  align-items: center;
  svg {
    margin-left: 5px;
    margin-right: 5px;
  }
`;

const BalanceNumberCard = styled.div`
  font-weight: 600;
  font-size: 32px;
  line-height: 48px;
  margin: 20px 0;
`;
export const TilePageContainer = styled.div`
  ${breakpoint("xs")`
    display: none;
`}
  ${breakpoint("lg")`
    display: block;
  `}
`;
export const TabsCustom = styled(Tabs)`
  background-color: #f6f6f6 !important;
  border-radius: 8px !important;
  .css-1aquho2-MuiTabs-indicator {
    background-color: #f6f6f6 !important;
  }
  .css-1h9z7r5-MuiButtonBase-root-MuiTab-root {
    min-height: initial !important;
    height: 40px !important;
  }
  ${breakpoint("xs")`
    
      width: 100% ! important;
      display: flex;
      margin-left: 10px ! important;
      margin-right: 10px ! important;
    `}
  ${breakpoint("sm")`
      position: static;
      width: 300px ! important;
      justify-content: center;
      align-items: center;
      transform: none;
      margin: 10px 0;
      z-index: 0;
    `}
`;
const TabTransfer = styled(Tab)`
  background-color: white !important;
  border-radius: 8px !important;
  margin: 5px !important;

  ${breakpoint("xs")`
      width: calc(50% - 10px) !important;
    `}
  ${breakpoint("sm")`
      width: 140px !important;
    `}
`;

export const NetworkContainerFixed = styled.div`
  background-color: ${props => props.theme.colors.white};
  ${breakpoint("xs")`
      margin-top: 24px;
      padding-top: 10px;
      padding-bottom: 10px;
    `}
  ${breakpoint("sm")`
      position: static;
      width: 100%;
      justify-content: center;
      align-items: center;
      padding: 0;
      transform: none;
      margin: auto
      z-index: 0;
    `}
     ${breakpoint("md")`
        align-items: center;
        float: none;
        margin: auto
        width: max-content;
        margin-left: 44px;
      `}
       ${breakpoint("lg")`
        justify-content: center;
        align-items: center;
        margin-top: 44px;
        width: max-content;
        float: right;
        margin-right: 44px;
        `}
`;
