import { Group, Loader, Text } from '@mantine/core';

export default function Loading() {
    return (
        <Group>
            <Text weight={600} style={{ marginRight: 8 }}>Loading...</Text>
            <Loader size="sm" />
        </Group>
    );
}