import { Button, Stack, Text } from '@mantine/core';
import { Component } from 'react';
import { queryClient } from '../main';

type Props = {};

type State = {};

function resetUserCache() {
    console.log(`Clearing react query cache.`);
    queryClient.clear();
    console.log(`Cache clear complete.`);
}

class Admin extends Component<Props, State> {
    state = {};

    render() {
        return (
            <Stack spacing="md">
                <Text size="xl" weight={700}>
                    Website Utilities
                </Text>
                <Button type="button" variant="filled" onClick={resetUserCache}>
                    Reset Cache
                </Button>
            </Stack>
        );
    }
}

export default Admin