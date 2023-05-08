export type Theme = {
  radii: Radii;
  fontWeights: FontWeights;
  lineHeights: LineHeights;
  fontSizes: FontSizes;
  spacing: Spacing;
  colors: Colors;
  position: Position;
};
export type FontSizes = {
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  xxxxl: number;
};
export type Spacing = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  auto: string;
};

export type FontWeights = {
  thin: number;
  extraLight: number;
  light: number;
  regular: number;
  medium: number;
  semiBold: number;
  bold: number;
  extraBold: number;
  black: number;
};
export type Radii = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};
export type LineHeights = {
  sm: number;
  md: number;
  lg: number;
};

export type Position = {
  left: string;
  right: string;
  center: string;
};
export type Colors = {
  white: string;
  black: string;
  brands: {
    blue900: string;
    blue800: string;
    blue700: string;
    blue600: string;
    blue500: string;
    blue400: string;
    blue300: string;
    blue200: string;
    blue100: string;
  };
  neutrals: {
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray800: string;
    gray900: string;
    gray1000: string;
  };
  system: {
    green100: string;
    green200: string;
    green300: string;
    green400: string;
    green500: string;
    green600: string;
    green700: string;
    green800: string;
    green900: string;
    green1000: string;
    red100: string;
    red200: string;
    red300: string;
    red400: string;
    red500: string;
    red600: string;
    red700: string;
    red800: string;
    red900: string;
    red1000: string;
  };
};
export type Breakpoints = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};
