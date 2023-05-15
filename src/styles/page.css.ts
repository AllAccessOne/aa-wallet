import styled from "styled-components";
import base from "./theme/base";
import { createBreakpoint } from "styled-components-breakpoint";
const breakpoint = createBreakpoint(base.breakpoints);

export const Page = styled.div`
  max-height: calc(100vh - 120px);
  ${breakpoint("xs")`
      margin-top: 80px;
      overflow: auto;
    `}
  ${breakpoint("sm")`
      margin-top: 64px;
      overflow: auto;
    `}
    z-index: -99;
`;
export const TitlePage = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xxxl + "px"};
  font-weight: ${({ theme }) => theme.fontWeights.semiBold};
  color: ${({ theme }) => theme.colors.brands.blue400};
  line-height: 39px;
  ${breakpoint("sm")`
    display: none;
  `}
  ${breakpoint("md")`
    display: block;
    `}
`;

export const TitlePageBlack = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xxxl + "px"};
  font-weight: ${({ theme }) => theme.fontWeights.semiBold};
  color: ${({ theme }) => theme.colors.black};
  line-height: 39px;
  ${breakpoint("sm")`
    display: none;
  `}
  ${breakpoint("md")`
    display: block;
    `}
`;
