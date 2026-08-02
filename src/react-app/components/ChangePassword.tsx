import React from 'react';
import { Button, Card, Container, PasswordInput, Stack, Text } from '@mantine/core';
import AppTheme from '../theme/AppTheme';
import SiteLogo from './SiteLogo';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import { InfoRequest } from '../services/PickemApiClient';

type Props = { disableCustomTheme?: boolean };

export default function ChangePassword(props: Props) {
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordError) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const password = data.get('password') as string;
    const confirmPassword = data.get('confirmpassword') as string;

    if (password !== confirmPassword) {
      setPasswordError(true);
      setPasswordErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const pickemClient = PickemApiClientFactory.createClient();
      const changePasswordRequest = new InfoRequest();
      changePasswordRequest.oldPassword = data.get('oldpassword') as string;
      changePasswordRequest.newPassword = password;
      await pickemClient.infoPOST(changePasswordRequest);
      window.location.href = '/';
    } catch (error) {
      console.error('Error while changing password:', error);
    }
  };

  const validateInputs = () => {
    const password = document.getElementById('password') as HTMLInputElement;

    if (!password?.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      return false;
    }

    setPasswordError(false);
    setPasswordErrorMessage('');
    return true;
  };

  return (
    <AppTheme {...props}>
      <Container size="sm" py="xl">
        <Card shadow="sm" p="xl" radius="md">
          <Stack spacing="xl">
            <SiteLogo />
            <Text size="xl" weight={700}>Change Password</Text>
            <form onSubmit={handleSubmit}>
              <Stack spacing="md">
                <PasswordInput
                  label="Old Password"
                  id="oldpassword"
                  name="oldpassword"
                  placeholder="••••••"
                  required
                />
                <PasswordInput
                  label="New Password"
                  id="password"
                  name="password"
                  placeholder="••••••"
                  required
                  error={passwordError ? passwordErrorMessage : undefined}
                />
                <PasswordInput
                  label="Confirm Password"
                  id="confirmpassword"
                  name="confirmpassword"
                  placeholder="••••••"
                  required
                  error={passwordError ? passwordErrorMessage : undefined}
                />
                <Button type="submit" fullWidth onClick={validateInputs}>
                  Change Password
                </Button>
              </Stack>
            </form>
          </Stack>
        </Card>
      </Container>
    </AppTheme>
  );
}
