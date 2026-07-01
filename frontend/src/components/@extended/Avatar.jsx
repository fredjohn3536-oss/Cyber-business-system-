import { styled } from '@mui/material/styles';
import MuiAvatar from '@mui/material/Avatar';
import getColors from '../../utils/getColors';

function getColorStyle({ theme, color }) {
  const colors = getColors(theme, color);
  return { color: colors.main, background: colors.lighter };
}

function getSizeStyle(size) {
  switch (size) {
    case 'badge': return { fontSize: '0.675rem', width: 20, height: 20 };
    case 'xs': return { fontSize: '0.75rem', width: 24, height: 24 };
    case 'sm': return { fontSize: '0.875rem', width: 32, height: 32 };
    case 'lg': return { fontSize: '1.2rem', width: 52, height: 52 };
    case 'xl': return { fontSize: '1.5rem', width: 64, height: 64 };
    default: return { fontSize: '1rem', width: 40, height: 40 };
  }
}

const AvatarStyle = styled(MuiAvatar, { shouldForwardProp: (prop) => prop !== 'color' && prop !== 'size' })(
  ({ theme, size, color }) => ({
    ...getSizeStyle(size),
    ...getColorStyle({ theme, color }),
  })
);

export default function Avatar({ children, color = 'primary', size = 'md', ...others }) {
  return <AvatarStyle color={color} size={size} {...others}>{children}</AvatarStyle>;
}
