import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { sendTransaction, sendTransactionToken, useBlockchain, getGasPrice, getGasLimit } from "../../blockchain";
import { listNetWorks } from "../../configs/data";

import { TitlePage } from "../../styles";
import Web3 from "web3";
import CustomButton from "../../components/Button";
import { FormData } from "../Transaction/Transfer/type";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { style, TransferSuccessTitle, TransferSuccessSub, BackgroundPage, CopyAddressContainer, ContainerIconSuccess, ContainerTwoButtonModal } from "../Transaction/Transfer/transfer.css";
import { sliceAddress, copyAddress } from "../../utils";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { ModalCustom, HeaderModalInfoTransaction } from "../../components/Table/table.css";
import { Success, Copy } from "../../assets/icon";

const steps = ["Start", "Pending", "Success"];
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
type Params = {
  to: string;
  value: string;
  data?: string;
  contract?: string;
  method?: string;
  typeGas?: string;
};
const SignTransaction = () => {
  // const myAddress = getTorusKey().ethAddress;
  const [gasPrice, setGasPrice] = useState<string | 0>("0");
  const [gasLimit, setGasLimit] = useState<string | 0>("0");
  const [open, setOpen] = useState(false);
  const { transactionId } = useParams();
  const transactionParams: Params = transactionId ? JSON.parse(transactionId as string) : null;
  const { web3 } = useBlockchain();
  useEffect(() => {
    const updateGasLimit = async () => {
      const gasLimitValue = await getGasLimit(web3 as Web3, transactionParams.to, transactionParams.value, transactionParams?.contract);
      setGasLimit(gasLimitValue);
    };

    updateGasLimit();
  }, []);

  useEffect(() => {
    const updateGasPrice = async () => {
      const gasPriceValue = await getGasPrice(web3 as Web3);
      setGasPrice(gasPriceValue);
    };
    updateGasPrice();
  }, []);
  const onSubmit = async (transactionParams: Params) => {
    handleReset();
    setOpen(true);
    const values: FormData = {
      addressTo: transactionParams.to,
      amount: transactionParams.value,
    };
    transactionParams?.contract
      ? await sendTransactionToken(web3 as Web3, values, transactionParams.contract, setTransactionHash, setInfoTransaction)
      : await sendTransaction(web3 as Web3, values, setTransactionHash, setInfoTransaction);
    setTimeout(() => {
      window.close();
    }, 5000);
  };
  const [openAlert, setOpenAlert] = useState(false);

  const handleCloseAlert = () => setOpenAlert(false);

  //
  const [infoTransaction, setInfoTransaction] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});


  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };


  const handleReset = () => {
    setActiveStep(1);
    setCompleted({ 0: true });
  };
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (infoTransaction === "Error") {
      handleClose();
      setOpenAlert(true);
      setTimeout(() => {
        window.close();
      }, 2000);
    }
  }, [infoTransaction]);
  return (
    <>
      <BackgroundPage>
        <TitlePage style={{ margin: "10px 0" }}>Transaction Info</TitlePage>
        {transactionParams && (
          <div>
            <strong>To:</strong> {transactionParams.to}
          </div>
        )}
        {transactionParams && transactionParams.value && (
          <div>
            <strong>Value:</strong> {transactionParams.value}
          </div>
        )}
        {transactionParams && transactionParams.data && (
          <div>
            <strong>Data:</strong> {transactionParams.data}
          </div>
        )}
        {transactionParams && transactionParams.contract && (
          <div>
            <strong>Contract:</strong> {transactionParams.contract}
          </div>
        )}
        {transactionParams && transactionParams.method && (
          <div>
            <strong>Method:</strong> {transactionParams.method}
          </div>
        )}

        <div>
          {" "}
          <strong> Gas price :</strong> {gasPrice} {transactionParams.typeGas}
        </div>
        <div>
          <strong> Gas limit:</strong> {gasLimit} {transactionParams.typeGas}
        </div>
        <CustomButton onClick={() => onSubmit(transactionParams)} mTop='20px' variant='contained' text='Transfer' styleButton='primary' fullWidth height='40px'></CustomButton>
      </BackgroundPage>
      <ModalCustom open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box sx={style} width={300}>
          <Stepper style={{ width: "100%" }} nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton color='inherit' onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>

          {infoTransaction === "success" ? (
            <>
              <HeaderModalInfoTransaction style={{ marginTop: "20px" }}>
                <ContainerIconSuccess>
                  <Success />
                </ContainerIconSuccess>
              </HeaderModalInfoTransaction>
              <TransferSuccessTitle>Transfer successfully</TransferSuccessTitle>
              <TransferSuccessSub>You are done the transaction successfully. You can now review your transaction in your history</TransferSuccessSub>

              <ContainerTwoButtonModal>
                <CustomButton onClick={() => handleClose()} width='230px' height='44px' styleButton='inactive' text='View transfer history'></CustomButton>
                <CustomButton onClick={() => handleClose()} width='135px' height='44px' styleButton='primary' text='Ok, I got it'></CustomButton>
              </ContainerTwoButtonModal>
            </>
          ) : infoTransaction === "pending" ? (
            <>
              <HeaderModalInfoTransaction>
                <ContainerIconSuccess>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress style={{ margin: "40px 0" }} />
                  </Box>
                </ContainerIconSuccess>
              </HeaderModalInfoTransaction>
              <TransferSuccessTitle style={{ marginBottom: "40px" }}>Transfer pending</TransferSuccessTitle>
              {transactionHash ? (
                <CopyAddressContainer onClick={() => copyAddress(transactionHash)}>
                  {"Transaction hash: " + sliceAddress(transactionHash)} <Copy />
                </CopyAddressContainer>
              ) : null}
            </>
          ) : null}
        </Box>
      </ModalCustom>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity='error' sx={{ width: "100%", borderRadius: "8px" }}>
          Transaction failure!
        </Alert>
      </Snackbar>
    </>
  );
};
export default SignTransaction;
