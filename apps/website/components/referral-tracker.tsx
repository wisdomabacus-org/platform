"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

function ReferralTrackerContent() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const refCode = searchParams.get("ref") || searchParams.get("referralCode");
        if (refCode) {
            if (window.location.hostname.includes('wisdomabacus.com')) {
                Cookies.set("referral_code", refCode, { expires: 30, domain: '.wisdomabacus.com' });
            } else {
                Cookies.set("referral_code", refCode, { expires: 30 });
            }
        }
    }, [searchParams]);

    return null;
}

export function ReferralTracker() {
    return (
        <Suspense fallback={null}>
            <ReferralTrackerContent />
        </Suspense>
    );
}
