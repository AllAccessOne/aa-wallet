import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../../styles/theme";
import { RoutesProps } from "../../types/route.type";
import { GlobalStyles } from "../../styles/global.css";
import { Grid } from "@mui/material";
import { Header, Footer } from "../";
import Slider from "../Sidebar";
import { routes } from "../../configs/data";
import { useLocation } from "react-router-dom";

const LayoutApp: React.FC<RoutesProps> = (props: React.PropsWithChildren<RoutesProps>) => {
  //const [theme, setTheme] = useState("light");
  // const themeToggler = () => {
  //     theme === "light" ? setTheme("dark") : setTheme("light");
  // }
  const location = useLocation();
  const checkLayout = routes.find(route => route.path === location.pathname);
  const [isDesktop, setIsDesktop] = useState(false);
  const handleResize = () => {
    if (window.innerWidth < 600) {
      setIsDesktop(false);
    } else {
      setIsDesktop(true);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });
  const theme = "light";
  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyles></GlobalStyles>
      {checkLayout?.layout ? (
        <Grid container columns={{ xs: 100, sm: 100, md: 100, lg: 100 }}>
          <Grid item xs={100} sm={26} md={20} lg={16}>
            <Slider display={isDesktop} />
          </Grid>
          <Grid item xs={100} sm={74} md={80} lg={84}>
            <Header />
            {props.children}
            <Footer />
          </Grid>
        </Grid>
      ) : (
        <div>{props.children}</div>
      )}
    </ThemeProvider>
  );
};

export default LayoutApp;
