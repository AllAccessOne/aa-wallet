import { ListItemHeader, ListCustom } from "./slider.css";
// import { Menu, Item, MenuLink } from './slider.css'
import { listMenu } from "../../configs/data";
import List from "@mui/material/List";
import styled from "styled-components";
import { createBreakpoint } from "styled-components-breakpoint";
import base from "../../styles/theme/base";
const breakpoint = createBreakpoint(base.breakpoints);
import ListItem from "./listItem";
import { LogoIcon } from "../../assets/img";
import React from "react";
type Props = {
  display: boolean;
};
const Sidebar: React.FC<Props> = (props: Props) => {
  return (
    <SidebarApp {...props}>
      <List>
        <ListItemHeader>
          <img src={LogoIcon} />
          Allaccess.one
        </ListItemHeader>
        <ListCustom>
          {listMenu.map(e => (
            <ListItem name={e.name} subMenu={e.subMenu} icon={e.icon} />
          ))}
        </ListCustom>
      </List>
    </SidebarApp>
  );
};

export default Sidebar;

const SidebarApp = styled.div<Props>`
  min-height: 100%;
  background-color: ${props => props.theme.colors.neutrals.gray100};
  font-size: ${props => props.theme.fontSizes.md} + "px";
  display: ${props => {
    if (props.display) {
      return "block";
    } else {
      return "none";
    }
  }};
  ${breakpoint("xs")<Props>`
    position: fixed;
    width: 70vw;
    right: 0;
    border: none;
    height: 100vh;
    `};
  ${breakpoint("sm")<Props>`
      position: static;
      display: block;
      width: 100%;
      left: 0;
      border-right: solid 1px ${props => props.theme.colors.neutrals.gray400};

    `};
  ${breakpoint("md")<Props>`
      position: static;
      display: block;
      left: 0;
    `};

  ${breakpoint("lg")<Props>`
      position: static;
      display: block;
      left: 0;
    `};

  box-sizing: border-box;
`;
