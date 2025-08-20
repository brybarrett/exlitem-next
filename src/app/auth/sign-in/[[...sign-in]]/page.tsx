import { Metadata } from 'next';
import SignInViewPage from '@/components/common/sign-in-view';

export const metadata: Metadata = {
  title: 'Authentication | Sign In',
  description: 'Sign In page for authentication.'
};

export default function Page() {
  const stars = 3000; // Default value - remove API call that's causing build issues
  return <SignInViewPage stars={stars} />;
}
