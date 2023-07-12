import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { TitlePage } from "@app/styles";
import { Button as CustomButton } from "@app/components";
import { SubTitlePage, ContainerDeviceModal, ContainerButtonFactors, FlexContainer, style } from "./css";
import useBlockchain from "@app/blockchain/wrapper";
import { useAppSelector } from "@app/store";
import { sliceAddress, copyAddress } from "@app/utils";
import { Arrow } from "@app/assets/icon";
import { InfoTransactions } from "./InfoTransactions";

type Props = {
  title?: string;
  subTitle?: string;
  info: InfoTransactions | null;
  loading: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
};
const SignTransactionModal: React.FC<Props> = props => {
  const networkState = useAppSelector(state => state.network);
  const [_, setStatus] = useState(false);
  const { loading, info, handleClose, handleConfirm, title, subTitle } = props;
  const { getAccount, getGasPrice } = useBlockchain();
  const [gasFee, setGasFee] = useState("0");
  useEffect(() => {
    const fetchGas = async () => {
      const gasPrice = await getGasPrice();
      setGasFee(gasPrice);
    };
    fetchGas();
  }, [getAccount()]);
  return (
    <Modal open={info ? true : false} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={style}>
        <TitlePage>{title}</TitlePage>
        <SubTitlePage>
          {subTitle + " "} <b>{info?.origin}</b>
        </SubTitlePage>
        <ContainerDeviceModal>
          <FlexContainer>
            <CustomButton
              onClick={() =>
                copyAddress(getAccount(), () => {
                  setStatus(true);
                  setTimeout(() => {
                    setStatus(false);
                  }, 3000);
                })
              }
              style={{ borderRadius: "8px" }}
              variant='outlined'
              text={sliceAddress(getAccount())}
              styleButton='default'
            />
            <Arrow style={{ margin: "10px 20px" }} />
            <CustomButton
              onClick={() =>
                copyAddress(info?.addressTo ? info?.addressTo : "Error", () => {
                  setStatus(true);
                  setTimeout(() => {
                    setStatus(false);
                  }, 3000);
                })
              }
              style={{ borderRadius: "8px" }}
              variant='outlined'
              text={sliceAddress(info?.addressTo ? info?.addressTo : "Error")}
              styleButton='default'
            />
          </FlexContainer>
          <FlexContainer style={{ marginTop: "20px" }}>
            <div>Amount:</div>
            <div>{info?.amount + " " + info?.symbol}</div>
          </FlexContainer>
          {info?.contractTo ? (
            <FlexContainer>
              <div>Contract:</div>
              <div>{sliceAddress(info.contractTo)}</div>
            </FlexContainer>
          ) : null}
          <FlexContainer>
            <div>Gas Fee:</div>
            <div>{gasFee + " " + networkState.currentNetwork.data.title}</div>
          </FlexContainer>
        </ContainerDeviceModal>
        <ContainerButtonFactors>
          <CustomButton onClick={handleClose} height='48px' width='150px' mTop='50px' mBottom='20px' mRight='20px' text='Reject' styleButton='inactive'></CustomButton>
          <CustomButton loading={loading} onClick={handleConfirm} height='48px' width='150px' mTop='50px' mBottom='20px' text='Confirm' styleButton='primary'></CustomButton>
        </ContainerButtonFactors>
      </Box>
    </Modal>
  );
};
export default SignTransactionModal;
