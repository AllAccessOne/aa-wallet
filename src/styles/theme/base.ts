import { Radii, FontWeights, LineHeights, FontSizes, Spacing, Position, Colors, Breakpoints } from "../../types/theme.type";

const radii: Radii = {
  xs: 0,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 100,
};

const lineHeights: LineHeights = {
  sm: 24,
  md: 30,
  lg: 32,
};
const fontWeights: FontWeights = {
  thin: 100,
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};
const fontSizes: FontSizes = {
  xxs: 14,
  xs: 16,
  sm: 18,
  md: 20,
  lg: 22,
  xl: 24,
  xxl: 28,
  xxxl: 32,
  xxxxl: 42,
};
const spacing: Spacing = {
  xs: 10,
  sm: 20,
  md: 100,
  lg: 200,
  xl: 300,
  auto: "auto",
};
const position: Position = {
  left: "left",
  right: "right",
  center: "center",
};

const breakpoints: Breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

export default {
  radii,
  fontSizes,
  lineHeights,
  fontWeights,
  spacing,
  position,
  breakpoints,
};
export const baseColors: Colors = {
  white: "#FFFFFF",
  black: "#000000",
  brands: {
    blue100: "#D7E4FF",
    blue200: "#CDDDFF",
    blue300: "#8DB0FB",
    blue400: "#6792F4",
    blue500: "#3062D4",
    blue600: "#2759CD",
    blue700: "#1E50C0",
    blue800: "#113997",
    blue900: "#05205E",
  },
  neutrals: {
    gray100: "#F7FAFC",
    gray200: "#EDF2F7",
    gray300: "#E2E8F0",
    gray400: "#CBD5E0",
    gray500: "#A0AEC0",
    gray600: "#718096",
    gray700: "#4A5568",
    gray800: "#2D3748",
    gray900: "#1A202C",
    gray1000: "#171923",
  },
  system: {
    green100: "#D8F8E7",
    green200: "#C6F1DA",
    green300: "#C2EBD5",
    green400: "#75CC9E",
    green500: "#4AA578",
    green600: "#1D7C4D",
    green700: "#1E714A",
    green800: "#196742",
    green900: "#0E4E30",
    green1000: "#062D1B",
    red100: "#FEE6E6",
    red200: "#FCD9D9",
    red300: "#FCCFCF",
    red400: "#F49090",
    red500: "#F26464",
    red600: "#C53434",
    red700: "#A13636",
    red800: "#952D2D",
    red900: "#6F2020",
    red1000: "#4A0D0D",
  },
};
