import { merge } from 'lodash-es';

const Badge = () => ({
  MuiBadge: { styleOverrides: { root: { fontSize: '0.75rem' } } }
});

const Button = () => ({
  MuiButton: { styleOverrides: { root: { fontWeight: 500, borderRadius: 8 } } }
});

const CardContent = () => ({
  MuiCardContent: { styleOverrides: { root: { padding: 16, '&:last-child': { paddingBottom: 16 } } } }
});

const Chip = () => ({
  MuiChip: { styleOverrides: { root: { borderRadius: 8 } } }
});

const Paper = () => ({
  MuiPaper: {
    styleOverrides: {
      root: {
        transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
      }
    }
  }
});

const Drawer = () => ({
  MuiDrawer: {
    styleOverrides: {
      paper: {
        border: 'none',
        transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
      }
    }
  }
});

const IconButton = (theme) => ({
  MuiIconButton: {
    styleOverrides: { root: { '&:hover': { backgroundColor: 'transparent' } } }
  }
});

const InputLabel = () => ({
  MuiInputLabel: { styleOverrides: { root: { zIndex: 0 } } }
});

const ListItemButton = () => ({
  MuiListItemButton: {
    styleOverrides: { root: { borderRadius: 8 } }
  }
});

const ListItemIcon = () => ({
  MuiListItemIcon: { styleOverrides: { root: { minWidth: 28 } } }
});

const OutlinedInput = () => ({
  MuiOutlinedInput: {
    styleOverrides: {
      root: { borderRadius: 8 },
      input: { padding: '10.5px 14px' }
    }
  }
});

const Tab = (theme) => ({
  MuiTab: {
    styleOverrides: {
      root: {
        minHeight: 46,
        color: theme.palette.text.primary,
        borderRadius: 4,
        '&:hover': { backgroundColor: theme.palette.action.hover }
      }
    }
  }
});

const TableCell = () => ({
  MuiTableCell: { styleOverrides: { root: { padding: '12px 16px' } } }
});

const TableRow = () => ({
  MuiTableRow: {
    styleOverrides: { root: { '&:last-child td': { borderBottom: 0 } } }
  }
});

const Tooltip = () => ({
  MuiTooltip: {
    styleOverrides: { tooltip: { borderRadius: 4 } }
  }
});

const Typography = () => ({
  MuiTypography: {
    styleOverrides: {
      root: { '&.MuiTypography-caption': { fontSize: '0.75rem' } }
    }
  }
});

export default function ComponentsOverrides(theme) {
  return merge(
    Badge(theme),
    Button(theme),
    CardContent(),
    Chip(theme),
    Drawer(),
    IconButton(theme),
    InputLabel(),
    ListItemButton(),
    ListItemIcon(),
    OutlinedInput(),
    Paper(),
    Tab(theme),
    TableCell(),
    TableRow(),
    Tooltip(theme),
    Typography()
  );
}
