import React from "react";
import styled from "styled-components";
import base from "../../styles/theme/base";
import { createBreakpoint } from "styled-components-breakpoint";
import { Alert, AlertProps } from "@mui/material";

type Props = {
  text: string;
  typeAlert: "info" | "success" | "error";
};

const AlertComponent = styled(Alert)<AlertProps & Props>``;

const AlertCustom: React.FC<AlertProps & Props> = (props: AlertProps & Props) => {
  return <AlertComponent {...props}>{props.text}</AlertComponent>;
};

export default AlertCustom;
