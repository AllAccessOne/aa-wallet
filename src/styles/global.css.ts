import { createGlobalStyle } from "styled-components";
import { Theme } from "@app/types/theme.type";
import styled from "styled-components";
import { createBreakpoint } from "styled-components-breakpoint";
import base from "../styles/theme/base";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
const breakpoint = createBreakpoint(base.breakpoints);

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  body {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.neutrals.gray600};
    font-family:  'Inter', sans-serif;
    font-style: normal;
    margin: 0;
    .css-1e6y48t-MuiButtonBase-root-MuiButton-root{
      text-transform: none !important;
    }
    .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input{
      border: 1px !important;
      border-radius: 8px !important;
    }
    .css-1h9z7r5-MuiButtonBase-root-MuiTab-root{
      text-transform: none !important;
    }
    .css-k4qjio-MuiFormHelperText-root{
      background-color: rgb(250, 250, 250) !important;
      margin: 0;
      padding-left: 10px;
    }
    .css-wjh20t-MuiPagination-ul{
      margin: 20px 0px;
      display: flex;
      justify-content: center;
    }
    .css-10w330c-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected{
      background: #E9F2FF;
      border-radius: 3px;
      color:#0C66E4;
    }
    .css-1ps6pg7-MuiPaper-root{
      box-shadow: none !important;
    }
  }
`;
