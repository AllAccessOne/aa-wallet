import { Page, TitlePage } from "../../styles";
import base from "../../styles/theme/base";
import { createBreakpoint } from "styled-components-breakpoint";
import React, { useState, useLayoutEffect } from "react";
import styled from "styled-components";
const breakpoint = createBreakpoint(base.breakpoints);
import MenuItem from "@mui/material/MenuItem";
import CustomInput from "../../components/TextField";
import CustomButton from "../../components/Button";
import { listNetWorks } from "../../configs/data/menu";
import { TimeDropdown } from "../../assets/icon";
import TableCustom, { ModalCustom, HeaderModalInforTransaction, TitleModal } from "../../components/Table";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { EmptyContainer } from "../Overview/overview.css";
import { rows } from "../../configs/data/test";
import { Empty, Filter, SearchIcon } from "../../assets/icon";

const History = () => {
  // const myAddress = "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe";
  const [time, setTime] = useState("30");
  const [method, setMethod] = useState("All");
  const [network, setNetwork] = useState("0");
  const [status, setStatus] = useState("All");
  const [searchId, setSearchId] = useState("");
  const [customTimeFrom, setCustomTimeFrom] = useState<Dayjs | null>(dayjs("2022-04-17"));
  const [customTimeTo, setCustomTimeTo] = useState<Dayjs | null>(dayjs("2022-04-17"));
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openFilter, setOpenFilter] = React.useState(false);
  const handleOpenFilter = () => setOpenFilter(true);
  const handleCloseFilter = () => setOpenFilter(false);
  const [isDesktop, setIsDesktop] = useState(true);
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
              onChange={e => setTime(e.target.value)}
              SelectProps={{
                IconComponent: () => <TimeDropdown style={{ marginRight: "10px" }} />,
              }}
            >
              <MenuItem value={7}>Past 7 days</MenuItem>
              <MenuItem value={30}>Past 30 days</MenuItem>
              <MenuItem value={90}>Past 90 days</MenuItem>
              <MenuItem onClick={handleOpen} value={0}>
                Custimized
              </MenuItem>
            </CustomInput>
          </ContainerTextFieldTime>
          <ContainerTextFieldMethod>
            <label style={{ marginBottom: "5px" }}>Method</label>
            <CustomInput value={method} styleTextField='default' select id='method' size='small' onChange={e => setMethod(e.target.value)}>
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={"Receive"}>Receive</MenuItem>
              <MenuItem value={"Execute"}>Execute</MenuItem>
              <MenuItem value={"LinearDeposit"}>Linear Deposit</MenuItem>
              <MenuItem value={"Approve"}>Approve</MenuItem>
            </CustomInput>
          </ContainerTextFieldMethod>
          <ContainerTextFieldNetwork>
            <label style={{ marginBottom: "5px" }}>Network</label>
            <CustomInput value={network} styleTextField='default' select id='network' size='small' onChange={e => setNetwork(e.target.value)}>
              <MenuItem value={"0"}>All mainnet</MenuItem>
              {listNetWorks.map(network => (
                <MenuItem key={network.chainID} value={network.chainID}>
                  {network.description}
                </MenuItem>
              ))}
            </CustomInput>
          </ContainerTextFieldNetwork>
          <ContainerTextFieldStatus>
            <label style={{ marginBottom: "5px" }}>Status</label>
            <CustomInput value={status} styleTextField='default' select id='status' size='small' onChange={e => setStatus(e.target.value)}>
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
        {rows ? (
          <TableCustom />
        ) : (
          <EmptyContainer>
            <ContainerItemEmpty>
              <Empty></Empty>
              <p>No records found.</p>
            </ContainerItemEmpty>
          </EmptyContainer>
        )}
      </ContainerDataTable>
      <ModalCustom open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box sx={style} width={isDesktop ? 500 : 320}>
          <HeaderModalInforTransaction>
            <TitleModal>Customize time range</TitleModal>
            <div>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </HeaderModalInforTransaction>
          <HeaderModalInforTransaction>
            <ModalSubtitle>Select your time range with in 12 months</ModalSubtitle>
          </HeaderModalInforTransaction>
          <HeaderModalInforTransaction>
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
          </HeaderModalInforTransaction>
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
              Custimized
            </MenuItem>
          </CustomInput>
          <label style={{ marginBottom: "5px", marginTop: "5px" }}>Method</label>
          <CustomInput value={method} styleTextField='default' select id='method' size='small' onChange={e => setMethod(e.target.value)}>
            <MenuItem value={"All"}>All</MenuItem>
            <MenuItem value={"Receive"}>Receive</MenuItem>
            <MenuItem value={"Execute"}>Execute</MenuItem>
            <MenuItem value={"LinearDeposit"}>Linear Deposit</MenuItem>
            <MenuItem value={"Approve"}>Approve</MenuItem>
          </CustomInput>
          <label style={{ marginBottom: "5px", marginTop: "5px" }}>Network</label>
          <CustomInput value={network} styleTextField='default' select id='network' size='small' onChange={e => setNetwork(e.target.value)}>
            <MenuItem value={"0"}>All mainnet</MenuItem>
            {listNetWorks.map(network => (
              <MenuItem key={network.chainID} value={network.chainID}>
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

const ContainerButtonModalFilter = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: right;
`;

export const ModalSubtitle = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
`;
const ModalTo = styled.div`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;
const ContainerFilter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  ${breakpoint("xs")`
    display: none;
`}
  ${breakpoint("md")`
     display: flex;
  `}
`;
const ContainerDataTable = styled.div`
  ${breakpoint("xs")`
    margin: 10px 10px;
  `}
  ${breakpoint("lg")`
    margin: 10px 44px;
  `}
`;

export const TilePageContainer = styled.div`
  ${breakpoint("xs")`
    margin: 0px 10px;
`}
  ${breakpoint("lg")`
    margin: 22px 44px;
  `}
  position: static;
  justify-content: center;
  align-items: center;
`;
const ContainerItemEmpty = styled.div`
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
const ContainerFilterButton = styled.div`
  margin: 20px 10px;
  ${breakpoint("xs")`
    display: block;
  `}
  ${breakpoint("md")`
     display: none;
  `}
`;
export const ContainerTextFieldTime = styled.div`
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: left !important;
  align-items: left !important;
  text-align: left !important;
  width: 30%;
  .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root {
    color: rgb(113, 128, 150) !important;
  }
`;

export const ContainerTextFieldTimeCustom = styled.div`
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: left !important;
  align-items: left !important;
  text-align: left !important;
  width: 40%;
  .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root {
    color: rgb(113, 128, 150) !important;
  }
`;
export const ContainerTextFieldMethod = styled.div`
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: left;
  width: 20%;
  .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root {
    color: rgb(113, 128, 150) !important;
  }
`;
export const ContainerTextFieldNetwork = styled.div`
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: left;
  width: 30%;
  .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root {
    color: rgb(113, 128, 150) !important;
  }
`;
export const ContainerTextFieldStatus = styled.div`
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: left;
  width: 20%;
  .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root {
    color: rgb(113, 128, 150) !important;
  }
`;
export const ContainerTextFieldId = styled.div`
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: left;
  width: 35%;
  .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root {
    color: rgb(113, 128, 150) !important;
  }
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

const styleMobile = {
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
  textAlign: "left",
  alignItems: "left",
};
