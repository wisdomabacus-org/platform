/**
 * React 19 Type Compatibility Fix
 * 
 * This file fixes the type compatibility issue between React 19's new type definitions
 * and libraries like lucide-react that are compiled against older React versions.
 * 
 * React 19 added 'bigint' to ReactNode, but libraries using older @types/react
 * have a different ReactNode definition, causing type mismatches.
 */

import type { ReactNode as React19ReactNode } from 'react';

declare module 'react' {
    // Override ReactNode to ensure compatibility
    export type ReactNode = React19ReactNode;
}

// Fix for lucide-react icons to be used as JSX components
declare module 'lucide-react' {
    import type { SVGProps, ForwardRefExoticComponent, RefAttributes } from 'react';

    interface LucideProps extends SVGProps<SVGSVGElement> {
        size?: string | number;
        absoluteStrokeWidth?: boolean;
    }

    type LucideIcon = ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >;

    export const Loader2: LucideIcon;
    export const AlertCircle: LucideIcon;
    export const ShieldCheck: LucideIcon;
    export const Clock: LucideIcon;
    export const CheckCircle: LucideIcon;
    export const XCircle: LucideIcon;
    export const ChevronLeft: LucideIcon;
    export const ChevronRight: LucideIcon;
    export const Flag: LucideIcon;
    export const Timer: LucideIcon;
    export const Send: LucideIcon;
    export const Menu: LucideIcon;
    export const X: LucideIcon;
    export const ArrowLeft: LucideIcon;
    export const ArrowRight: LucideIcon;
    export const Home: LucideIcon;
    export const LogOut: LucideIcon;
    export const FileText: LucideIcon;
    export const Circle: LucideIcon;
    export const CircleDot: LucideIcon;
    export const CircleCheck: LucideIcon;
    export const CircleX: LucideIcon;
    export const Trophy: LucideIcon;
    export const Star: LucideIcon;
    export const Medal: LucideIcon;
    export const Award: LucideIcon;
}
