import { useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MainCard from '../../../components/MainCard';
import { LineChart } from '@mui/x-charts';
import { useState } from 'react';

export default function IncomeAreaChart({ monthlyData, weeklyData }) {
  const theme = useTheme();
  const [view, setView] = useState('monthly');
  const [visibility, setVisibility] = useState({ Income: true, Profit: true });

  const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const labels = view === 'monthly' ? monthlyLabels : weeklyLabels;
  const data = view === 'monthly' ? monthlyData : weeklyData;
  const incomeData = data?.series?.[0]?.data || [];
  const profitData = data?.series?.[1]?.data || [];

  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };
  const line = theme.palette.divider;

  const visibleSeries = [
    { data: incomeData, label: 'Income', showMark: false, area: true, id: 'Income', color: theme.palette.primary.main, visible: visibility.Income },
    { data: profitData, label: 'Profit', showMark: false, area: true, id: 'Profit', color: theme.palette.success.main, visible: visibility.Profit },
  ];

  return (
    <MainCard contentSX={{ p: 0 }}>
      <Box sx={{ px: 2.5, pt: 2.5 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="subtitle1">Unique Visitor</Typography></Grid>
          <Grid>
            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={() => setView('monthly')} color={view === 'monthly' ? 'primary' : 'secondary'} variant={view === 'monthly' ? 'outlined' : 'text'} sx={{ minWidth: 60 }}>Month</Button>
              <Button size="small" onClick={() => setView('weekly')} color={view === 'weekly' ? 'primary' : 'secondary'} variant={view === 'weekly' ? 'outlined' : 'text'} sx={{ minWidth: 60 }}>Week</Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ pt: 1, pr: 2 }}>
        <LineChart
          grid={{ horizontal: true }}
          xAxis={[{ scaleType: 'point', data: labels, disableLine: true, tickLabelStyle: axisFonstyle }]}
          yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
          height={450}
          margin={{ top: 40, bottom: 20, right: 20 }}
          series={visibleSeries.filter(s => s.visible).map(s => ({
            type: 'line', data: s.data, label: s.label, showMark: s.showMark, area: s.area, id: s.id,
            color: s.color, stroke: s.color, strokeWidth: 2,
          }))}
          slotProps={{ legend: { hidden: true } }}
          sx={{
            '& .MuiAreaElement-series-Income': { fill: `url('#gradInc')`, strokeWidth: 2, opacity: 0.8 },
            '& .MuiAreaElement-series-Profit': { fill: `url('#gradProf')`, strokeWidth: 2, opacity: 0.8 },
            '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: line },
          }}
        >
          <defs>
            <linearGradient id="gradInc" gradientTransform="rotate(90)">
              <stop offset="10%" stopColor={alpha(theme.palette.primary.main, 0.4)} />
              <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
            </linearGradient>
            <linearGradient id="gradProf" gradientTransform="rotate(90)">
              <stop offset="10%" stopColor={alpha(theme.palette.success.main, 0.4)} />
              <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
            </linearGradient>
          </defs>
        </LineChart>
      </Box>
      <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'center', pb: 2 }}>
        {visibleSeries.map(item => (
          <Stack key={item.label} direction="row" sx={{ gap: 1.25, alignItems: 'center', cursor: 'pointer' }}
            onClick={() => setVisibility(v => ({ ...v, [item.label]: !v[item.label] }))}>
            <Box sx={{ width: 12, height: 12, bgcolor: item.visible ? item.color : 'grey.500', borderRadius: '50%' }} />
            <Typography variant="body2" color="text.primary">{item.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </MainCard>
  );
}
