import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import QuickreplyIcon from '@mui/icons-material/Quickreply';
import { useNavigate } from 'react-router-dom';
import { NavbarPropsType } from '../../typing';

export default function Navbar({
  links,
  handleMenuItemClick,
}: NavbarPropsType) {
  const navigate = useNavigate();
  return (
    <>
      <QuickreplyIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      <Typography
        variant="h6"
        noWrap
        sx={{
          mr: 2,
          display: { xs: 'none', md: 'flex' },
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.1rem',
          color: 'inherit',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        LINKUP
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: 'none', md: 'flex' },
        }}
      >
        {links
          .filter((link) => link.needsAuth)
          .map((link) => (
            <Button
              color="inherit"
              key={link.name}
              onClick={() => {
                handleMenuItemClick(link);
              }}
              sx={{ my: 2, display: 'block' }}
            >
              {link.name}
            </Button>
          ))}
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'flex-end',
        }}
      >
        {links
          .filter((link) => !link.needsAuth)
          .map((link) => (
            <Button
              color="inherit"
              key={link.name}
              onClick={() => {
                handleMenuItemClick(link);
              }}
              sx={{ my: 2, display: 'block' }}
            >
              {link.name}
            </Button>
          ))}
      </Box>
    </>
  );
}
