import { Theme, Colors } from "@app/types/theme.type";
import base, { baseColors } from "./base";
const darkColors: Colors = {
    ...baseColors
}
export const darkTheme: Theme = {
    ...base,
    colors: darkColors
}