import { Group, Image, Text } from '@mantine/core';
import siteLogo from '../assets/logo.png';

export default function SiteLogo() {
  const goHome = () => () => {
    window.location.href = '/';
  };

  return (
    <Group
      position="apart"
      align="center"
      spacing="sm"
      sx={{
        width: '100%',
        justifyContent: 'space-between',
        maxWidth: '1700px',
        maxHeight: 100,
        paddingTop: 24,
        cursor: 'pointer',
      }}
      onClick={goHome()}
    >
      <Image src={siteLogo} alt="Site Logo" width={64} height={64} />
      <Text component="h1" size="xl" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
        Just Pick'em
      </Text>
    </Group>
  );
}
