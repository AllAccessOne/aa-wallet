import React from "react";
import styled from "styled-components";
import base from "../../styles/theme/base";
import { createBreakpoint } from "styled-components-breakpoint";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";

const breakpoint = createBreakpoint(base.breakpoints);

type Props = {
  text?: string;
  iconLeft?: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  iconRight?: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  boder?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  mLeft?: string;
  mTop?: string;
  mRight?: string;
  mBottom?: string;
  pLeft?: string;
  pTop?: string;
  pRight?: string;
  pBotton?: string;
  padding?: string;
  gap?: string;
  fontSize?: string;
  styleButton?: "primary" | "default" | "inactive" | "style";
  float?: string;
  spaceBetween?: boolean;
};

const ButtonComponent = styled(LoadingButton)<LoadingButtonProps & Props>`
  margin-left: ${props => props.mLeft} !important;
  margin-right: ${props => props.mRight} !important;
  margin-top: ${props => props.mTop} !important;
  margin-bottom: ${props => props.mBottom} !important;
  float: ${props => props.float} !important;
  width: ${props => props.width} !important;
  height: ${props => props.height} !important;
  border-radius: ${props => props.theme.radii.sm + "px"} !important;
  background-color: ${props => {
    if (props.styleButton === "primary") {
      return props.theme.colors.brands.blue500;
    } else if (props.styleButton === "default") {
      return props.theme.colors.white;
    } else if (props.styleButton === "inactive") {
      return "#ECECED";
    } else {
      return "#EDF4FE";
    }
  }} !important;
  font-family: "Inter", sans-serif !important;
  font-style: normal !important;
  border: ${props => {
    if (props.styleButton === "primary") {
      return "none";
    } else if (props.styleButton === "default") {
      return `solid 1px ${props.theme.colors.neutrals.gray500}`;
    } else if (props.styleButton === "inactive") {
      return "none";
    } else {
      return `solid 1px ${props.theme.colors.brands.blue500}`;
    }
  }} !important;
  border: ${props => props.boder} !important;

  color: ${props => {
    if (props.styleButton === "primary") {
      return "#FFF";
    } else if (props.styleButton === "default") {
      return props.theme.colors.neutrals.gray700;
    } else if (props.styleButton === "inactive") {
      return props.theme.colors.neutrals.gray600;
    } else {
      return props.theme.colors.brands.blue500;
    }
  }} !important;
  padding: ${props => props.padding} !important;
  gap: ${props => props.gap} !important;
  display: flex;
  align-items: center;
  text-align: center;
  line-height: ${props => props.height} !important;
  font-size: ${props => props.fontSize} !important;
  ${breakpoint("xs")`
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    `}
  ${breakpoint("md")`
        text-align: left;
        margin-left: 0;
        margin-right: 0;
    `}
    cursor: pointer;
  justify-content: ${props => (props.spaceBetween ? "space-between" : "center")} !important;
`;

const ButtonTemplate: React.FC<LoadingButtonProps & Props> = (props: LoadingButtonProps & Props) => {
  return (
    <ButtonComponent {...props}>
      {props.iconLeft ? <props.iconLeft></props.iconLeft> : null}
      <p style={{ margin: "0 10px" }}>{props.text}</p>
      {props.iconRight ? <props.iconRight></props.iconRight> : null}
    </ButtonComponent>
  );
};

export default ButtonTemplate;
