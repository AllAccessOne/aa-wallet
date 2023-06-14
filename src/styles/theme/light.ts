import { Theme, Colors } from "@app/types/theme.type";
import base, { baseColors } from "./base";

const lightColors: Colors = {
  ...baseColors,
};
export const lightTheme: Theme = {
  ...base,
  colors: lightColors,
};
