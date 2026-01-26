"use client";

import { useEffect, useState } from "react";
import { AuthModal } from "@/components/features/auth/AuthModal";
import { ProfileCompletionModal } from "@/components/features/profile/ProfileCompletionModal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <AuthModal />
            <ProfileCompletionModal />
        </>
    );
};
