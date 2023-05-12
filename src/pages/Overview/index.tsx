import { Page } from "../../styles";
import { Grid, Container } from "@mui/material";
import { NetworkContainer } from "../../components/Network";
import { myListCoin, historyData } from "../../configs/data/test";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState, useEffect } from "react";

import {
  NetworkContainerFixed,
  SubHeaderPage,
  BalanceContainer,
  TextBlue,
  Divider,
  OverviewHeaderTopCoin,
  SearchContainer,
  TextHeaderOverview,
  ListItemMyAssets,
  ItemMyAssets,
  ItemMyAssetsLeft,
  ItemMyAssetsRight,
  TextCoin,
  FromToAddressContainer,
  TransactionLinkContainer,
  HaaderPageBalance,
  ContentPageContainer,
  TilePageContainer,
  EmptyContainer,
} from "./overview.css";
import { TitlePage } from "../../styles";
import { ChooseToken } from "../../assets/icon";
import SearchComponet from "../../components/TextField";
import { SearchIcon, ReceiveTransactionHistoty, SendTransactionHistoty, LinkTransaction, Empty } from "../../assets/icon";

import CustomButton from "../../components/Button";
const Overview = () => {
  const myAdress = "0x15375...b080f";
  return (
    <Page>
      <Grid container columns={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100 }}>
        <Grid item xs={100} sm={100} md={100} lg={50} xl={60}>
          <TilePageContainer>
            <TitlePage>My wallet overview</TitlePage>
          </TilePageContainer>
        </Grid>
        <Grid item xs={100} sm={100} md={50} lg={50} xl={40}>
          <NetworkContainerFixed>
            <NetworkContainer />
          </NetworkContainerFixed>
        </Grid>
        <Grid container columns={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100 }}>
          <Grid item xs={100} sm={100} md={100} lg={50} xl={60}>
            <HaaderPageBalance>
              <SubHeaderPage>Estimated balance</SubHeaderPage>
              <BalanceContainer>
                <TextBlue>1.868 BTC </TextBlue>
                <ChooseToken /> ~ $56,040
              </BalanceContainer>
              <Divider />
            </HaaderPageBalance>
          </Grid>
        </Grid>
      </Grid>
      <Grid container columns={{ xs: 100, sm: 100, md: 100, lg: 100, xl: 100 }}>
        <Grid item xs={100} sm={100} md={100} lg={50} xl={60}>
          <OverviewHeaderTopCoin>
            <TextHeaderOverview>My Assets</TextHeaderOverview>
            <SearchContainer>
              <SearchComponet
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
                placeholder={"Search"}
                size='small'
                hiddenLabel
                fullWidth
                color='primary'
                styleTextField='default'
                width='100%'
              />
            </SearchContainer>
          </OverviewHeaderTopCoin>

          <ContentPageContainer>
            <ListItemMyAssets>
              {myListCoin ? (
                myListCoin.map(item => (
                  <ItemMyAssets>
                    <ItemMyAssetsLeft>
                      <img style={{ marginRight: "10px" }} width={"30px"} src={item.img}></img>
                      <TextCoin>{item.name}</TextCoin>
                      {item.symbol}
                    </ItemMyAssetsLeft>
                    <ItemMyAssetsRight>
                      <TextCoin> {item.balance} </TextCoin>~ $0.6868
                    </ItemMyAssetsRight>
                  </ItemMyAssets>
                ))
              ) : (
                <EmptyContainer>
                  <div>
                    <Empty></Empty>
                    <p>Assets not found in your wallet</p>
                  </div>
                </EmptyContainer>
              )}
            </ListItemMyAssets>
          </ContentPageContainer>
        </Grid>
        <Grid item xs={100} sm={100} md={100} lg={50} xl={40}>
          <OverviewHeaderTopCoin>
            <TextHeaderOverview>Recent transactions</TextHeaderOverview>
          </OverviewHeaderTopCoin>
          <ContentPageContainer>
            <ListItemMyAssets>
              {historyData ? (
                historyData.map(item => (
                  <ItemMyAssets>
                    <TransactionLinkContainer>
                      <Tooltip title='Link to view full about this transaction' placement='top-start'>
                        <IconButton>
                          <LinkTransaction />
                        </IconButton>
                      </Tooltip>
                      <div>
                        <FromToAddressContainer>
                          <span style={{ color: "#42526E" }}> From: </span> <span style={{ color: "#346FBE" }}>{item.from}</span>
                        </FromToAddressContainer>
                        <FromToAddressContainer>
                          <span style={{ color: "#42526E" }}> To: </span> <span style={{ color: "#346FBE" }}>{item.to}</span>
                        </FromToAddressContainer>
                      </div>
                    </TransactionLinkContainer>
                    <CustomButton text={item.balance + " ETH"} styleButton='default' iconRight={item.from === myAdress ? SendTransactionHistoty : ReceiveTransactionHistoty}></CustomButton>
                  </ItemMyAssets>
                ))
              ) : (
                <EmptyContainer>
                  <div>
                    <Empty></Empty>
                    <p>Assets not found in your wallet</p>
                  </div>
                </EmptyContainer>
              )}
            </ListItemMyAssets>
          </ContentPageContainer>
          <OverviewHeaderTopCoin>
            <CustomButton width='100%' boder='none' text='View all transactions'></CustomButton>
          </OverviewHeaderTopCoin>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Overview;
