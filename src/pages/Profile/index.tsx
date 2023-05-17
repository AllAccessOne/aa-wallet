import { Page, TitlePageBlack, TitlePage } from "../../styles";
import styled from "styled-components";
import { Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import CustomInput from "../../components/TextField";
import CustomButton from "../../components/Button";
import { Copy } from "../../assets/icon";
import { TextHeaderCard } from "../MultipleFactors";
import { OverviewHeaderTopCoin, TextHeaderOverview } from "../Overview/overview.css";
import Typography from "@mui/material/Typography";
import base from "../../styles/theme/base";
import { createBreakpoint } from "styled-components-breakpoint";
import { Devices } from "../../configs/data/test";
import { Computer, Trash } from "../../assets/icon";
import { ConatainerDevice, GroupLeftItemDevice, ContainerText, NameText, IpText, IdText } from "../MultipleFactors";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { TabsCustom, TabTransfer, ContainerTabs, SubTitlePage, CopyAddressContainer, ContainerTextField, SpanRed } from "../Transaction";
import React from "react";
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
type Device = {
  name: string;
  ip: string;
};
const Profile = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const myAdress = "0x15375...b080f";
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  const handleDelete = (name: string, ip: string) => {
    setDevice({
      name: name,
      ip: ip,
    });
    handleOpen();
  };
  const handleClose = () => setOpen(false);
  const [device, setDevice] = React.useState<Device>({
    name: "",
    ip: "",
  });
  return (
    <Page>
      <OverviewHeaderTopCoin>
        <TabsCustom value={value} onChange={handleChange} aria-label='basic tabs example'>
          <TabTransfer label='Profile' {...a11yProps(0)} />
          <TabTransfer label='MFA Setting' {...a11yProps(1)} />
        </TabsCustom>
      </OverviewHeaderTopCoin>
      <Grid>
        <ContainerTabs value={value} index={0}>
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
                      <Avatar alt='Remy Sharp' src='https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien.jpg' sx={{ width: 200, height: 200 }} />
                      <CustomButton mTop='20px' mBottom='20px' text='Change avatar' styleButton='primary'></CustomButton>
                      <CopyAddressContainer>
                        {myAdress} <Copy />
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
        </ContainerTabs>
      </Grid>
      <ContainerTabs value={value} index={1}>
        <Grid container columns={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100 }}>
          <Grid item xs={100}>
            <TitlePageContainer>
              <TitlePageBlack>MFA Setting</TitlePageBlack>
              <SubTitlePage>You can manage your security and view your devices here</SubTitlePage>
            </TitlePageContainer>
          </Grid>
          <Grid item xs={100} sm={100} md={100} lg={50} xl={55}>
            <BackgroundPage>
              <ContainerHeaderFactors>
                <TextHeaderCard>Security factors</TextHeaderCard>
                <ContainerNumberFactors>2/3</ContainerNumberFactors>
              </ContainerHeaderFactors>
              <SubTitlePage>The number of factors to authenticate in order to access your account.</SubTitlePage>
              <ContainerTextField>
                <label>
                  Recovery email <SpanRed>*</SpanRed>
                </label>
                <CustomInput size='small' fullWidth value={"kiettran@lecle.co.kr"} styleTextField='default' disabled></CustomInput>
              </ContainerTextField>
              <ContainerButtonFactors>
                <CustomButton height='48px' width='100px' mTop='50px' mBottom='20px' mRight='20px' text='Cancel' styleButton='inactive'></CustomButton>
                <CustomButton height='48px' width='100px' mTop='50px' mBottom='20px' text='Confirm' styleButton='primary'></CustomButton>
              </ContainerButtonFactors>
            </BackgroundPage>
          </Grid>
          <Grid item xs={100} sm={100} md={100} lg={50} xl={45}>
            <ListDeviecsContainer>
              <BackgroundPage>
                <TextHeaderCard>List devices</TextHeaderCard>
                {Devices.map(device => (
                  <ConatainerDevice>
                    <GroupLeftItemDevice>
                      <Computer />
                      <ContainerText>
                        <NameText> {device.name}</NameText>
                        <IpText>IP: {device.ip}</IpText>
                      </ContainerText>
                    </GroupLeftItemDevice>
                    <Tooltip title='Delete' placement='top-start'>
                      <IconButton
                        onClick={() => {
                          handleDelete(device.name, device.ip);
                        }}
                      >
                        <Trash />
                      </IconButton>
                    </Tooltip>
                  </ConatainerDevice>
                ))}
              </BackgroundPage>
            </ListDeviecsContainer>
          </Grid>
        </Grid>
        <Modal open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
          <Box sx={style}>
            <TitlePage>Delete devices</TitlePage>
            <SubTitlePage>This device will be erased and automatically logged out, are you sure?</SubTitlePage>
            <ContainerDeviceModal>
              <ConatainerDevice>
                <GroupLeftItemDevice>
                  <Computer />
                  <ContainerText>
                    <NameText>{device.name}</NameText>
                    <IpText>IP: {device.ip}</IpText>
                  </ContainerText>
                </GroupLeftItemDevice>
              </ConatainerDevice>
            </ContainerDeviceModal>
            <ContainerButtonFactors>
              <CustomButton onClick={handleClose} height='48px' width='150px' mTop='50px' mBottom='20px' mRight='20px' text='Back' styleButton='inactive'></CustomButton>
              <CustomButton height='48px' width='150px' mTop='50px' mBottom='20px' text="Yes, I'm sure" styleButton='primary'></CustomButton>
            </ContainerButtonFactors>
          </Box>
        </Modal>
      </ContainerTabs>
    </Page>
  );
};

export default Profile;

const ContainerDeviceModal = styled.div`
  width: 100%;
`;
const ListDeviecsContainer = styled.div`
  ${breakpoint("xs")`
    margin-left: 10px;
`}
  ${breakpoint("lg")`
    margin-left: 44px;
  `}
`;
const TitlePageContainer = styled.div`
  margin-top: 20px;
  ${breakpoint("xs")`
    display: none;
`}
  ${breakpoint("lg")`
    display: block;
  `}
`;
const ContainerButtonFactors = styled.div`
  width: max-content;
  float: right;
`;
const ContainerAvatar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ContainerInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${breakpoint("xs")`
    margin-left: 0;
`}
  ${breakpoint("md")`
    margin-left: 50px;
  `}
`;

const ContainerHeaderFactors = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ContainerNumberFactors = styled.div`
  padding: 12px 28px;
  gap: 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  background-color: #f0f0f1;
`;

export const BackgroundPage = styled.div`
  background-color: #fafafa;
  padding: 40px;
  border-radius: 8px;
  min-height: 40vh;
`;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  textAlign: "center",
  alignItems: "center",
};
