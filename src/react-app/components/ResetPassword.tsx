import { Box, Button, Card as MantineCard, Stack, TextInput, PasswordInput } from '@mantine/core';
import * as React from 'react';
import AppTheme from '../theme/AppTheme';
import SiteLogo from './SiteLogo';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import { useParams } from 'react-router';
import { ResetPasswordRequest } from '../services/PickemApiClient';

const Card = (props: any) => (
  <MantineCard shadow="sm" radius="md" withBorder style={{ padding: 24, width: '100%', maxWidth: 450, margin: 'auto' }} {...props} />
);

const ResetPasswordContainer = (props: any) => (
  <Stack style={{ minHeight: '100vh', padding: 16 }} justify="space-between" spacing="xl" {...props} />
);

export default function ResetPassword(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const {resetCode} = useParams();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    const password = data.get('password') as string;
    const confirmPassword = data.get('confirmpassword') as string;

    if (password !== confirmPassword) {
      setPasswordError(true);
      setPasswordErrorMessage('Passwords do not match.');
      event.preventDefault();
      return;
    }

    event.preventDefault(); // Prevent default form submission
    const email = data.get('email') as string;
    try {
      const pickemClient = PickemApiClientFactory.createClient();
      const resetPasswordRequest = new ResetPasswordRequest();
      resetPasswordRequest.email = email;
      resetPasswordRequest.newPassword = data.get('password') as string;
      resetPasswordRequest.resetCode = resetCode!;
      await pickemClient.resetPassword(resetPasswordRequest);
      window.location.href = '/';
    }
    catch (error) {
      console.error('Error while resetting password:', error);
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <ResetPasswordContainer>
        <Card>
          <SiteLogo />
          <Box
            component="form"
            onSubmit={handleSubmit}
            method="post"
            noValidate
            style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 12 }}
          >
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              label="Email"
              error={emailError}
              description={emailError ? emailErrorMessage : undefined}
            />

            <PasswordInput
              id="password"
              name="password"
              placeholder="••••••"
              type="password"
              autoComplete="current-password"
              required
              label="Password"
              error={passwordError}
              description={passwordError ? passwordErrorMessage : undefined}
            />

            <PasswordInput
              id="confirmpassword"
              name="confirmpassword"
              placeholder="••••••"
              type="password"
              autoComplete="confirm-password"
              required
              label="Confirm Password"
              error={passwordError}
              description={passwordError ? passwordErrorMessage : undefined}
            />

            <Button type="submit" fullWidth onClick={validateInputs}>
              Reset Password
            </Button>
          </Box>
        </Card>
      </ResetPasswordContainer>
    </AppTheme>
  );
}
