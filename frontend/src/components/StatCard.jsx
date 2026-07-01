import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useTheme, alpha } from '@mui/material/styles';
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';

const iconSX = { fontSize: '0.75rem', color: 'inherit', marginLeft: 0, marginRight: 0 };

export default function StatCard({
  color = 'primary',
  title,
  count,
  percentage,
  isLoss,
  extra,
  icon,
}) {
  const theme = useTheme();
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: theme.palette.divider, borderRadius: 1 }}>
      <CardContent sx={{ p: 2.25, '&:last-child': { pb: 2.25 } }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Grid container alignItems="center">
            <Grid size="grow">
              <Stack direction="row" alignItems="center" spacing={1}>
                {icon && <Box sx={{ color: `${color}.main`, display: 'flex' }}>{icon}</Box>}
                <Typography variant="h4" color="inherit">{count}</Typography>
              </Stack>
            </Grid>
            {percentage && (
              <Grid>
                <Chip
                  variant="filled"
                  color={color}
                  icon={isLoss ? <FallOutlined style={iconSX} /> : <RiseOutlined style={iconSX} />}
                  label={`${percentage}%`}
                  sx={{
                    ml: 1.25, pl: 1,
                    bgcolor: alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.15),
                    color: `${color}.main`,
                    fontWeight: 600,
                  }}
                  size="small"
                />
              </Grid>
            )}
          </Grid>
        </Stack>
        {extra && (
          <Box sx={{ pt: 2.25 }}>
            <Typography variant="caption" color="text.secondary">{extra}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
