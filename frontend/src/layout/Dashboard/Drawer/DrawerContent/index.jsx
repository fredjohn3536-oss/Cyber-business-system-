import Box from '@mui/material/Box';
import SimpleBarScroll from '../../../../components/third-party/SimpleBar';
import Navigation from './Navigation';

export default function DrawerContent() {
  return (
    <SimpleBarScroll sx={{ '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
      <Box sx={{ p: '16px' }}>
        <Navigation />
      </Box>
    </SimpleBarScroll>
  );
}
