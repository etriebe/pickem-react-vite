import { Button, Modal, Stack, Text, TextInput } from '@mantine/core';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import { ForgotPasswordRequest } from '../services/PickemApiClient';

type ForgotPasswordProps = {
  open: boolean;
  handleClose: () => void;
};

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  return (
    <Modal opened={open} onClose={handleClose} title="Reset password" centered>
      <Text mb="md">
        Enter your account&apos;s email address, and we&apos;ll send you a link to reset your password.
      </Text>
      <form
        onSubmit={async (event) => {
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
        <Stack spacing="md">
          <TextInput
            autoFocus
            required
            id="email"
            name="email"
            label="Email address"
            placeholder="Email address"
            type="email"
          />
          <Stack spacing="sm" align="flex-end">
            <Button variant="default" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </Stack>
        </Stack>
      </form>
    </Modal>
  );
}
