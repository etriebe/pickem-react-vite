import * as React from 'react';
import { Modal, Button, TextInput, Stack, Text } from '@mantine/core';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import { ForgotPasswordRequest } from '../services/PickemApiClient';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  return (
    <Modal opened={open} onClose={handleClose} title="Reset password" centered size="sm">
      <form
        onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const email = data.get('email') as string;

          try {
            const pickemClient = PickemApiClientFactory.createClient();
            const returnUrl = window.location.origin + '/resetpassword/##RESETCODE##';
            const body = new ForgotPasswordRequest();
            body.email = email;
            await pickemClient.forgotPassword(returnUrl, body);
          } catch (error) {
            console.error('Error sending forgot password request:', error);
          }

          handleClose();
        }}
      >
        <Stack spacing="sm">
          <Text>
            Enter your account's email address, and we'll send you a link to
            reset your password.
          </Text>
          <TextInput
            autoFocus
            required
            id="email"
            name="email"
            placeholder="Email address"
            type="email"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8 }}>
            <Button variant="default" onClick={handleClose}>Cancel</Button>
            <Button type="submit">Continue</Button>
          </div>
        </Stack>
      </form>
    </Modal>
  );
}
