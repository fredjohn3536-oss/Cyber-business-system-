import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';

export default function MainCard({
  children,
  title,
  subheader,
  secondary,
  elevation = 0,
  border = true,
  divider = true,
  content = true,
  contentSX = {},
  sx = {},
  ...props
}) {
  const theme = useTheme();
  return (
    <Card
      elevation={elevation}
      sx={{
        border: border ? '1px solid' : 'none',
        borderColor: theme.palette.divider,
        borderRadius: 1,
        position: 'relative',
        ...sx,
      }}
      {...props}
    >
      {title && (
        <CardHeader
          title={title}
          subheader={subheader}
          action={secondary}
          sx={{ '& .MuiCardHeader-title': { fontSize: '1rem', fontWeight: 600 } }}
        />
      )}
      {title && divider && <Divider />}
      {content ? <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, ...contentSX }}>{children}</CardContent> : children}
    </Card>
  );
}
