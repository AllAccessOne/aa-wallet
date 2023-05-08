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
  }
`;
