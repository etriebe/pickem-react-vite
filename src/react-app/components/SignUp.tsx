import { Box, Button, Card as MantineCard, Checkbox, Divider, Stack, TextInput, Anchor, Text, PasswordInput } from '@mantine/core';
import * as React from 'react';
import AppTheme from '../theme/AppTheme';
import SiteLogo from './SiteLogo';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import { RegisterRequest } from '../services/PickemApiClient';

const Card = (props: any) => (
  <MantineCard shadow="sm" radius="md" withBorder style={{ padding: 24, width: '100%', maxWidth: 450, margin: 'auto' }} {...props} />
);

const SignUpContainer = (props: any) => (
  <Stack style={{ minHeight: '100vh', padding: 16 }} justify="space-between" spacing="xl" {...props} />
);

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const name = document.getElementById('name') as HTMLInputElement;

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

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (nameError || emailError || passwordError) {
      event.preventDefault();
      return;
    }
    event.preventDefault(); // Prevent default form submission
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get('name'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      password: data.get('password'),
    });
    const pickemClient = PickemApiClientFactory.createClient();
    const body = new RegisterRequest();
    body.email = data.get('email') as string;
    body.password = data.get('password') as string;
    try {
      await pickemClient.register(body);
    }
    catch (error) {
      console.error('Error during registering:', error);
    }
  };

  return (
    <AppTheme {...props}>
      <SignUpContainer>
        <Card>
          <SiteLogo />
          <Box
            component="form"
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <TextInput
              id="name"
              name="name"
              required
              placeholder="jon_snow"
              label="User name"
              error={nameError}
              description={nameError ? nameErrorMessage : undefined}
            />

            <TextInput
              id="email"
              name="email"
              required
              placeholder="your@email.com"
              label="Email"
              error={emailError}
              description={emailError ? emailErrorMessage : undefined}
            />

            <PasswordInput
              id="password"
              name="password"
              required
              placeholder="••••••"
              label="Password"
              error={passwordError}
              description={passwordError ? passwordErrorMessage : undefined}
            />

            <Checkbox value="allowExtraEmails" label="I want to receive updates via email." />

            <Button type="submit" fullWidth onClick={validateInputs}>
              Sign up
            </Button>
          </Box>

          <Divider my="md" labelPosition="center">or</Divider>

          <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Text align="center">
              Already have an account?{' '}
              <Anchor href="/signin">Sign in</Anchor>
            </Text>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
