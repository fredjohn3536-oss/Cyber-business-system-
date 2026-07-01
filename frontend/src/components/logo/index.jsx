import { Link } from 'react-router-dom';
import ButtonBase from '@mui/material/ButtonBase';
import { APP_DEFAULT_PATH } from '../../config';

export default function LogoSection({ reverse, isIcon, sx, to }) {
  return (
    <ButtonBase disableRipple component={Link} to={to || APP_DEFAULT_PATH} sx={sx}>
      {isIcon ? <LogoIcon /> : <LogoMain reverse={reverse} />}
    </ButtonBase>
  );
}

function LogoMain() {
  return (
    <svg width="118" height="35" viewBox="0 0 118 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="28" fontSize="22" fontWeight="700" fill="currentColor">BizHub</text>
    </svg>
  );
}

function LogoIcon() {
  return (
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="35" height="35" rx="8" fill="currentColor" opacity="0.15" />
      <text x="7" y="25" fontSize="18" fontWeight="700" fill="currentColor">B</text>
    </svg>
  );
}
