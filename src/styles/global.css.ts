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
    margin: 0;
    font-family:  'Inter', sans-serif;
    font-style: normal;
    .css-1e6y48t-MuiButtonBase-root-MuiButton-root{
      text-transform: none !important;
    }
    .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input{
      border: 1px !important;
      border-radius: 8px !important;
    }
    .MuiFormLabel-root{
    //  position: static;
    }
  }
`;
