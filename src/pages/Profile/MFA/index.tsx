import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { useSessionStorage } from "usehooks-ts";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Grid } from "@mui/material";

import { useCustomSnackBar, useFetchWallet } from "@app/hooks";
import { KeyPair } from "@app/wallet/types";
import { Computer, Trash } from "@app/assets/icon";
import { TitlePageBlack, TitlePage } from "@app/styles";
import { InfoMasterKey, ShareInfo } from "@app/wallet/metadata";
import { Button as CustomButton, TextField as CustomInput } from "@app/components";

import { BackgroundPage, TitlePageContainer } from "../profile.css";
import { SubTitlePage, ContainerTextField, SpanRed } from "../../Transaction/transaction.css";
import { TextHeaderCard, ContainerDevice, GroupLeftItemDevice, ContainerText, NameText, IpText } from "../../MultipleFactors/multipleFactors.css";
import { ContainerDeviceModal, ListDevicesContainer, ContainerButtonFactors, ContainerNumberFactors, ContainerHeaderFactors, style } from "./mfa.css";

const MFA = () => {
  const { handleNotification } = useCustomSnackBar();
  const { getInfoWalletByNetworkKey, enableMFA, changeRecoveryEmail, removeDeviceShare } = useFetchWallet();
  const [infoMasterKey, _] = useSessionStorage<InfoMasterKey | null>("info-master-key", null);
  const [networkKey, __] = useSessionStorage<KeyPair | null>("network-key", null);
  const [deviceKey, ___] = useSessionStorage<KeyPair | null>("device-key", null);
  const [deleteDevice, setDeleteDevice] = useState<ShareInfo>();
  const [deviceShares, setDeviceShares] = useState<ShareInfo[]>([]);
  const [recoveryEmail, setRecoveryEmail] = useState<string>("");

  useEffect(() => {
    if (networkKey) {
      getInfoWalletByNetworkKey(networkKey!);
    }
  }, []);

  useEffect(() => {
    if (infoMasterKey) {
      const devices = infoMasterKey.shares?.filter(elm => elm.type === "device");
      setDeviceShares(devices || []);
      const recoveryShare = infoMasterKey.shares?.find(elm => elm.type === "recovery-phrase");
      setRecoveryEmail(recoveryShare?.email || "");
    }
  }, [infoMasterKey]);
  const handleOpen = (device: ShareInfo) => setDeleteDevice(device);
  const handleClose = () => setDeleteDevice(undefined);

  const isCurrentDevice = (deviceShare: ShareInfo) => {
    if (isEmpty(deviceKey)) return false;
    return deviceShare?.publicKey === deviceKey?.pubKey;
  };

  const changeRecoveryPhrase = async () => {
    if (!recoveryEmail) {
      handleNotification("Please input email valid", "error");
      return;
    }
    if (!infoMasterKey) {
      handleNotification("Please initial master key before", "error");
      return;
    }
    const { mfa } = infoMasterKey;
    if (!mfa) {
      const { error } = await enableMFA(recoveryEmail);
      if (error) {
        handleNotification(error, "error");
        return;
      }
      handleNotification("Please check your email to get new phrase", "success");
      getInfoWalletByNetworkKey(networkKey!);
      return;
    }
    // pss shares
    if (mfa) {
      const { error } = await changeRecoveryEmail(recoveryEmail);
      if (error) {
        handleNotification(error, "error");
        return;
      }
      handleNotification("Please check your email to get new phrase", "success");
      getInfoWalletByNetworkKey(networkKey!);
    }
    return;
  };

  const handleDelete = async () => {
    if (isEmpty(deleteDevice)) {
      handleNotification("Please select device", "error");
      return;
    }
    if (isCurrentDevice(deleteDevice)) {
      handleNotification("Please select other device, you can't delete current device", "error");
      return;
    }
    const { error } = await removeDeviceShare(deleteDevice.publicKey);
    if (error) {
      handleNotification(error, "error");
      return;
    }
    handleNotification("Deleted device successfully", "success");
    setDeleteDevice(undefined);
    getInfoWalletByNetworkKey(networkKey!);
  };

  return (
    <>
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
              <ContainerNumberFactors>{`2/${infoMasterKey?.shares?.length}`}</ContainerNumberFactors>
            </ContainerHeaderFactors>
            <SubTitlePage>The number of factors to authenticate in order to access your account.</SubTitlePage>
            <ContainerTextField>
              <label>
                Recovery email <SpanRed>*</SpanRed>
              </label>
              <CustomInput
                size='small'
                type='email'
                fullWidth
                value={recoveryEmail}
                styleTextField='default'
                onChange={e => {
                  setRecoveryEmail(e.target.value);
                }}
              ></CustomInput>
            </ContainerTextField>
            <ContainerButtonFactors>
              <CustomButton height='48px' width='100px' mTop='50px' mBottom='20px' mRight='20px' text='Cancel' styleButton='inactive'></CustomButton>
              <CustomButton height='48px' width='100px' mTop='50px' mBottom='20px' text='Confirm' styleButton='primary' onClick={changeRecoveryPhrase}></CustomButton>
            </ContainerButtonFactors>
          </BackgroundPage>
        </Grid>
        <Grid item xs={100} sm={100} md={100} lg={50} xl={45}>
          <ListDevicesContainer>
            <BackgroundPage>
              <TextHeaderCard>List devices</TextHeaderCard>
              {deviceShares.map(device => (
                <ContainerDevice key={device.publicKey}>
                  <GroupLeftItemDevice>
                    <Computer />
                    <ContainerText>
                      <NameText> {`${device.deviceInfo?.name} ${device.deviceInfo?.version} ${isCurrentDevice(device!) ? "(Current)" : ""}`}</NameText>
                      <IpText>IP: {device.deviceInfo?.ipv4}</IpText>
                    </ContainerText>
                  </GroupLeftItemDevice>
                  <Tooltip title='Delete' placement='top-start'>
                    <IconButton onClick={() => handleOpen(device)}>
                      <Trash />
                    </IconButton>
                  </Tooltip>
                </ContainerDevice>
              ))}
            </BackgroundPage>
          </ListDevicesContainer>
        </Grid>
      </Grid>
      <Modal open={!isEmpty(deleteDevice)} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box sx={style}>
          <TitlePage>Delete devices</TitlePage>
          <SubTitlePage>This device will be erased and automatically logged out, are you sure?</SubTitlePage>
          <ContainerDeviceModal>
            <ContainerDevice>
              <GroupLeftItemDevice>
                <Computer />
                <ContainerText>
                  <NameText>{`${deleteDevice?.deviceInfo?.os} ${deleteDevice?.deviceInfo?.version} ${isCurrentDevice(deleteDevice!) ? "(Current)" : ""}`}</NameText>
                  <IpText>IP: {deleteDevice?.deviceInfo?.ipv4}</IpText>
                </ContainerText>
              </GroupLeftItemDevice>
            </ContainerDevice>
          </ContainerDeviceModal>
          <ContainerButtonFactors>
            <CustomButton onClick={handleClose} height='48px' width='150px' mTop='50px' mBottom='20px' mRight='20px' text='Back' styleButton='inactive'></CustomButton>
            <CustomButton onClick={handleDelete} height='48px' width='150px' mTop='50px' mBottom='20px' text="Yes, I'm sure" styleButton='primary'></CustomButton>
          </ContainerButtonFactors>
        </Box>
      </Modal>
    </>
  );
};
export default MFA;
