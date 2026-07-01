import { useMemo, useState, useEffect, createContext, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Palette from './palette';
import Typography from './typography';
import CustomShadows from './shadows';
import componentsOverride from './overrides';

export const ThemeContext = createContext({ mode: 'dark', toggleTheme: () => {} });

export function useThemeMode() {
  return useContext(ThemeContext);
}

export default function ThemeCustomization({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('app-theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('app-theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => setMode(prev => (prev === 'dark' ? 'light' : 'dark'));

  const theme = Palette(mode);
  const themeTypography = Typography(`'Public Sans', sans-serif`);
  const themeCustomShadows = useMemo(() => CustomShadows(theme), [theme]);

  const themeOptions = useMemo(
    () => ({
      breakpoints: { values: { xs: 0, sm: 768, md: 1024, lg: 1266, xl: 1440 } },
      direction: 'ltr',
      mixins: { toolbar: { minHeight: 60, paddingTop: 8, paddingBottom: 8 } },
      palette: theme.palette,
      customShadows: themeCustomShadows,
      typography: themeTypography
    }),
    [theme, themeTypography, themeCustomShadows]
  );

  const themes = createTheme(themeOptions);
  themes.components = componentsOverride(themes);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={themes}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
