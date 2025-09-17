import { Box, Button, Card as MantineCard, Checkbox, Divider, Stack, TextInput, PasswordInput, Anchor, Text } from '@mantine/core';
import * as React from 'react';
import AppTheme from '../theme/AppTheme';
import ForgotPassword from './ForgotPassword';
import SiteLogo from './SiteLogo';
import { AuthenticationUtilities } from '../utilities/AuthenticationUtilities';

const Card = (props: any) => (
  <MantineCard shadow="sm" radius="md" withBorder style={{ padding: 24, width: '100%', maxWidth: 450, margin: 'auto' }} {...props} />
);

const SignInContainer = (props: any) => (
  <Stack style={{ minHeight: '100vh', padding: 16 }} justify="space-between" spacing="xl" {...props} />
);

export default function SignIn(props: { disableCustomTheme?: boolean }) {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    event.preventDefault(); // Prevent default form submission
    const email = data.get('email') as string;
    const rememberMe = (event.currentTarget.querySelector("input#rememberMe") as HTMLInputElement | null)?.checked;
    try {
      const loginResult = await AuthenticationUtilities.login(email, data.get('password') as string, rememberMe ?? false);

      if (loginResult.result) {
        // Redirect to My Leagues page on successful login
        console.log('Login successful:', JSON.stringify(loginResult));
        window.location.href = '/myleagues';
      } else {
        console.log('Login failed:', JSON.stringify(loginResult));
        setPasswordError(true);
        setPasswordErrorMessage(`Failed to login: ${loginResult.message}`);
      }
    }
    catch (error) {
      console.error('Error during login:', error);
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
      <SignInContainer>
        <Card>
          <SiteLogo />
          <Box
            component="form"
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 12 }}
          >
            <TextInput
              error={emailError}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              label="Email"
              description={emailError ? emailErrorMessage : undefined}
            />

            <PasswordInput
              error={passwordError}
              name="password"
              placeholder="••••••"
              id="password"
              autoComplete="current-password"
              required
              label="Password"
              description={passwordError ? passwordErrorMessage : undefined}
            />

            <Checkbox id="rememberMe" label="Remember me" />

            <ForgotPassword open={open} handleClose={handleClose} />

            <Button type="submit" fullWidth onClick={validateInputs}>
              Sign in
            </Button>

            <Anchor component="button" type="button" onClick={handleClickOpen}>
              Forgot your password?
            </Anchor>
          </Box>

          <Divider label="or" labelPosition="center" my="md" />

          <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Text align="center">
              Don&apos;t have an account?{' '}
              <Anchor href="/signup">Sign up</Anchor>
            </Text>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
