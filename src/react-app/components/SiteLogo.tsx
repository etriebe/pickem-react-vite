import { Group, Title } from '@mantine/core';
import siteLogo from '../assets/logo.png';

export default function Header() {
    return (
        <Group position="apart" style={{ width: '100%', alignItems: 'center', paddingTop: 12, maxWidth: '1700px' }}>
            <img
                src={siteLogo}
                alt="Site Logo"
                style={{ width: 64, height: 64, alignSelf: 'center', marginBottom: 8 }}
            />
            <Title order={4} style={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
                Just Pick'em
            </Title>
        </Group>
    );
}
