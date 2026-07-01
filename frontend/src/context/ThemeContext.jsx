import React, { createContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = createContext({ mode: 'dark', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('app-theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('app-theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => setMode(prev => (prev === 'dark' ? 'light' : 'dark'));

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb' },
            secondary: { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed' },
            success: { main: '#22c55e', light: '#4ade80', dark: '#16a34a' },
            warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
            error: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
            info: { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
            background: { default: '#f0f2f5', paper: '#ffffff' },
            divider: '#e0e0e0',
            text: { primary: '#212121', secondary: '#757575' },
          }
        : {
            primary: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb' },
            secondary: { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed' },
            success: { main: '#22c55e', light: '#4ade80', dark: '#16a34a' },
            warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
            error: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
            info: { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
            background: { default: '#09090b', paper: '#18181b' },
            divider: '#27272a',
            text: { primary: '#f8fafc', secondary: '#a1a1aa' },
          }),
    },
    typography: {
      fontFamily: "'Inter', system-ui, sans-serif",
      h3: { fontWeight: 700 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 600, fontSize: '1rem' },
      subtitle2: { fontWeight: 600, fontSize: '0.875rem' },
      body2: { fontSize: '0.875rem' },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
      MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 } } },
      MuiChip: { styleOverrides: { root: { borderRadius: 8 } } },
      MuiTableCell: { styleOverrides: { head: { fontWeight: 600 } } },
    },
  }), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
