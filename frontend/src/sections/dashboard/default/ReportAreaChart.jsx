import { useTheme } from '@mui/material/styles';
import { LineChart, chartsGridClasses } from '@mui/x-charts';

export default function ReportAreaChart({ data: chartData }) {
  const theme = useTheme();
  const data = chartData?.series?.[1]?.data?.slice(0, 7) || [58, 115, 28, 83, 63, 75, 35];
  const labels = chartData?.labels?.slice(0, 7) || ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const axisFonstyle = { fill: theme.palette.text.secondary };

  return (
    <LineChart
      grid={{ horizontal: true }}
      xAxis={[{ data: labels, scaleType: 'point', disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
      yAxis={[{ tickMaxStep: 10 }]}
      leftAxis={null}
      series={[{ data, showMark: false, id: 'ReportAreaChart', color: theme.palette.warning.main }]}
      slotProps={{ legend: { hidden: true } }}
      height={340}
      margin={{ top: 30, bottom: 50, left: 20, right: 20 }}
      sx={{ '& .MuiLineElement-root': { strokeWidth: 1 }, [`& .${chartsGridClasses.line}`]: { strokeDasharray: '5 3' } }}
    />
  );
}
