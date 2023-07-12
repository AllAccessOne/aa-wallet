import styled from "styled-components";
import { breakpoint } from "../../utils";
export const BackgroundPage = styled.div`
  background-color: #fafafa;
  padding: 40px;
  border-radius: 8px;
  min-height: 40vh;
`;
export const TitlePageContainer = styled.div`
  margin-top: 20px;
  ${breakpoint("xs")`
    display: none;
`}
  ${breakpoint("lg")`
    display: block;
  `}
`;

export const Title2FAContainer = styled.div`
  margin-top: 20px;
`;
