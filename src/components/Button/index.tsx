import React from "react";
import styled from "styled-components";
import base from "../../styles/theme/base";
import { createBreakpoint } from "styled-components-breakpoint";
import { Button, ButtonProps } from "@mui/material";

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
  backgroundColor?: string;
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
};

const ButtonComponent = styled(Button)<ButtonProps & Props>`
  width: ${props => props.width};
  height: ${props => props.height};
  border-radius: ${props => props.theme.radii.sm + "px"} !important;
  background-color: ${props => {
    if (props.styleButton === "primary") {
      return props.theme.colors.brands.blue500;
    } else if (props.styleButton === "default") {
      return props.theme.colors.white;
    } else if (props.styleButton === "inactive") {
      return "rgba(0, 0, 0, 0.1);";
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
  color: ${props => {
    if (props.styleButton === "primary") {
      return "#FFF";
    } else if (props.styleButton === "default") {
      return props.theme.colors.neutrals.gray700;
    } else if (props.styleButton === "inactive") {
      return "#000";
    } else {
      return props.theme.colors.brands.blue500;
    }
  }} !important;
  padding: ${props => props.padding} !important;
  gap: ${props => props.gap} !important;
  display: flex;
  justify-content: center;
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
`;

const ButtonTemplate: React.FC<ButtonProps & Props> = (props: ButtonProps & Props) => {
  return (
    <ButtonComponent {...props}>
      {props.iconLeft ? <props.iconLeft></props.iconLeft> : null}
      <p style={{ margin: "0 10px" }}>{props.text}</p>
      {props.iconRight ? <props.iconRight></props.iconRight> : null}
    </ButtonComponent>
  );
};

export default ButtonTemplate;
