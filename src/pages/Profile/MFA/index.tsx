import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { useSessionStorage } from "usehooks-ts";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Grid } from "@mui/material";
import Chip from "@mui/material/Chip";

import { useCustomSnackBar, useFetchWallet, usePushNotifications } from "@app/hooks";
import { KeyPair } from "@app/wallet/types";
import { Computer, Trash } from "@app/assets/icon";
import { TitlePageBlack, TitlePage } from "@app/styles";
import { InfoMasterKey, ShareInfo } from "@app/wallet/metadata";
import { Button as CustomButton } from "@app/components";

import { BackgroundPage, TitlePageContainer } from "../profile.css";
import { SubTitlePage } from "../../Transaction/transaction.css";
import { TextHeaderCard, ContainerDevice, GroupLeftItemDevice, ContainerText, NameText, IpText, TextSummary } from "../../MultipleFactors/multipleFactors.css";
import { ContainerDeviceModal, ListDevicesContainer, ContainerButtonFactors, ContainerHeaderFactors, style, EnableMFAContainer } from "./mfa.css";
import ModalEnableOrResendMFA from "./components/ModalEnableOrResendMFA";
import { generateWords } from "@app/utils";

const MFA = () => {
  const { token } = usePushNotifications();
  const { handleNotification } = useCustomSnackBar();
  const { getInfoWalletByNetworkKey, enableMFA, changeRecoveryEmail, removeDeviceShare, insertTokenFCM } = useFetchWallet();
  const [infoMasterKey, _] = useSessionStorage<InfoMasterKey | null>("info-master-key", null);
  const [networkKey, __] = useSessionStorage<KeyPair | null>("network-key", null);
  const [deviceKey, ___] = useSessionStorage<KeyPair | null>("device-key", null);
  const [deleteDevice, setDeleteDevice] = useState<ShareInfo>();
  const [deviceShares, setDeviceShares] = useState<ShareInfo[]>([]);
  // const [recoveryEmail, setRecoveryEmail] = useState<string>("");
  const [loadingRecovery, setLoadingRecovery] = useState(false);
  const [loadingDeleteDevice, setLoadingDeleteDevice] = useState(false);

  const [seeds, setSeeds] = useState(generateWords());
  const [isOpenEnableMFA, setIsOpenEnableMFA] = useState(false);

  useEffect(() => {
    if (networkKey) {
      getInfoWalletByNetworkKey(networkKey!);
    }
  }, []);

  useEffect(() => {
    if (infoMasterKey) {
      const devices = infoMasterKey.shares?.filter(elm => elm.type === "device");
      setDeviceShares(devices || []);
      // const recoveryShare = infoMasterKey.shares?.find(elm => elm.type === "recovery-phrase");
      // setRecoveryEmail(recoveryShare?.email || "");
    }
  }, [infoMasterKey]);
  const handleOpen = (device: ShareInfo) => setDeleteDevice(device);
  const handleClose = () => setDeleteDevice(undefined);

  const reGenerateSeeds = () => {
    setSeeds(generateWords());
  };

  const isCurrentDevice = (deviceShare: ShareInfo) => {
    if (isEmpty(deviceKey)) return false;
    return deviceShare?.publicKey === deviceKey?.pubKey;
  };

  const changeRecoveryPhrase = async () => {
    if (!infoMasterKey?.verifierId) {
      handleNotification("Something went wrong with your email", "error");
      return;
    }
    if (!infoMasterKey) {
      handleNotification("Please initial master key before", "error");
      return;
    }
    setLoadingRecovery(true);
    const { mfa } = infoMasterKey;
    if (!mfa) {
      const { error } = await enableMFA(infoMasterKey.verifierId, seeds);
      if (error) {
        setLoadingRecovery(false);
        handleNotification(error, "error");
        return;
      }
      setLoadingRecovery(false);
      handleNotification("Please check your email to get new phrase", "success");
      getInfoWalletByNetworkKey(networkKey!);
      insertTokenFCM(token, infoMasterKey);
      setIsOpenEnableMFA(false);
      reGenerateSeeds();
      return;
    }
    // pss shares
    if (mfa) {
      const { error } = await changeRecoveryEmail(infoMasterKey.verifierId, seeds.trim());
      if (error) {
        setLoadingRecovery(false);
        handleNotification(error, "error");
        return;
      }
      setLoadingRecovery(false);
      handleNotification("Please check your email to get new phrase", "success");
      getInfoWalletByNetworkKey(networkKey!);
      setIsOpenEnableMFA(false);
      reGenerateSeeds();
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
    setLoadingDeleteDevice(true);
    const { error } = await removeDeviceShare(deleteDevice.publicKey);
    if (error) {
      setLoadingDeleteDevice(false);
      handleNotification(error, "error");
      return;
    }
    setLoadingDeleteDevice(false);
    handleNotification("Deleted device successfully", "success");
    setDeleteDevice(undefined);
    getInfoWalletByNetworkKey(networkKey!);
  };

  const totalDeviceShares = () => {
    return infoMasterKey?.shares?.filter(elm => elm.type === "device").length;
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
        {!infoMasterKey?.mfa && (
          <Grid item xs={100} sm={100} md={100} lg={100} xl={100}>
            <EnableMFAContainer>
              <Grid className='title' item>
                <TextHeaderCard>Two-factor authentication (MFA)</TextHeaderCard>
                <SubTitlePage>We strongly recommend you to enable 2FA on your account</SubTitlePage>
              </Grid>
              <CustomButton className='btn' variant='contained' styleButton='primary' text='Enable 2FA' onClick={() => setIsOpenEnableMFA(true)} />
            </EnableMFAContainer>
          </Grid>
        )}
        {infoMasterKey?.mfa && (
          <>
            <Grid item xs={100} sm={100} md={100} lg={50} xl={55}>
              <BackgroundPage>
                <ContainerHeaderFactors>
                  <TextHeaderCard>Recovery phrase</TextHeaderCard>
                  <TextSummary>Please ensure you stored your recovery key in safe place...</TextSummary>
                  {/* <ContainerNumberFactors>{`2/${infoMasterKey?.shares?.length}`}</ContainerNumberFactors> */}
                </ContainerHeaderFactors>
                {/* <ContainerTextField>
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
                </ContainerTextField> */}
                <ContainerButtonFactors>
                  <CustomButton
                    variant='contained'
                    height='48px'
                    width='100px'
                    mTop='50px'
                    mBottom='20px'
                    text={loadingRecovery ? "" : "Resend"}
                    styleButton={loadingRecovery ? "inactive" : "primary"}
                    loading={loadingRecovery}
                    onClick={() => {
                      setIsOpenEnableMFA(true);
                    }}
                  ></CustomButton>
                </ContainerButtonFactors>
              </BackgroundPage>
            </Grid>
            <Grid item xs={100} sm={100} md={100} lg={50} xl={45}>
              <ListDevicesContainer>
                <BackgroundPage style={{ maxHeight: "500px", overflow: "auto" }}>
                  <TextHeaderCard>
                    List devices <Chip label={`${totalDeviceShares()} keys`} color='primary' />{" "}
                  </TextHeaderCard>
                  <TextSummary>Security keys are hardware devices that can be used as your second factor of authentication.</TextSummary>
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
          </>
        )}
      </Grid>
      <ModalEnableOrResendMFA
        email={infoMasterKey?.verifierId || ""}
        isOpen={isOpenEnableMFA}
        handleClose={() => {
          setIsOpenEnableMFA(false);
        }}
        seeds={seeds}
        loadingEnableMFA={loadingRecovery}
        handleEnableMFA={changeRecoveryPhrase}
      />
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
            <CustomButton
              text={loadingDeleteDevice ? "" : "Yes, I'm sure"}
              styleButton={loadingDeleteDevice ? "inactive" : "primary"}
              loading={loadingDeleteDevice}
              onClick={handleDelete}
              height='48px'
              width='150px'
              mTop='50px'
              mBottom='20px'
            ></CustomButton>
          </ContainerButtonFactors>
        </Box>
      </Modal>
    </>
  );
};
export default MFA;
