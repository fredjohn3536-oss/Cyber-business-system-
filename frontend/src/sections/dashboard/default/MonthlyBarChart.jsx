import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts';

export default function MonthlyBarChart({ weeklyData }) {
  const theme = useTheme();
  const labels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const data = weeklyData?.series?.[0]?.data || [0, 0, 0, 0, 0, 0, 0];
  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <BarChart
      height={380}
      series={[{ data, label: 'Income' }]}
      xAxis={[{ data: labels, scaleType: 'band', disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
      leftAxis={null}
      slotProps={{ legend: { hidden: true }, bar: { rx: 5, ry: 5 } }}
      axisHighlight={{ x: 'none' }}
      margin={{ left: 20, right: 20 }}
      colors={[theme.palette.info.light]}
      sx={{ '& .MuiBarElement-root:hover': { opacity: 0.6 } }}
    />
  );
}
