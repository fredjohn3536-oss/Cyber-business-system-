import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { BarChart } from '@mui/x-charts';

export default function SalesChart({ monthlyData }) {
  const theme = useTheme();
  const [showIncome, setShowIncome] = useState(true);
  const [showCost, setShowCost] = useState(true);

  const labels = monthlyData?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const incomeData = monthlyData?.series?.[0]?.data || [];
  const profitData = monthlyData?.series?.[1]?.data || [];
  const primaryColor = theme.palette.primary.main;
  const warningColor = theme.palette.warning.main;
  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  const totalProfit = profitData.reduce((a, b) => a + b, 0);

  const chartSeries = [
    { data: incomeData, label: 'Income', color: warningColor, visible: showIncome },
    { data: profitData, label: 'Profit', color: primaryColor, visible: showCost },
  ];

  return (
    <Box sx={{ p: 2.5, pb: 0 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Box>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Net Profit</Typography>
          <Typography variant="h4">TSh {totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
        </Box>
        <Stack direction="row">
          <FormControlLabel control={<Checkbox checked={showIncome} onChange={() => setShowIncome(!showIncome)} sx={{ '&.Mui-checked': { color: warningColor } }} />} label="Income" />
          <FormControlLabel control={<Checkbox checked={showCost} onChange={() => setShowCost(!showCost)} sx={{ '&.Mui-checked': { color: primaryColor } }} />} label="Profit" />
        </Stack>
      </Stack>
      <BarChart
        height={380}
        grid={{ horizontal: true }}
        xAxis={[{ data: labels, scaleType: 'band', tickLabelStyle: { ...axisFonstyle, fontSize: 12 } }]}
        yAxis={[{ disableLine: true, disableTicks: true, tickMaxStep: 20, tickLabelStyle: axisFonstyle }]}
        series={chartSeries.filter(s => s.visible).map(s => ({ data: s.data, label: s.label, color: s.color, type: 'bar' }))}
        slotProps={{ legend: { hidden: true }, bar: { rx: 5, ry: 5 } }}
        axisHighlight={{ x: 'none' }}
        margin={{ top: 30, left: 40, right: 10 }}
        tooltip={{ trigger: 'item' }}
        sx={{ '& .MuiBarElement-root:hover': { opacity: 0.6 }, '& .MuiChartsAxis-directionX .MuiChartsAxis-tick, & .MuiChartsAxis-root line': { stroke: theme.palette.divider } }}
      />
    </Box>
  );
}
