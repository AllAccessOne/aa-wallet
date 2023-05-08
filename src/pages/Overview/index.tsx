import { Page } from "../../styles";
import { Grid } from "@mui/material";
import { NetworkContainer } from "../../components/Network";
import { HeaderPageContainer, SubHeaderPage, BalanceContainer, TextBlue, Divider } from "./overview.css";
import { TitlePage } from "../../styles";
import { ChooseToken } from "../../assets/icon";
import SearchComponet from "../../components/TextField";
import { SearchIcon } from "../../assets/icon";
const Overview = () => {
  return (
    <Page>
      <Grid container columns={{ xs: 100, sm: 100, md: 100, lg: 100 }}>
        <Grid item xs={60} sm={60} md={60} lg={60}>
          <HeaderPageContainer>
            <TitlePage>My wallet overview</TitlePage>
            <SubHeaderPage>Estimated balance</SubHeaderPage>
            <BalanceContainer>
              <TextBlue>1.868 BTC </TextBlue>
              <ChooseToken /> ~ $56,040
            </BalanceContainer>
            <Divider />
          </HeaderPageContainer>
        </Grid>
        <Grid item xs={40} sm={40} md={40} lg={40}>
          <NetworkContainer />
        </Grid>
        <Grid item xs={60} sm={60} md={60} lg={60}>
          <SearchComponet
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            placeholder={"Search"}
            size='small'
            hiddenLabel
            fullWidth
          />
        </Grid>
        <Grid item xs={40} sm={40} md={40} lg={40}>
          b
        </Grid>
      </Grid>
    </Page>
  );
};

export default Overview;
