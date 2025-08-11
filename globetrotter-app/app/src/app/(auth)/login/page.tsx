import { AuthForm } from '@/components/auth/AuthForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthForm mode="login" />
    </div>
  );
}
