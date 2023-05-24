import { Grid } from "@mui/material";
import { Page, TitlePage } from "../../styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import base from "../../styles/theme/base";
import { createBreakpoint } from "styled-components-breakpoint";
import Typography from "@mui/material/Typography";
import CustomButton from "../../components/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import CustomInput from "../../components/TextField";
import LoadingButton from "../../components/LoadingButton";
import { NetworkContainer } from "../../components/Network";
import { myListCoin, privateKey } from "../../configs/data/test";
import { Copy, DropdownBlack } from "../../assets/icon";
import QRCode from "react-qr-code";
import { OverviewHeaderTopCoin, TextHeaderOverview } from "../Overview/overview.css";
import FormGroup from "@mui/material/FormGroup";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { sliceAddress, copyAddress } from "../../utils";
import styled from "styled-components";
import Web3 from "web3";
import { sendTransaction, useBlockchain } from "../../blockchain";
// import { TransferNative } from "../../blockchain"

export type FormData = {
  token: string;
  addressTo: string;
  amount: string;
  tokenContract?: string;
};
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { web3, getBalance } = useBlockchain("5");

  const myAdress = "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe";
  const [value, setValue] = useState(0);
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      token: "ETH",
      addressTo: "",
      amount: "",
      tokenContract: "",
    },
  });

  const validateAmount = (value: string) => {
    const parsedValue = Number(value);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      return false;
    }
    return true;
  };
  const onSubmit = React.useCallback(async (values: FormData) => {
    setIsSubmitting(true);
    await sendTransaction(web3 as Web3, values, privateKey);
    setIsSubmitting(false);
    reset();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [token, setToken] = React.useState("ETH");
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
              <TitlePageContainer>
                <TitlePage>Transfer your Ethereum</TitlePage>
              </TitlePageContainer>
              <SubTitlePage>You need to choose the correct network, address and coin to transfer to another wallet address.</SubTitlePage>
            </ContainerTabs>
          </Grid>
          <Grid item xs={100} sm={100} md={100} lg={50} xl={55}>
            <ContainerTabs value={value} index={0}>
              <BackgroundPage>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormGroup>
                    <FormControl fullWidth>
                      <ContainerTextField>
                        <label>
                          Select coin <SpanRed>*</SpanRed>
                        </label>
                        <CustomInput
                          value={token}
                          styleTextField='default'
                          select
                          id='token'
                          size='small'
                          {...register("token", {
                            onChange: e => setToken(e.target.value),
                          })}
                          SelectProps={{
                            IconComponent: () => <DropdownBlack style={{ marginRight: "10px" }} />,
                          }}
                        >
                          {myListCoin.map(coin => (
                            <MenuItem key={coin.symbol} value={coin.symbol}>
                              <SelectCoin>
                                <img width={"20px"} src={coin.img}></img>
                                {coin.name}
                              </SelectCoin>
                            </MenuItem>
                          ))}
                        </CustomInput>
                      </ContainerTextField>
                    </FormControl>
                    <ContainerTextField>
                      <label>
                        Transfer to <SpanRed>*</SpanRed>
                      </label>
                      <Controller
                        render={({ field: { name, value, onChange } }) => (
                          <CustomInput
                            error={!!errors.addressTo}
                            onChange={onChange}
                            name={name}
                            value={value}
                            helperText={errors.addressTo && "Invalid address"}
                            placeholder='Enter address'
                            id='addressTo'
                            size='small'
                            styleTextField='default'
                          />
                        )}
                        control={control}
                        name='addressTo'
                        defaultValue=''
                        rules={{
                          pattern: {
                            value: /^0x[a-fA-F0-9]{40}$/,
                            message: "",
                          },
                          required: { value: true, message: "" },
                        }}
                      />
                    </ContainerTextField>
                    <ContainerTextField>
                      <label>
                        Amount <SpanRed>*</SpanRed>
                      </label>
                      <Controller
                        render={({ field: { name, value, onChange } }) => (
                          <CustomInput
                            error={!!errors.amount}
                            onChange={onChange}
                            name={name}
                            placeholder='Enter amount'
                            id='amount'
                            size='small'
                            value={value}
                            styleTextField='default'
                            helperText={errors.amount && "Invalid value"}
                          />
                        )}
                        control={control}
                        name='amount'
                        defaultValue=''
                        rules={{
                          required: { value: true, message: "" },
                          validate: validateAmount,
                        }}
                      />
                    </ContainerTextField>
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
                      <LoadingButton variant='contained' loadingPosition='end' loading={isSubmitting} type='submit' text='Transfer' styleButton='primary' width='150px' height='50px'></LoadingButton>
                    </ContainerRight>
                  </FormGroup>
                </form>
              </BackgroundPage>
            </ContainerTabs>
          </Grid>
          <Grid item xs={100} sm={100} md={100} lg={50} xl={45}>
            <ContainerTabs value={value} index={0}>
              <BackgroundPage>
                <ReceiveTagHeader>Account balance</ReceiveTagHeader>
                <CopyAddressContainer onClick={() => copyAddress(myAdress)}>
                  {sliceAddress(myAdress)} <Copy />
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
              <TitlePageContainer>
                <TitlePage>Scan QR code</TitlePage>
              </TitlePageContainer>
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
                  <CustomInput size='small' disabled defaultValue={myAdress} variant='outlined' fullWidth margin='normal' styleTextField='disable' />
                </AddressContainer>
              </BackgroundPage>
            </TabPanel>
          </Grid>
          <Grid item xs={100} sm={100} md={100} lg={50} xl={45}>
            <TabPanel value={value} index={1}>
              <ContainerQRCode>
                <BackgroundPageQR>
                  <QRCode value={myAdress}></QRCode>
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
export const SubTitlePage = styled.div`
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

export const BackgroundPage = styled.div`
  background-color: #fafafa;
  padding: 40px;
  border-radius: 8px;
`;

export const SelectCoin = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  img {
    margin-right: 10px;
  }
`;
const ContainerFlexSpace = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;
export const ContainerTabs = styled(TabPanel)`
  .css-ahj2mt-MuiTypography-root {
    width: 100% !important;
    padding: 0 !important;
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
export const TitlePageContainer = styled.div`
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
  .css-1h9z7r5-MuiButtonBase-root-MuiTab-root.Mui-selected {
    background-color: ${props => props.theme.colors.white} !important;
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
export const TabTransfer = styled(Tab)`
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
        align-items: center;
        width: max-content;
        margin-left: 10px;
    `}
     ${breakpoint("md")`
        align-items: center;
        margin: auto
        width: max-content;
        margin-left: 44px;
      `}
       ${breakpoint("lg")`
        justify-content: center;
        align-items: center;
        margin-top: 44px;
        width: max-content;
        margin-right: 44px;
        float: right;
        `}
`;

export const SpanRed = styled.span`
  color: #cf2d2d;
`;
export const ContainerTextField = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: left;
`;

// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 4,
//   display: "flex",
//   justifyContent: "center",
//   flexDirection: "column",
//   textAlign: "center",
//   alignItems: "center",
//   width: 600,
// };
