import { Page, TitlePage } from "../../styles";
import base from "../../styles/theme/base";
import { createBreakpoint } from "styled-components-breakpoint";
import React, { useState } from "react";
import styled from "styled-components";
const breakpoint = createBreakpoint(base.breakpoints);
import MenuItem from "@mui/material/MenuItem";
import CustomInput from "../../components/TextField";
import { listNetWorks } from "../../configs/data/menu";
import { TimeDropdown } from "../../assets/icon";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

const columns: GridColDef[] = [
  { field: "time", headerName: "Time", width: 150 },
  { field: "method", headerName: "Method", width: 150 },
  { field: "amount", headerName: "Amount", width: 150 },
  { field: "from", headerName: "From", width: 250 },
  { field: "inOut", headerName: "", width: 100 },
  { field: "to", headerName: "To", width: 250 },
  { field: "network", headerName: "Network", width: 200 },
  { field: "id", headerName: "TxID", width: 250 },
];
const rows = [
  {
    time: "2022-08-14 02:34",
    method: "Approve",
    amount: "244.68 USDT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    inOut: "In",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10ff1e4c7a0be755527308fba56901e2b1",
  },
  {
    time: "2022-08-14 02:34",
    method: "Execute",
    amount: "1.12 BTC",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    inOut: "In",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10ff1e4c7a0be755527308fba56901e2b2",
  },
  {
    time: "2022-08-14 02:34",
    method: "Transfer",
    amount: "1.12 ETH",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    inOut: "Out",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10ff1e4c7a0be755527308fba56901e2b3",
  },
  {
    time: "2022-08-14 02:34",
    method: "Linear Deposit",
    amount: "1.12 DOT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    inOut: "In",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10ff1e4c7a0be755527308fba56901e2b5",
  },
  {
    time: "2022-08-14 02:34",
    method: "Approve",
    amount: "244.68 USDT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    inOut: "In",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10ff1e4c7a0be755527308fba5690112b1",
  },
  {
    time: "2022-08-14 02:34",
    method: "Approve",
    amount: "244.68 USDT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    inOut: "Out",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10ff1e4c7a0be755527308fbaa6901e2b1",
  },
  {
    time: "2022-08-14 02:34",
    method: "Approve",
    amount: "244.68 USDT",
    inOut: "Out",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10ff1e4c7a0b1755527308fba56901e2b1",
  },
  {
    time: "2022-08-14 02:34",
    method: "Approve",
    amount: "244.68 USDT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    inOut: "Out",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10ff1e4c7a0be7a5527308fba56901e2b1",
  },
  {
    time: "2022-08-14 02:34",
    method: "Approve",
    amount: "244.68 USDT",
    from: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe",
    inOut: "In",
    to: "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Af1",
    network: "Erthereum network",
    id: "0xed3a265cebd603aa2cb9771be5c6ce10ff1e4c7a0b1755527308fba56901e2b1",
  },
];

const History = () => {
  const myAddress = "0x04E407C7d7C2A6aA7f2e66B0B8C0dBcafA5E3Afe";
  const [time, setTime] = useState("30");
  const [method, setMethod] = useState("All");
  const [network, setNetwork] = useState("0");
  const [status, setStatus] = useState("All");
  const [searchId, setSearchId] = useState("");

  return (
    <Page>
      <TilePageContainer>
        <TitlePage>Transactions history</TitlePage>
        <SubTitlePage>View all your transfers and receive transaction in your wallet.</SubTitlePage>
        <ContainerFilter>
          <ContainerTextField>
            <label>Time</label>
            <CustomInput
              width='260px'
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
              <MenuItem value={0}>Custimized</MenuItem>
            </CustomInput>
          </ContainerTextField>
          <ContainerTextField>
            <label>Method</label>
            <CustomInput width='200px' value={method} styleTextField='default' select id='method' size='small' onChange={e => setMethod(e.target.value)}>
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={"Receive"}>Receive</MenuItem>
              <MenuItem value={"Execute"}>Execute</MenuItem>
              <MenuItem value={"LinearDeposit"}>Linear Deposit</MenuItem>
              <MenuItem value={"Approve"}>Approve</MenuItem>
            </CustomInput>
          </ContainerTextField>
          <ContainerTextField>
            <label>Network</label>
            <CustomInput width='300px' value={network} styleTextField='default' select id='network' size='small' onChange={e => setNetwork(e.target.value)}>
              <MenuItem value={"0"}>All mainnet</MenuItem>
              {listNetWorks.map(network => (
                <MenuItem value={network.chainID}>{network.description}</MenuItem>
              ))}
            </CustomInput>
          </ContainerTextField>
          <ContainerTextField>
            <label>Status</label>
            <CustomInput width='200px' value={status} styleTextField='default' select id='status' size='small' onChange={e => setStatus(e.target.value)}>
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={"Completed"}>Completed</MenuItem>
              <MenuItem value={"Incomplete"}>Incomplete</MenuItem>
              <MenuItem value={"Pending"}>Pending</MenuItem>
            </CustomInput>
          </ContainerTextField>
          <ContainerTextField>
            <label>Search ID</label>
            <CustomInput width='300px' onChange={e => setSearchId(e.target.value)} placeholder='Enter ID' id='search-id' size='small' value={searchId} styleTextField='default' />
          </ContainerTextField>
        </ContainerFilter>
      </TilePageContainer>
      <ContainerDataTable>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 8,
              },
            },
          }}
          pageSizeOptions={[8]}
        />
      </ContainerDataTable>
    </Page>
  );
};
export default History;
const ContainerFilter = styled.div`
  display: flex;
  align-items: center;
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
export const ContainerTextField = styled.div`
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: left;
  .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root {
    color: rgb(113, 128, 150) !important;
  }
`;
