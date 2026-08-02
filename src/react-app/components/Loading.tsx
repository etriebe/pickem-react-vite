import { Group, Loader, Text } from '@mantine/core';


export default function Loading() {
  return (
    <Group spacing="sm" align="center">
      <Text weight={500}>Loading...</Text>
      <Loader size="sm" />
    </Group>
  );
}
