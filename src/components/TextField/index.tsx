import styled from "styled-components";
import { TextField, TextFieldProps } from "@mui/material";

type Props = {
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
  width?: string;
  height?: string;
  borderRadius?: string;
  border?: string;
  gap?: string;
  fontSize?: string;
  styleTextField?: "default" | "typing" | "disable" | "successfull" | "error" | "typed";
  label?: string;
};
const TextFieldComponent = styled(TextField)<TextFieldProps & Props>`
  background-color: ${props => {
    if (props.styleTextField === "default") {
      return props.theme.colors.white;
    } else if (props.styleTextField === "typing") {
      return props.theme.colors.white;
    } else if (props.styleTextField === "disable") {
      return "#ECECED";
    } else if (props.styleTextField === "successfull") {
      return "rgba(0, 0, 0, 0.1);";
    } else if (props.styleTextField === "error") {
      return "rgba(0, 0, 0, 0.1);";
    } else {
      return "#EDF4FE";
    }
  }} !important;

  .css-8j6b76-MuiInputBase-root-MuiOutlinedInput-root {
    border-radius: 8px !important;
    height: ${props => props.height} !important;
    gap: ${props => props.gap} !important;
    line-height: ${props => props.height} !important;

    font-size: ${props => props.fontSize} !important;

    font-family: "Inter", sans-serif !important;

    font-style: normal !important;
    border: ${props => {
      return props.border;
    }} !important;
    width: ${props => props.width} !important;
  }
  .css-md26zr-MuiInputBase-root-MuiOutlinedInput-root {
    border-radius: 8px !important;
  }
  .css-1ua80n0-MuiInputBase-input-MuiOutlinedInput-input {
    padding-left: 5px !important;
  }
  .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root {
    border-radius: 8px !important;
  }
  border-radius: 8px !important;
`;
const TextFieldContainer = styled.div<Props>`
  width: ${props => props.width} !important;
`;
const TextFieldTemplate = (props: TextFieldProps & Props) => {
  return <TextFieldComponent {...props}></TextFieldComponent>;
};

export default TextFieldTemplate;
