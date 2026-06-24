'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ScreenLoader } from '@/components/common/screen-loader';
import { Demo8Layout } from '../components/layouts/demo8/layout';

export default function ProtectedLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <ScreenLoader />;
  }

  // Keep one layout boundary for every authenticated route. This avoids a
  // client-side layout switch (and the resulting layout flash) on navigation.
  return session ? (
    <div className="flex h-full w-full min-w-0 grow">
      <Demo8Layout>{children}</Demo8Layout>
    </div>
  ) : null;
}
