import React, { useState, useLayoutEffect, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimeDropdown } from "../../assets/icon";
import { Filter, SearchIcon } from "../../assets/icon";
import CustomInput from "../../components/TextField";
import CustomButton from "../../components/Button";
import TableCustom from "../../components/Table";
import { ModalCustom, HeaderModalInfoTransaction, TitleModal } from "../../components/Table/table.css";
import { Page, TitlePage } from "../../styles";
import { listNetWorks } from "@app/configs/data";
import { getHistoriesAddress } from "@app/store/redux/history/actions";

import {
  ContainerButtonModalFilter,
  ModalSubtitle,
  ModalTo,
  ContainerFilter,
  ContainerDataTable,
  TilePageContainer,
  SubTitlePage,
  ContainerFilterButton,
  ContainerTextFieldTime,
  ContainerTextFieldMethod,
  ContainerTextFieldTimeCustom,
  ContainerTextFieldNetwork,
  ContainerTextFieldStatus,
  ContainerTextFieldId,
  style,
  styleMobile,
} from "./history.css";
import { useAppDispatch, useAppSelector } from "@app/store";
import { ChainNetwork } from "@app/types/blockchain.type";
import useBlockchain from "@app/blockchain/wrapper";
import { useCustomSnackBar } from "@app/hooks";

const History = () => {
  const { handleNotification } = useCustomSnackBar();
  const networkState = useAppSelector(state => state.network);
  const { getAccount, getAccountByCore } = useBlockchain();
  const dispatch = useAppDispatch();
  const [time, setTime] = useState("30");
  const [method, setMethod] = useState("All");
  const [network, setNetwork] = useState(networkState.currentNetwork.data);
  const [status, setStatus] = useState("All");
  const [searchId, setSearchId] = useState("");
  const handleGetCurrentDate = () => {
    const currentDate = new Date();
    const d = currentDate.getDate();
    const m = currentDate.getMonth() + 1;
    const y = currentDate.getFullYear();
    return y + "-" + m + "-" + d;
  };
  const [currentDay, _] = useState(() => handleGetCurrentDate());
  const [customTimeFrom, setCustomTimeFrom] = useState<Dayjs | null>(dayjs(currentDay));
  const [customTimeTo, setCustomTimeTo] = useState<Dayjs | null>(dayjs(currentDay));
  const [open, setOpen] = React.useState(false);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleOpenFilter = () => setOpenFilter(true);
  const handleCloseFilter = () => setOpenFilter(false);

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
  useEffect(() => {
    if (getAccount()) {
      fetchData(network);
    }
  }, [getAccount(), network, status, customTimeFrom, customTimeTo]);
  // useEffect(() => {
  //   if (network !== networkState.currentNetwork.data) fetchData(network);

  //   dispatch(setNetworkState(network));
  // }, [network]);
  const fetchData = async (currentNetwork: ChainNetwork) => {
    dispatch(getHistoriesAddress({ network, address: getAccountByCore(currentNetwork.core) }));
  };
  return (
    <Page>
      <TilePageContainer>
        <TitlePage>Transactions history</TitlePage>
        <SubTitlePage>View all your transfers and receive transaction in your wallet.</SubTitlePage>
        <ContainerFilter>
          <ContainerTextFieldTime>
            <label style={{ marginBottom: "5px" }}>Time</label>
            <CustomInput
              value={time}
              styleTextField='default'
              select
              id='time'
              size='small'
              onChange={e => {
                setTime(e.target.value);
              }}
              SelectProps={{
                IconComponent: () => <TimeDropdown style={{ marginRight: "10px" }} />,
              }}
            >
              <MenuItem value={7}>Past 7 days</MenuItem>
              <MenuItem value={30}>Past 30 days</MenuItem>
              <MenuItem value={90}>Past 90 days</MenuItem>
              <MenuItem onClick={handleOpen} value={0}>
                Customized
              </MenuItem>
            </CustomInput>
          </ContainerTextFieldTime>
          <ContainerTextFieldMethod>
            <label style={{ marginBottom: "5px" }}>Method</label>
            <CustomInput
              value={method}
              styleTextField='default'
              select
              id='method'
              size='small'
              onChange={e => {
                setMethod(e.target.value);
              }}
            >
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={"Transfer"}>Transfer</MenuItem>
              <MenuItem value={"Approve"}>Approve</MenuItem>
              <MenuItem value={"TransferFrom"}>TransferFrom</MenuItem>
              <MenuItem value={"Mint"}>Mint</MenuItem>
              <MenuItem value={"Burn"}>Burn</MenuItem>
            </CustomInput>
          </ContainerTextFieldMethod>
          <ContainerTextFieldNetwork>
            <label style={{ marginBottom: "5px" }}>Network</label>
            <CustomInput
              value={network.description}
              styleTextField='default'
              select
              id='network'
              size='small'
              onChange={e => {
                setNetwork(listNetWorks.find(network => network.description === e.target.value) as ChainNetwork);
              }}
            >
              {listNetWorks.map(network => (
                <MenuItem key={network.chainID} value={network.description}>
                  {network.description}
                </MenuItem>
              ))}
            </CustomInput>
          </ContainerTextFieldNetwork>
          <ContainerTextFieldStatus>
            <label style={{ marginBottom: "5px" }}>Status</label>
            <CustomInput
              value={status}
              styleTextField='default'
              select
              id='status'
              size='small'
              onChange={e => {
                handleNotification("Ohhh, it is upgrading", "warning");
                setStatus(e.target.value);
              }}
            >
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={"Completed"}>Completed</MenuItem>
              <MenuItem value={"Incomplete"}>Incomplete</MenuItem>
              <MenuItem value={"Pending"}>Pending</MenuItem>
            </CustomInput>
          </ContainerTextFieldStatus>
          <ContainerTextFieldId>
            <label style={{ marginBottom: "5px" }}>Search ID</label>
            <CustomInput onChange={e => setSearchId(e.target.value)} placeholder='Enter ID' id='search-id' size='small' value={searchId} styleTextField='default' />
          </ContainerTextFieldId>
        </ContainerFilter>
        <ContainerFilterButton>
          <CustomButton onClick={handleOpenFilter} text='Filter' styleButton='style' iconRight={Filter} />
        </ContainerFilterButton>
      </TilePageContainer>
      <ContainerDataTable>
        <TableCustom
          selectedNetwork={network}
          time={time}
          method={method}
          searchId={searchId}
          status={status}
          timeFrom={customTimeFrom?.format("YYYY/MM/DD")}
          timeTo={customTimeTo?.format("YYYY/MM/DD")}
        />
      </ContainerDataTable>
      <ModalCustom open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box sx={style} width={isDesktop ? 500 : 320}>
          <HeaderModalInfoTransaction>
            <TitleModal>Customize time range</TitleModal>
            <div>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </HeaderModalInfoTransaction>
          <HeaderModalInfoTransaction>
            <ModalSubtitle>Select your time range with in 12 months</ModalSubtitle>
          </HeaderModalInfoTransaction>
          <HeaderModalInfoTransaction>
            <ContainerTextFieldTimeCustom>
              <label style={{ marginBottom: "5px" }}>Start time</label>
              <CustomInput
                value={1}
                styleTextField='default'
                select
                size='small'
                SelectProps={{
                  IconComponent: () => <TimeDropdown style={{ marginRight: "10px" }} />,
                }}
              >
                <MenuItem value={1}>{customTimeFrom?.format("DD/MM/YYYY")}</MenuItem>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar value={customTimeFrom} onChange={newValue => setCustomTimeFrom(newValue)} />
                </LocalizationProvider>
              </CustomInput>
            </ContainerTextFieldTimeCustom>
            <ModalTo>To</ModalTo>
            <ContainerTextFieldTimeCustom>
              <label style={{ marginBottom: "5px" }}>End time</label>
              <CustomInput
                value={1}
                styleTextField='default'
                select
                id='time'
                size='small'
                SelectProps={{
                  IconComponent: () => <TimeDropdown style={{ marginRight: "10px" }} />,
                }}
              >
                <MenuItem value={1}>{customTimeTo?.format("DD/MM/YYYY")}</MenuItem>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar value={customTimeTo} onChange={newValue => setCustomTimeTo(newValue)} />
                </LocalizationProvider>
              </CustomInput>
            </ContainerTextFieldTimeCustom>
          </HeaderModalInfoTransaction>
          <CustomButton onClick={handleClose} mTop='30px' size='large' styleButton='primary' width='100%' text='Continue' />
        </Box>
      </ModalCustom>
      <ModalCustom open={openFilter} onClose={handleCloseFilter} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box sx={styleMobile} width={300}>
          <TitleModal>Filter</TitleModal>
          <CustomInput
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            placeholder={"Search TxID"}
            size='small'
            hiddenLabel
            fullWidth
            color='primary'
            styleTextField='disable'
            width='100%'
            margin='normal'
          />
          <label style={{ marginBottom: "5px", marginTop: "5px" }}>Time</label>
          <CustomInput
            value={time}
            styleTextField='default'
            select
            id='time'
            size='small'
            onChange={e => setTime(e.target.value)}
            SelectProps={{
              IconComponent: () => <TimeDropdown style={{ marginRight: "10px" }} />,
            }}
          >
            <MenuItem value={7}>Past 7 days</MenuItem>
            <MenuItem value={30}>Past 30 days</MenuItem>
            <MenuItem value={90}>Past 90 days</MenuItem>
            <MenuItem onClick={handleOpen} value={0}>
              Customized
            </MenuItem>
          </CustomInput>
          <label style={{ marginBottom: "5px", marginTop: "5px" }}>Method</label>
          <CustomInput value={method} styleTextField='default' select id='method' size='small' onChange={e => setMethod(e.target.value)}>
            <MenuItem value={"All"}>All</MenuItem>
            <MenuItem value={"Transfer"}>Transfer</MenuItem>
            <MenuItem value={"Approve"}>Approve</MenuItem>
            <MenuItem value={"TransferFrom"}>TransferFrom</MenuItem>
            <MenuItem value={"Mint"}>Mint</MenuItem>
            <MenuItem value={"Burn"}>Burn</MenuItem>
          </CustomInput>
          <label style={{ marginBottom: "5px", marginTop: "5px" }}>Network</label>
          <CustomInput
            value={network.description}
            styleTextField='default'
            select
            id='network'
            size='small'
            onChange={e => {
              setNetwork(listNetWorks.find(network => network.description === e.target.value) as ChainNetwork);
            }}
          >
            {listNetWorks.map(network => (
              <MenuItem key={network.rpcUrls} value={network.description}>
                {network.description}
              </MenuItem>
            ))}
          </CustomInput>
          <label style={{ marginBottom: "5px", marginTop: "5px" }}>Status</label>
          <CustomInput value={status} styleTextField='default' select id='status' size='small' onChange={e => setStatus(e.target.value)}>
            <MenuItem value={"All"}>All</MenuItem>
            <MenuItem value={"Completed"}>Completed</MenuItem>
            <MenuItem value={"Incomplete"}>Incomplete</MenuItem>
            <MenuItem value={"Pending"}>Pending</MenuItem>
          </CustomInput>
          <ContainerButtonModalFilter>
            <CustomButton onClick={handleCloseFilter} size='large' styleButton='primary' width='100px' text='Search' />
          </ContainerButtonModalFilter>
        </Box>
      </ModalCustom>
    </Page>
  );
};
export default History;
