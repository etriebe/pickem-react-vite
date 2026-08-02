import * as React from 'react';
import { Anchor, Button, Checkbox, Container, Group, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import AppTheme from '../theme/AppTheme';
import ForgotPassword from './ForgotPassword';
import SiteLogo from './SiteLogo';
import { AuthenticationUtilities } from '../utilities/AuthenticationUtilities';

type Props = {
  disableCustomTheme?: boolean;
};

export default function SignIn(props: Props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement | null;
    const password = document.getElementById('password') as HTMLInputElement | null;

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

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const rememberMe = (event.currentTarget.querySelector('input#rememberMe') as HTMLInputElement | null)?.checked;

    try {
      const loginResult = await AuthenticationUtilities.login(email, data.get('password') as string, rememberMe ?? false);

      if (loginResult.result) {
        window.location.href = '/myleagues';
      } else {
        setPasswordError(true);
        setPasswordErrorMessage(`Failed to login: ${loginResult.message}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setPasswordError(true);
      setPasswordErrorMessage('Unable to login at this time.');
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
              Sign in to your account
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
                  label="Password"
                  placeholder="••••••"
                  required
                  autoComplete="current-password"
                  error={passwordError ? passwordErrorMessage : undefined}
                />
                <Group position="apart" align="center">
                  <Checkbox id="rememberMe" label="Remember me" />
                  <Anchor component="button" type="button" size="sm" onClick={handleClickOpen}>
                    Forgot your password?
                  </Anchor>
                </Group>
                <Button type="submit" fullWidth>
                  Sign in
                </Button>
              </Stack>
            </form>
            <Text size="sm" align="center">
              Don&apos;t have an account?{' '}
              <Anchor href="/signup">Sign up</Anchor>
            </Text>
          </Stack>
        </Paper>
      </Container>
      <ForgotPassword open={open} handleClose={handleClose} />
    </AppTheme>
  );
}
