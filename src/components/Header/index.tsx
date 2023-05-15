import React, { useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { routes } from "../../configs/data";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Slider from "../Sidebar";
import { Menu } from "../../assets/icon";
import SearchComponet from "../TextField";
import { SearchIcon } from "../../assets/icon";
import base from "../../styles/theme/base";
import { createBreakpoint } from "styled-components-breakpoint";
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
          color='primary'
          styleTextField='disable'
          width='300px'
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
  z-index: 99;
  display: flex;
  justify-content: space-between;
  text-align: center;
  justify-content: space-between;
  text-align: center;
  position: fixed;
  top: 0;
  right: 0;
  background-color: ${props => props.theme.colors.white};
  box-sizing: border-box;
  align-items: center;
  ${breakpoint("xs")`
        border: none;
        height: 80px;
        width: 100%;
        align-items: left;
    `}
  ${breakpoint("sm")`
        display: flex;
        max-width: 74%;
        border-bottom: solid 1px ${props => props.theme.colors.neutrals.gray200};
        height: 64px;
    `}
   ${breakpoint("md")`
        max-width: 80%;
    `}
  ${breakpoint("lg")`
        max-width: 84%;
    `}
`;

const TextBreadcumb = styled.div`
  ${breakpoint("xs")`
        color: ${props => props.theme.colors.neutrals.gray900};
        font-weight: ${props => props.theme.fontWeights.semiBold};
        font-size: ${props => props.theme.fontSizes.xl + "px"};
        margin-left: 10px;

    `}
  ${breakpoint("sm")`
        color: ${props => props.theme.colors.neutrals.gray600};
        font-weight: ${props => props.theme.fontWeights.semiBold};
        font-size: ${props => props.theme.fontSizes.xs + "px"};

    `}
    ${breakpoint("md")`
      
      margin-left: 44px;
    `}
`;
const ButtonCustom = styled.div`
  ${breakpoint("xs")`
        display: block;

    `}
  ${breakpoint("sm")`
        display: none;
    `}
`;

export const SearchContainer = styled.div`
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
