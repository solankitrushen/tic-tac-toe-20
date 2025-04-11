import CustomSocialButton from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomSocialButton';
import { Stack } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { signIn } from 'next-auth/react';

const AuthSocialButtons = ({ title, callbackUrl }) => (
  <>
    <Stack direction="row" gap={2} mt={3}>
      <CustomSocialButton
        onClick={async () => {
          await signIn('google');
        }}
      >
        <Avatar
          src={'/images/svgs/google-icon.svg'}
          alt={'icon1'}
          sx={{
            width: 16,
            height: 16,
            borderRadius: 0,
            mr: 1,
          }}
        />
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            whiteSpace: 'nowrap',
            mr: { sm: '3px' },
          }}
        >
          {title}{' '}
        </Box>{' '}
        Google
      </CustomSocialButton>
      <CustomSocialButton
        onClick={async () => {
          await signIn('google');
        }}
      >
        <Avatar
          src={'/images/svgs/github-mark-white.svg'}
          alt={'icon1'}
          sx={{
            width: 16,
            height: 16,
            borderRadius: 0,
            mr: 1,
          }}
        />
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            whiteSpace: 'nowrap',
            mr: { sm: '3px' },
          }}
        >
          {title}{' '}
        </Box>{' '}
        GitHub
      </CustomSocialButton>
    </Stack>
  </>
);

export default AuthSocialButtons;
