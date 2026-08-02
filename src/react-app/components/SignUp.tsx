import * as React from 'react';
import { Anchor, Button, Container, Group, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import AppTheme from '../theme/AppTheme';
import SiteLogo from './SiteLogo';
import { AuthenticationUtilities } from '../utilities/AuthenticationUtilities';
import { HttpValidationProblemDetails } from '../services/PickemApiClient';

type Props = {
  disableCustomTheme?: boolean;
};

export default function SignUp(props: Props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement | null;
    const password = document.getElementById('password') as HTMLInputElement | null;
    const name = document.getElementById('name') as HTMLInputElement | null;

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

    if (!name?.value || name.value.length < 1) {
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
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;

    try {
      const registerResult = await AuthenticationUtilities.register(email, data.get('password') as string);

      if (registerResult.result) {
        window.location.href = '/';
      } else {
        setEmailError(true);
        setEmailErrorMessage(`Failed to register: ${registerResult.message}`);
      }
    } catch (error) {
      console.error('Error during register:', error);

      if (error instanceof HttpValidationProblemDetails) {
        setEmailError(true);
        setEmailErrorMessage(`Failed to register: ${JSON.stringify(error.errors)}`);
      } else {
        setEmailError(true);
        setEmailErrorMessage('Failed to register at this time.');
      }
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
              Create a new account
            </Title>
            <form onSubmit={handleSubmit} noValidate>
              <Stack spacing="md">
                <TextInput
                  id="name"
                  name="name"
                  label="User name"
                  placeholder="jon_snow"
                  autoComplete="name"
                  required
                  error={nameError ? nameErrorMessage : undefined}
                />
                <TextInput
                  id="email"
                  name="email"
                  label="Email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  error={emailError ? emailErrorMessage : undefined}
                />
                <PasswordInput
                  id="password"
                  name="password"
                  label="Password"
                  placeholder="••••••"
                  autoComplete="new-password"
                  required
                  error={passwordError ? passwordErrorMessage : undefined}
                />
                <Button type="submit" fullWidth>
                  Sign up
                </Button>
              </Stack>
            </form>
            <Text size="sm" align="center">
              Already have an account?{' '}
              <Anchor href="/signin">Sign in</Anchor>
            </Text>
          </Stack>
        </Paper>
      </Container>
    </AppTheme>
  );
}
