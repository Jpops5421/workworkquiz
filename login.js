import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Image from 'next/image';
import LoginForm from '../components/LoginForm';

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#004649] to-[#002829]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#004649] to-[#002829]">
      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={200}
          className="rounded-full shadow-lg"
        />
      </div>
      <LoginForm />
    </div>
  );
} 