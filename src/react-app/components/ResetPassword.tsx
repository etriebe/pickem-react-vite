import * as React from 'react';
import { Button, Container, Group, Paper, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { useParams } from 'react-router';
import AppTheme from '../theme/AppTheme';
import SiteLogo from './SiteLogo';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import { ResetPasswordRequest } from '../services/PickemApiClient';

type Props = {
  disableCustomTheme?: boolean;
};

export default function ResetPassword(props: Props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const { resetCode } = useParams();

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement | null;
    const password = document.getElementById('password') as HTMLInputElement | null;
    const confirmPassword = document.getElementById('confirmpassword') as HTMLInputElement | null;

    let isValid = true;

    if (!email?.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password?.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!confirmPassword?.value || password?.value !== confirmPassword.value) {
      setPasswordError(true);
      setPasswordErrorMessage('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    try {
      const pickemClient = PickemApiClientFactory.createClient();
      const resetPasswordRequest = new ResetPasswordRequest();
      resetPasswordRequest.email = email;
      resetPasswordRequest.newPassword = password;
      resetPasswordRequest.resetCode = resetCode!;
      await pickemClient.resetPassword(resetPasswordRequest);
      window.location.href = '/';
    } catch (error) {
      console.error('Error while resetting password:', error);
      setEmailError(true);
      setEmailErrorMessage('Unable to reset password at this time.');
    }
  };

  return (
    <AppTheme {...props}>
      <Container size="xs" py="xl">
        <Paper shadow="md" radius="md" p="xl">
          <Stack spacing="lg">
            <Group position="center">
              <SiteLogo />
            </Group>
            <Title order={2} align="center">
              Reset your password
            </Title>
            <form onSubmit={handleSubmit} noValidate>
              <Stack spacing="md">
                <TextInput
                  id="email"
                  name="email"
                  label="Email"
                  placeholder="your@email.com"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                  error={emailError ? emailErrorMessage : undefined}
                />
                <PasswordInput
                  id="password"
                  name="password"
                  label="New password"
                  placeholder="••••••"
                  required
                  autoComplete="new-password"
                  error={passwordError ? passwordErrorMessage : undefined}
                />
                <PasswordInput
                  id="confirmpassword"
                  name="confirmpassword"
                  label="Confirm password"
                  placeholder="••••••"
                  required
                  autoComplete="new-password"
                  error={passwordError ? passwordErrorMessage : undefined}
                />
                <Button type="submit" fullWidth>
                  Reset password
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    </AppTheme>
  );
}
