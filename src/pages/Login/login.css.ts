import styled from "styled-components";
import { Background } from "../../assets/img";
import Grid from "@mui/material/Grid";
import base from "../../styles/theme/base";
import { createBreakpoint } from "styled-components-breakpoint";
import Slider from "react-slick";

const breakpoint = createBreakpoint(base.breakpoints);
export const CustomSlider = styled(Slider)`
  .slick-dots li button:before {
    font-size: 10px;
    color: white !important;
  }
  .slick-dots li.slick-active button:before {
    font-size: 15px !important;
  }
`;
export const BackgroundImg = styled.div`
  background-image: url("${Background}");
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  text-align: ${props => props.theme.position.center};
`;

export const ImgSlider = styled.img`
  margin-left: ${props => props.theme.spacing.auto};
  margin-right: ${props => props.theme.spacing.auto};

  ${breakpoint("md")`
      height: 40vh;
  `}
  ${breakpoint("lg")`
      height: 60vh;
  `}
  ${breakpoint("xl")`
      height: 60vh;
  `}
`;

export const TextSlider = styled.p`
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeights.semiBold};
  font-size: ${props => props.theme.fontSizes.xl + "px"};
  line-height: ${props => props.theme.lineHeights.lg + "px"};
  width: 444px;
  margin-left: ${props => props.theme.spacing.auto};
  margin-right: ${props => props.theme.spacing.auto};
  margin-top: ${props => props.theme.spacing.md + "px"};
`;
export const ContainerSlider = styled.div`
  text-align: ${props => props.theme.position.center};
`;
export const TextLogo = styled.div`
  align-content: center;
  align-items: center;
  max-height: 200px;
  max-width: 300px;
  ${breakpoint("xs")`
     display:none;
    `}
  ${breakpoint("md")`
      display:flex;
      margin-left: 5vw;
    `}
`;
export const LoginH1 = styled.div`
  font-family: "Roboto", sans-serif;
  font-weight: ${props => props.theme.fontWeights.extraBold};
  font-size: ${props => props.theme.fontSizes.xxxxl + "px"};
  color: ${props => props.theme.colors.neutrals.gray1000};
  margin-top: 15vh;
  ${breakpoint("xs")`
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    `}
  ${breakpoint("md")`
      margin-left: 5vw;
      text-align: left;
    `}
`;
export const Subtitle = styled.div`
  font-weight: ${props => props.theme.fontWeights.regular};
  color: ${props => props.theme.colors.neutrals.gray500};
  font-size: ${props => props.theme.fontSizes.xs + "px"};
  margin-top: 5px;
  ${breakpoint("xs")`
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    `}
  ${breakpoint("md")`
      margin-left: 5vw;
      text-align: left;

    `}
`;
export const ContainerLoginButton = styled.div`
  margin-top: 10vh;
  ${breakpoint("xs")`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
  `}
  ${breakpoint("md")`
      display: block;
      margin-left: 5vw;
      margin-right: 0;
  `}
`;

export const CustomGrid = styled(Grid)`
  ${breakpoint("xs")`
    display: none;
    `}
  ${breakpoint("md")`
      display: block;
    `}
`;

export const OrLineContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  margin-top: 2vh;
  margin-bottom: 2vh;
  hr {
    width: 47%;
    color: ${({ theme }) => theme.colors.neutrals.gray300};
    background-color: ${({ theme }) => theme.colors.neutrals.gray300};
    border-width: 0;
    height: 1px;
  }
  ${breakpoint("xs")`
       margin-left: auto;
       margin-right: auto;
       text-align: center;
    `}
  ${breakpoint("md")`
      margin-left:0;
      margin-right:0;
      text-align: left;
  `}
`;
