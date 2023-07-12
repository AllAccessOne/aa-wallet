import { Grid } from "@mui/material";
import { TitlePage } from "../../../styles";
import CustomButton from "../../../components/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import CustomInput from "../../../components/TextField";
import { Copy, DropdownBlack, SearchIcon } from "../../../assets/icon";
import { TextHeaderOverview } from "../../Overview/overview.css";
import FormGroup from "@mui/material/FormGroup";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { sliceAddress, copyAddress, formatBalance, isValidAddress } from "../../../utils";
import { setCurrentListTokens } from "../../../store/redux/token/actions";
import { useAppDispatch, useAppSelector } from "../../../store";
import { ModalCustom, HeaderModalInfoTransaction, TitleModal } from "../../../components/Table/table.css";
import Box from "@mui/material/Box";
import useBlockchain from "@app/blockchain/wrapper";
import { Token } from "../../../types/blockchain.type";
import { FormData } from "./type";
import { SignTransactionModal } from "@app/components";
import { InfoTransactions } from "@app/components/Modal/InfoTransactions";
import { SignedTransferResponse, TransferNative } from "@app/blockchain/types";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  style,
  CustomMenuItem,
  ContainerBalanceCard,
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
} from "./transfer.css";
import DoneIcon from "@mui/icons-material/Done";
import TransactionModal from "./transaction-modal";
import { useCustomSnackBar } from "@app/hooks";
import { Callbacks } from "@app/blockchain/types";
import { get } from "lodash";
const Transfer = () => {
  const { handleNotification } = useCustomSnackBar();
  const networkState = useAppSelector(state => state.network);
  const listTokenState = useAppSelector(state => state.token);
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState(false);
  const { web3, getAccount, getBalance, getBalanceToken, signTransfer, getGasPrice, getGasLimit, transfer, transferToken, getToken } = useBlockchain();
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenImport, setTokenImport] = useState<Token>();
  const [balance, setBalance] = useState("");
  const [isDesktop, setIsDesktop] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [token, setToken] = useState(listTokenState.currentListTokens.data.find(token => token.chainID === networkState.currentNetwork.data.chainID));

  const [openSelect, setOpenSelect] = useState(false);
  const [gasPrice, setGasPrice] = useState<string | 0>("0");
  const [gasLimit, setGasLimit] = useState<string | 0>("0");
  const [amount, setAmount] = useState("0");

  const [isOpenTransaction, setIsOpenTransaction] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [statusTransaction, setStatusTransaction] = useState<string>("");

  const handleCloseSelect = () => {
    setOpenSelect(false);
    setSearchText("");
  };
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
  const validateAddress = (value: string) => {
    const isValid = isValidAddress(value, networkState.currentNetwork.data.core);
    if (!isValid) {
      return `Invalid ${networkState.currentNetwork.data.title} address`;
    }
    return isValid;
  };
  useEffect(() => {
    const updateGasLimit = async () => {
      const addressTo = getValues("addressTo");
      const isValid = isValidAddress(addressTo, networkState.currentNetwork.data.core);
      if (!isValid) {
        setGasLimit(0);
        return;
      }
      const gasLimitValue = await getGasLimit({
        addressTo,
        amount,
        tokenContract: token?.tokenContract,
      });
      setGasLimit(gasLimitValue);
    };

    updateGasLimit();
  }, [token, networkState.currentNetwork.data, web3, amount]);
  useEffect(() => {
    const updateGasPrice = async () => {
      const gasPriceValue = await getGasPrice();
      setGasPrice(gasPriceValue);
    };
    updateGasPrice();
  }, [token, networkState.currentNetwork.data, web3, amount]);

  const renderTotalGas = (): number => {
    return Number(gasLimit) + Number(gasPrice);
  };

  const renderTotalAmount = () => {
    // Should check by token contract, native is zero address,
    if (networkState.currentNetwork.data.title.toUpperCase() === token?.symbol.toUpperCase()) {
      return `${(renderTotalGas() + Number(amount)).toFixed(10)} ${networkState.currentNetwork.data.title}`;
    } else {
      return `${amount} ${token?.symbol} + ${renderTotalGas().toFixed(10)} ${networkState.currentNetwork.data.title}`;
    }
  };

  const onSubmit = async (values: FormData) => {
    setStatusTransaction("pending");
    setIsOpenTransaction(true);
    const callbacks: Callbacks = {
      onError(err) {
        handleNotification(err, "error");
        setStatusTransaction("error");
        handleCloseTransactionModal();
      },
      onHash(hash) {
        setIsOpenTransaction(true);
        setTransactionHash(hash);
        setStatusTransaction("pending");
      },
      onSuccess() {
        handleNotification("Transfer successfully", "success");
        setStatusTransaction("success");
        handleGetBalance();
      },
    };
    if (token?.tokenContract) {
      await transferToken(
        {
          recipient: values.addressTo,
          amount: values.amount,
          tokenContract: token.tokenContract,
        },
        callbacks
      );
    }
    if (!token?.tokenContract) {
      await transfer(
        {
          recipient: values.addressTo,
          amount: values.amount,
        },
        callbacks
      );
    }
    reset();
  };

  const handleCloseTransactionModal = () => {
    setIsOpenTransaction(false);
    setTransactionHash("");
    setStatusTransaction("");
    setStatusTransaction("");
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
      const {
        currentNetwork: { data: currentNetwork },
      } = networkState;
      const addToken = await getToken({
        tokenContract: tokenAddress,
      });
      const check = listTokenState.currentListTokens.data.filter(token => token.tokenContract === tokenAddress).length;
      if (!addToken) return;
      if (!check) {
        setTokenImport({
          ...addToken,
          rpcUrls: currentNetwork.rpcUrls,
          chainID: currentNetwork.chainID,
        });
      }
    } catch (err) {
      console.error(err);
      return;
    }
  };
  const handleAddToken = () => {
    const check = listTokenState.currentListTokens.data.filter(token => token.tokenContract === tokenAddress).length;
    if (tokenImport && !check) {
      dispatch(setCurrentListTokens(tokenImport));
    }
  };
  useEffect(() => {
    if (isValidAddress(searchText, get(networkState, "currentNetwork.data.core"))) {
      handleGetInfoToken();
    }
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

  const handleGetBalance = () => {
    try {
      if (token?.tokenContract) {
        getBalanceToken({ tokenContract: token.tokenContract }).then(res => setBalance(res));
      } else {
        getBalance().then(res => setBalance(res));
      }
    } catch {
      setBalance("Error");
    }
  };

  useEffect(() => {
    handleGetBalance();
  }, [networkState.currentNetwork.data, token, web3, getAccount()]);

  //req sign transaction
  const [signFormData, setSignFormData] = useState<TransferNative | null>();
  const [openLoadingPage, setOpenLoadingPage] = React.useState(false);
  const [transactionInfoCookies, setTransactionInfoCookies] = useState<InfoTransactions | null>(null);

  const handleCloseLoadingPage = () => {
    setOpenLoadingPage(false);
  };
  const handleOpenLoadingPage = () => {
    setOpenLoadingPage(true);
  };
  const handleGetInfo = async () => {
    const handlePopupResponse = async (event: any) => {
      const data: InfoTransactions = event.data.data;
      if (data.addressTo) {
        setTransactionInfoCookies(data);
        const signData: TransferNative = {
          recipient: data.addressTo,
          amount: data.amount,
        };
        setSignFormData(signData);
      } else {
        setTransactionInfoCookies(null);
        setSignFormData(null);
      }
    };

    window.addEventListener("message", handlePopupResponse);
  };

  function handleConfirmRequest(res: SignedTransferResponse) {
    const handlePopupResponse = (event: any) => {
      window.addEventListener("beforeunload", () => {
        event.source.postMessage(
          {
            type: "STATUS",
            data: res,
          },
          event.origin
        );
      });
      window.close();
    };
    window.addEventListener("message", handlePopupResponse);
  }

  const handleClickComfirmRequest = () => {
    handleOpenLoadingPage();
    signTransfer(signFormData as TransferNative).then(res => {
      console.log(res);
      handleCloseLoadingPage();
      handleConfirmRequest(res);
    });
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
    handleGetInfo();
  }, []);

  return (
    <Grid style={{ width: "100%" }} container columns={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100 }}>
      <Grid>
        <TitlePageContainer>
          <TitlePage>Transfer your assets</TitlePage>
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
                        onChange(e);
                      }}
                      name={name}
                      value={value}
                      helperText={errors.addressTo?.message}
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
                    validate: validateAddress,
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
                  {renderTotalGas().toFixed(10)} {networkState.currentNetwork.data.title}
                </div>
              </ContainerFlexSpace>
              {/* <ContainerFlexSpace>
                <div>Value</div>
                <div>{(Number(amount) ? "+ " + Number(amount) : "+ 0") + " " + token?.symbol}</div>
              </ContainerFlexSpace> */}
              <ContainerFlexSpace>
                <TextHeaderOverview>Total amount</TextHeaderOverview>
                <TextHeaderOverview>{renderTotalAmount()}</TextHeaderOverview>
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
            <CopyAddressContainer
              onClick={() =>
                copyAddress(getAccount(), () => {
                  setStatus(true);
                  setTimeout(() => setStatus(false), 3000);
                })
              }
            >
              {sliceAddress(getAccount())}
              {status ? <DoneIcon /> : <Copy />}
            </CopyAddressContainer>
            <BalanceNumberCard>
              {formatBalance(balance)} {token?.symbol}
            </BalanceNumberCard>
          </BackgroundPage>
        </ContainerBalanceCard>
      </Grid>
      <TransactionModal isOpen={isOpenTransaction} handleClose={handleCloseTransactionModal} status={statusTransaction} transactionHash={transactionHash} />
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
        handleConfirm={handleClickComfirmRequest}
      />
      <Backdrop sx={{ color: "#fff", zIndex: 9999999999 }} open={openLoadingPage}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Grid>
  );
};
export default Transfer;
