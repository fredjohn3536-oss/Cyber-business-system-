import MuiIconButton from '@mui/material/IconButton';
import { alpha, styled } from '@mui/material/styles';
import { forwardRef } from 'react';

const IconButtonStyle = styled(MuiIconButton, { shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'shape' })(
  ({ theme, color, variant }) => ({
    position: 'relative',
    variants: [
      { props: { shape: 'rounded' }, style: { borderRadius: '50%' } },
      { props: { variant: 'outlined' }, style: { border: '1px solid', borderColor: 'inherit' } },
      { props: { variant: 'dashed' }, style: { border: '1px dashed', borderColor: 'inherit' } },
    ]
  })
);

function IconButton({ variant = 'text', shape = 'square', children, color = 'primary', ...others }, ref) {
  return (
    <IconButtonStyle ref={ref} disableRipple variant={variant} shape={shape} color={color} {...others}>
      {children}
    </IconButtonStyle>
  );
}

export default forwardRef(IconButton);
