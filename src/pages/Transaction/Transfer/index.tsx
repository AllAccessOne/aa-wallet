import { CircularProgress, Grid, Step, StepButton, Stepper } from "@mui/material";
import { TitlePage } from "../../../styles";
import CustomButton from "../../../components/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import CustomInput from "../../../components/TextField";
import { Copy, DropdownBlack, Success, SearchIcon } from "../../../assets/icon";
import { TextHeaderOverview } from "../../Overview/overview.css";
import FormGroup from "@mui/material/FormGroup";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { sliceAddress, copyAddress } from "../../../utils";
import { setCurrentListTokens } from "../../../store/redux/token/actions";
import Web3 from "web3";
import { sendTransaction, getBalanceToken, useBlockchain, getBalance, getToken, getGasLimit } from "../../../blockchain";
import { useAppDispatch, useAppSelector } from "../../../store";
import { ModalCustom, HeaderModalInfoTransaction, TitleModal } from "../../../components/Table/table.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { sendTransactionToken, getGasPrice } from "../../../blockchain";
import { Token } from "../../../types/blockchain.type";
import { listNetWorks } from "../../../configs/data";
import { FormData } from "./type";
import { SignTransactionModal } from "@app/components";
import {
  style,
  CustomMenuItem,
  ContainerBalanceCard,
  TransferSuccessTitle,
  TransferSuccessSub,
  ReceiveTagHeader,
  SubTitlePage,
  BackgroundPage,
  ContainerFlexSpace,
  ContainerRight,
  CopyAddressContainer,
  BalanceNumberCard,
  TitlePageContainer,
  SpanRed,
  ContainerTextField,
  ContainerIconSuccess,
  ContainerTwoButtonModal,
} from "./transfer.css";
const steps = ["Start", "Pending", "Success"];
import DoneIcon from "@mui/icons-material/Done";
import { InfoTransacions } from "@app/components/Modal/SignTransactionModal";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const Transfer = () => {
  const networkState = useAppSelector(state => state.network);
  const listTokenState = useAppSelector(state => state.token);
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState(false);
  const [statusTransactionHash, setStatusTransactionHash] = useState(false);
  const { web3, account: myAddress } = useBlockchain();
  const [openAlert, setOpenAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenImport, setTokenImport] = useState<Token>();
  const [balance, setBalance] = useState("");
  const [isDesktop, setIsDesktop] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [token, setToken] = useState(listTokenState.currentListTokens.data.find(token => token.chainID === networkState.currentNetwork.data.chainID));
  const [openSelect, setOpenSelect] = useState(false);
  const [gasPrice, setGasPrice] = useState<string | 0>("0");
  const [gasLimit, setGasLimit] = useState<string | 0>("0");
  const [reRenderGas, setRenderGasLimit] = useState<string>("0");
  const [amount, setAmount] = useState("0");
  const [transactionError, setTransactionError] = useState("");
  //Modal Transactions d-app
  const [transactionInfoCookies, setTransactionInfoCookies] = useState<InfoTransacions | null>(null);
  // Transactions d-app

  const handleGetInfo = () => {
    const handlePopupResponse = (event: any) => {
      if (event.data.type === "SIGN_REQ") {
        const data = event.data.data;
        setTransactionInfoCookies(data);
      }
    };

    window.addEventListener("message", handlePopupResponse);
  };
  const handleComfirmRequest = () => {
    const handlePopupResponse = (event: any) => {
      window.addEventListener("beforeunload", () => {
        event.source.postMessage(
          {
            type: "STATUS",
            data: "0x123123231332132",
          },
          event.origin
        );
      });
      window.close();
    };
    window.addEventListener("message", handlePopupResponse);
  };
  const handleReject = () => {
    const handleReject = (event: any) => {
      window.addEventListener("beforeunload", () => {
        event.source.postMessage({ type: "STATUS", data: null }, event.origin);
      });
      setTransactionInfoCookies(null);
      window.close();
    };
    window.addEventListener("message", handleReject);
  };

  useEffect(() => {
    try {
      handleGetInfo();
    } catch {
      console.log("Failed to get transaction");
    }
  });

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseSelect = () => {
    setOpenSelect(false);
    setSearchText("");
  };
  const handleCloseAlert = () => setOpenAlert(false);
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      addressTo: "",
      amount: "",
    },
  });
  const validateAmount = (value: string) => {
    const parsedValue = Number(value);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      return false;
    }
    return true;
  };
  useEffect(() => {
    const updateGasLimit = async () => {
      const addressTo = getValues("addressTo");
      const gasLimitValue = await getGasLimit(web3 as Web3, addressTo, amount, token?.tokenContract);
      setGasLimit(gasLimitValue);
    };

    updateGasLimit();
  }, [reRenderGas, token?.symbol, networkState.currentNetwork.data, web3, amount]);
  useEffect(() => {
    const updateGasPrice = async () => {
      const gasPriceValue = await getGasPrice(web3 as Web3);
      setGasPrice(gasPriceValue);
    };
    updateGasPrice();
  }, [networkState.currentNetwork.data, web3, amount]);

  const onSubmit = async (values: FormData) => {
    handleReset();
    setTransactionHash("");
    setOpen(true);
    token?.tokenContract
      ? await sendTransactionToken(web3 as Web3, values, token.tokenContract, setTransactionHash, setInfoTransaction, setTransactionError)
      : await sendTransaction(web3 as Web3, values, setTransactionHash, setInfoTransaction, setTransactionError);
    reset();
  };
  const handleSubmitModal = async () => {
    handleReset();
    setTransactionHash("");
    const values: FormData = {
      addressTo: transactionInfoCookies?.addressTo as string,
      amount: transactionInfoCookies?.amount as string,
    };
    setOpen(true);
    transactionInfoCookies?.contractTo
      ? await sendTransactionToken(web3 as Web3, values, transactionInfoCookies?.contractTo, setTransactionHash, setInfoTransaction, setTransactionError)
      : await sendTransaction(web3 as Web3, values, setTransactionHash, setInfoTransaction, setTransactionError);
  };
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

  const handleGetInfoToken = async () => {
    try {
      const currentNetwork = listNetWorks.find(networks => networks.chainID === networkState.currentNetwork.data.chainID);
      const addToken = await getToken(web3 as Web3, tokenAddress, currentNetwork?.rpcUrls as string);
      const check = listTokenState.currentListTokens.data.filter(token => token.tokenContract === tokenAddress).length;
      if (!check) {
        setTokenImport(addToken);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleAddToken = () => {
    const check = listTokenState.currentListTokens.data.filter(token => token.tokenContract === tokenAddress).length;
    if (tokenImport && !check) {
      dispatch(setCurrentListTokens(tokenImport));
    }
  };
  useEffect(() => {
    handleGetInfoToken();
  }, [searchText]);
  useEffect(() => {
    try {
      setToken(listTokenState.currentListTokens.data.find(e => e.chainID === networkState.currentNetwork.data.chainID));
    } catch (e) {
      console.log(e);
    }
  }, [networkState.currentNetwork.data]);

  const handleChangeSearch = (e: string) => {
    setSearchText(e);
    setTokenAddress(e);
  };
  //Modal transfer
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
  useEffect(() => {
    if (infoTransaction === "Error") {
      handleClose();
      setOpenAlert(true);
      if (transactionInfoCookies) {
        setTransactionInfoCookies(null);
        setTimeout(() => window.close(), 3000);
      }
    }
    if (infoTransaction === "success") {
      setActiveStep(2);
      setCompleted({ 0: true, 1: true, 2: true });
    }
    if (infoTransaction == "pending") {
      handleReset();
    }
  }, [infoTransaction]);
  useEffect(() => {
    try {
      token?.tokenContract ? getBalanceToken(web3 as Web3, token.tokenContract).then(res => setBalance(res)) : getBalance(web3 as Web3).then(res => setBalance(res));
    } catch {
      setBalance("Error");
    }
  }, [networkState.currentNetwork.data, token, web3, infoTransaction]);
  return (
    <Grid style={{ width: "100%" }} container columns={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100 }}>
      <Grid>
        <TitlePageContainer>
          <TitlePage>Transfer your Ethereum</TitlePage>
        </TitlePageContainer>
        <SubTitlePage>You need to choose the correct network, address and coin to transfer to another wallet address.</SubTitlePage>
      </Grid>
      <Grid item xs={100} sm={100} md={100} lg={50} xl={55}>
        <BackgroundPage>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <FormControl fullWidth>
                <ContainerTextField>
                  <label>
                    Select coin <SpanRed>*</SpanRed>
                  </label>
                  <CustomButton onClick={() => setOpenSelect(true)} imgLeft={token?.img || ""} textAlign='left' text={token?.name || ""} fullWidth styleButton='default' iconRight={DropdownBlack} />
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
                      onChange={e => {
                        setRenderGasLimit(e.target.value);
                        onChange(e);
                      }}
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
                      onChange={e => {
                        setRenderGasLimit(e.target.value);
                        setAmount(e.target.value);
                        onChange(e);
                      }}
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
                <div>Total gas</div>
                <div>
                  {Number(gasLimit) + Number(gasPrice) ? (Number(gasLimit) ? Number(gasLimit).toFixed(10) + " + " : "") + Number(gasPrice).toFixed(10) : "0"} {networkState.currentNetwork.data.title}
                </div>
              </ContainerFlexSpace>
              {/* <ContainerFlexSpace>
                <div>Value</div>
                <div>{(Number(amount) ? "+ " + Number(amount) : "+ 0") + " " + token?.symbol}</div>
              </ContainerFlexSpace> */}
              <ContainerFlexSpace>
                <TextHeaderOverview>Total amount</TextHeaderOverview>
                <TextHeaderOverview>
                  {networkState.currentNetwork.data.title === token?.symbol
                    ? (Number(gasLimit) + Number(gasPrice) + Number(amount) ? Number(gasLimit) + Number(gasPrice) + Number(amount) : "0") + " " + networkState.currentNetwork.data.title
                    : (Number(gasLimit) + Number(gasPrice) ? Number(gasLimit) + Number(gasPrice) + " " + networkState.currentNetwork.data.title : "") +
                      ((Number(amount) ? " + " + Number(amount) : " + 0") + " " + token?.symbol)}
                </TextHeaderOverview>
              </ContainerFlexSpace>

              <ContainerRight>
                <CustomButton variant='contained' loadingPosition='end' type='submit' text='Transfer' styleButton='primary' width='150px' height='50px'></CustomButton>
              </ContainerRight>
            </FormGroup>
          </form>
        </BackgroundPage>
      </Grid>
      <Grid item xs={100} sm={100} md={100} lg={50} xl={45}>
        <ContainerBalanceCard>
          <BackgroundPage>
            <ReceiveTagHeader>Account balance</ReceiveTagHeader>
            <CopyAddressContainer onClick={() => copyAddress(myAddress, setStatus)}>
              {sliceAddress(myAddress)}
              {status ? <DoneIcon /> : <Copy />}
            </CopyAddressContainer>
            <BalanceNumberCard>
              {balance} {token?.symbol}
            </BalanceNumberCard>
          </BackgroundPage>
        </ContainerBalanceCard>
      </Grid>
      <ModalCustom open={open} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box sx={style} width={isDesktop ? 700 : 300}>
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
                <CustomButton
                  onClick={() => window.open(networkState.currentNetwork.data.apiTransactionHash?.replace("{transactionHash}", transactionHash), "_blank")}
                  width='230px'
                  height='44px'
                  styleButton='inactive'
                  text='View transfer history'
                ></CustomButton>
                <CustomButton
                  onClick={() => {
                    handleClose();
                    if (transactionInfoCookies) {
                      // handleComfirmRequest();
                      setTransactionInfoCookies(null);
                      window.close();
                    }
                  }}
                  width='135px'
                  height='44px'
                  styleButton='primary'
                  text='Ok, I got it'
                ></CustomButton>
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
                <CopyAddressContainer onClick={() => copyAddress(transactionHash, setStatusTransactionHash)}>
                  {"Transaction hash: " + sliceAddress(transactionHash)}
                  {statusTransactionHash ? <DoneIcon /> : <Copy />}
                </CopyAddressContainer>
              ) : null}
            </>
          ) : null}
        </Box>
      </ModalCustom>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity='error' sx={{ width: "100%", borderRadius: "8px" }}>
          {transactionError}
        </Alert>
      </Snackbar>
      <ModalCustom open={openSelect} onClose={handleCloseSelect} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box sx={style} width={isDesktop ? 500 : 300}>
          <HeaderModalInfoTransaction>
            <TitleModal>Select coin to transfer</TitleModal>
            <div>
              <IconButton onClick={handleCloseSelect}>
                <CloseIcon />
              </IconButton>
            </div>
          </HeaderModalInfoTransaction>

          <CustomInput
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            placeholder={"Search"}
            size='small'
            hiddenLabel
            fullWidth
            color='primary'
            styleTextField='disable'
            width='100%'
            onChange={e => handleChangeSearch(e.target.value)}
            margin='dense'
          />
          {listTokenState.currentListTokens.data
            .filter(coin => coin.chainID === networkState.currentNetwork.data.chainID)
            .filter(
              searchText
                ? coin => coin.symbol.toLowerCase().includes(searchText.toLowerCase()) || coin.name.toLowerCase().includes(searchText.toLowerCase()) || coin.tokenContract?.includes(searchText)
                : coin => coin
            ).length ? (
            listTokenState.currentListTokens.data
              .filter(coin => coin.chainID === networkState.currentNetwork.data.chainID)
              .filter(
                searchText
                  ? coin => coin.symbol.toLowerCase().includes(searchText.toLowerCase()) || coin.name.toLowerCase().includes(searchText.toLowerCase()) || coin.tokenContract?.includes(searchText)
                  : coin => coin
              )
              .map(coin => (
                <CustomMenuItem
                  onClick={() => {
                    setToken(coin);
                    handleCloseSelect();
                  }}
                  key={coin.symbol}
                  value={coin.symbol}
                >
                  <img width={"20px"} style={{ marginRight: "20px" }} src={coin.img} alt={coin.symbol} />
                  {coin.name}
                </CustomMenuItem>
              ))
          ) : tokenImport ? (
            <CustomMenuItem
              onClick={() => {
                handleAddToken();
                setToken(tokenImport);
                handleCloseSelect();
              }}
              //key={coin.symbol}
              value={tokenImport?.symbol}
            >
              <img width={"20px"} style={{ marginRight: "20px" }} src={tokenImport.img} alt={tokenImport.symbol} />
              <p style={{ width: "80%", textAlign: "left" }}>{tokenImport?.name}</p>
              <p style={{ color: "#CCC" }}>Import</p>
            </CustomMenuItem>
          ) : null}
        </Box>
      </ModalCustom>
      <SignTransactionModal
        title='Transaction request'
        subTitle='Application wants to sign'
        loading={false}
        info={transactionInfoCookies}
        handleClose={handleReject}
        handleConfirm={handleComfirmRequest}
      />
    </Grid>
  );
};
export default Transfer;
