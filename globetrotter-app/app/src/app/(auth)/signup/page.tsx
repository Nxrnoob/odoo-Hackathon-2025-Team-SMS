import { AuthForm } from '@/components/auth/AuthForm';

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthForm mode="signup" />
    </div>
  );
}
