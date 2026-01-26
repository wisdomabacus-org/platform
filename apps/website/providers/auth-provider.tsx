"use client";

import { useCurrentUser } from "@/hooks/use-auth";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/stores/modal-store";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isAuthenticated } = useCurrentUser();
  const router = useRouter();
  const { onOpen: openAuthModal } = useAuthModal();

  useEffect(() => {
    const handleUnauthorized = () => {
      openAuthModal("login");
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [openAuthModal]);

  useEffect(() => {
    if (isAuthenticated) {
      const returnUrl = sessionStorage.getItem('auth_return_url');
      if (returnUrl) {
        sessionStorage.removeItem('auth_return_url');
        // Small delay to ensure router is ready
        setTimeout(() => {
          router.push(returnUrl);
        }, 100);
      }
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
};
