import styled from "styled-components";
import { NavLink } from "react-router-dom";
import List from "@mui/material/List";
import { createBreakpoint } from "styled-components-breakpoint";
import base from "../../styles/theme/base";
const breakpoint = createBreakpoint(base.breakpoints);

export const MenuLink = styled(NavLink)`
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  font-size: ${props => props.theme.fontSizes.xs} + "px";
  color: ${props => props.theme.colors.neutrals.gray600};
  display: block;
  width: 80%;
  height: 40px;
`;

export const ListItemHeader = styled.div`
  font-family: "Roboto", sans-serif;
  display: flex;
  align-content: center;
  align-items: center;
  font-style: normal;
  margin-left: 2vw;
  margin-top: 1vh;
  font-weight: ${props => props.theme.fontWeights.medium};
  font-size: ${props => props.theme.fontSizes.md} + "px";
  color: ${props => props.theme.colors.neutrals.gray800};
  gap: 8px;
  margin-bottom: 5vh;
`;

export const IconArrowMenu = styled.div`
  right: 0;
`;
export const ListItemDiv = styled.div`
  width: 80%;
  font-size: ${props => props.theme.fontSizes.xs} + "px";
  color: #42526e;
  font-weight: ${props => props.theme.fontWeights.medium};
`;
export const NavLinkCustom = styled(List)`
  a.active {
    color: ${props => props.theme.colors.brands.blue600};
    background-color: ${props => props.theme.colors.neutrals.gray300};
  }
  a {
    margin-left: auto;
    margin-right: auto;
  }
`;
