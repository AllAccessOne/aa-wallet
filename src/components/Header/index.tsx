import React from "react";
import styled from "styled-components";
import { createBreakpoint } from "styled-components-breakpoint";
import base from "../../styles/theme/base";
import { useLocation } from "react-router-dom";
import { routes } from "../../configs/data";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Slider from "../Sidebar";
import { Menu } from "../../assets/icon";
import { useState, useEffect } from "react";
import SearchComponet from "../TextField";
import { SearchIcon } from "../../assets/icon";
import { Container } from "@mui/material";
const breakpoint = createBreakpoint(base.breakpoints);

const Header = () => {
  const location = useLocation();
  const breadcumbs = routes.find(route => route.path === location.pathname);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleResize = () => {
    if (window.innerWidth >= 600) {
      setOpen(false);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });
  return (
    <HeaderApp>
      <TextBreadcumb>{breadcumbs?.breadcrumbName}</TextBreadcumb>
      <ButtonCustom>
        <Button onClick={handleOpen}>
          <Menu />
        </Button>
      </ButtonCustom>
      <SearchContainer>
        <SearchComponet
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          placeholder={"Search"}
          size='small'
          hiddenLabel
          fullWidth
        />
      </SearchContainer>
      <Modal open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Slider display={open} />
      </Modal>
    </HeaderApp>
  );
};

export default Header;
const HeaderApp = styled.div`
  ${breakpoint("xs")`
        border: none;
        height: 80px;
    `}
  ${breakpoint("sm")`
        border-bottom: solid 1px ${props => props.theme.colors.neutrals.gray200};
        height: 64px;

    `}
    display: flex;
  justify-content: space-between;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
`;
const TextBreadcumb = styled.div`
  ${breakpoint("xs")`
        color: ${props => props.theme.colors.neutrals.gray900};
        font-weight: ${props => props.theme.fontWeights.semiBold};
        font-size: ${props => props.theme.fontSizes.sm + "px"};
        margin: 17px 44px;
    `}
  ${breakpoint("sm")`
        color: ${props => props.theme.colors.neutrals.gray600};
        font-weight: ${props => props.theme.fontWeights.semiBold};
        font-size: ${props => props.theme.fontSizes.xs + "px"};
        margin: 17px 44px;
    `}
`;
const ButtonCustom = styled.div`
  ${breakpoint("xs")`
        display: block;
        margin: 17px 44px;
    `}
  ${breakpoint("sm")`
        display: none;
    `}
`;

const SearchContainer = styled.div`
  ${breakpoint("xs")`
        display: none;
       
    `}
  ${breakpoint("sm")`
        display: flex;
        align-items: center;
        justify-content: right;
        margin-right: 20px;
    `}
`;
