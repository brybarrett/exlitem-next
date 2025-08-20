import { Metadata } from 'next';
import SignUpViewPage from '@/components/common/sign-up-view';

export const metadata: Metadata = {
  title: 'Authentication | Sign Up',
  description: 'Sign Up page for authentication.'
};

export default function Page() {
  const stars = 3000; // Default value - remove API call that's causing build issues
  return <SignUpViewPage stars={stars} />;
}
