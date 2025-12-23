import Stack from '@mui/material/Stack';
import siteLogo from '../assets/logo.png';
import Typography from '@mui/material/Typography';

export default function SiteLogo() {
  const goHome = () => () => {
    window.location.href = '/';
  };
    return (
        <Stack
            direction="row"
            sx={{
                display: 'flex',
                width: '100%',
                alignItems: { md: 'center' },
                justifyContent: 'space-between',
                maxWidth: { sm: '100%', md: '1700px' },
                maxHeight: { sm: '64px', md: '80px', lg: '100px' },
                pt: 1.5,
            }}
            onClick={goHome()}
            spacing={2}
        >
            <img
                src={siteLogo}
                alt="Site Logo"
                style={{ width: 64, height: 64, alignSelf: 'center', marginBottom: 8 }}
            />
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
                Just Pick'em
            </Typography>
        </Stack>
    );
}
