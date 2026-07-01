import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SimpleBar from 'simplebar-react';
import { BrowserView, MobileView } from 'react-device-detect';
import 'simplebar-react/dist/simplebar.min.css';

const RootStyle = styled(BrowserView)({
  flexGrow: 1, height: '100%', overflow: 'hidden'
});

const SimpleBarStyle = styled(SimpleBar)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': { background: alpha(theme.palette.grey[500], 0.48) },
    '&.simplebar-visible:before': { opacity: 1 }
  },
  '& .simplebar-track': { zIndex: 1201, '&.simplebar-vertical': { width: 10 } },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': { height: 6 },
  '& .simplebar-mask': { zIndex: 'inherit' }
}));

export default function SimpleBarScroll({ children, sx, ...other }) {
  return (
    <>
      <RootStyle>
        <SimpleBarStyle clickOnTrack={false} sx={sx} data-simplebar-direction="ltr" {...other}>
          {children}
        </SimpleBarStyle>
      </RootStyle>
      <MobileView>
        <Box sx={{ overflowX: 'auto', ...sx }} {...other}>{children}</Box>
      </MobileView>
    </>
  );
}
