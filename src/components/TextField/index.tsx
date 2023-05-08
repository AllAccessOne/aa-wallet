import styled from "styled-components";
import base from "../../styles/theme/base";
import { createBreakpoint } from "styled-components-breakpoint";
import { TextField, TextFieldProps } from "@mui/material";

const breakpoint = createBreakpoint(base.breakpoints);

type Props = {
  text?: string;
  iconLeft?: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  backgroundColor?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  border?: string;
  gap?: string;
  fontSize?: string;
  styleTextField?: "default" | "typing" | "disable" | "successfull" | "error" | "typed";
};
const TextFieldComponent = styled(TextField)<TextFieldProps & Props>`
  height: ${props => props.height} !important;
  gap: ${props => props.gap} !important;
  line-height: ${props => props.height} !important;
  font-size: ${props => props.fontSize} !important;
  width: ${props => props.width};
  background-color: ${props => {
    if (props.styleTextField === "default") {
      return props.theme.colors.brands.blue500;
    } else if (props.styleTextField === "typing") {
      return props.theme.colors.white;
    } else if (props.styleTextField === "disable") {
      return "rgba(0, 0, 0, 0.1);";
    } else if (props.styleTextField === "successfull") {
      return "rgba(0, 0, 0, 0.1);";
    } else if (props.styleTextField === "error") {
      return "rgba(0, 0, 0, 0.1);";
    } else {
      return "#EDF4FE";
    }
  }} !important;
  font-family: "Inter", sans-serif !important;
  font-style: normal !important;
  height: 40px !important;
  border-radius: 8px !important;
  border: ${props => {
    return props.border;
  }} !important;
  ${breakpoint("xs")`
        display: none ! important;
    `}
  ${breakpoint("md")`
       display: block ! important;
    `}
`;

const TextFieldTemplate: React.FC<TextFieldProps & Props> = (props: TextFieldProps & Props) => {
  return <TextFieldComponent {...props}></TextFieldComponent>;
};

export default TextFieldTemplate;
