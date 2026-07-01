import { createTheme } from '@mui/material/styles';
import { presetPalettes } from '@ant-design/colors';
import ThemeOption from './theme';

export default function Palette(mode) {
  const colors = presetPalettes;

  let greyPrimary, greyAscent, greyConstant;

  if (mode === 'dark') {
    greyPrimary = [
      '#1a1a2e', '#16213e', '#0f3460', '#1a1a2e', '#2d2d44',
      '#3d3d5c', '#5c5c7a', '#8a8aa0', '#b0b0c0', '#d0d0e0', '#e8e8f0'
    ];
    greyAscent = ['#2d2d44', '#5c5c7a', '#8a8aa0', '#b0b0c0'];
    greyConstant = ['#1a1a2e', '#0f3460'];
  } else {
    greyPrimary = [
      '#ffffff', '#fafafa', '#f5f5f5', '#f0f0f0', '#d9d9d9',
      '#bfbfbf', '#8c8c8c', '#595959', '#262626', '#141414', '#000000'
    ];
    greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
    greyConstant = ['#fafafb', '#e6ebf1'];
  }

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor = ThemeOption(colors);

  const greyColors = {
    0: colors.grey[0], 50: colors.grey[1], 100: colors.grey[2], 200: colors.grey[3],
    300: colors.grey[4], 400: colors.grey[5], 500: colors.grey[6], 600: colors.grey[7],
    700: colors.grey[8], 800: colors.grey[9], 900: colors.grey[10],
    A50: colors.grey[15], A100: colors.grey[11], A200: colors.grey[12], A400: colors.grey[13],
    A700: colors.grey[14], A800: colors.grey[16]
  };

  return createTheme({
    palette: {
      mode,
      common: { black: '#000', white: '#fff' },
      ...paletteColor,
      text: {
        primary: mode === 'dark' ? '#e8e8f0' : greyColors[700],
        secondary: mode === 'dark' ? '#8a8aa0' : greyColors[500],
        disabled: mode === 'dark' ? '#5c5c7a' : greyColors[400]
      },
      action: { disabled: greyColors[300] },
      divider: greyColors[200],
      background: {
        paper: mode === 'dark' ? '#0d1117' : greyColors[0],
        default: mode === 'dark' ? '#010409' : greyColors.A50
      }
    }
  });
}
