import { LucideIcon } from 'lucide-react'

export interface NavItem {
    title: string
    url: string
    disabled?: boolean
    external?: boolean
    icon?: LucideIcon
    badge?: string
}

export interface NavCollapsible extends NavItem {
    items: NavItem[]
}

export type NavLink = NavItem

export interface NavGroup {
    title: string
    items: (NavCollapsible | NavLink)[]
}

export interface SidebarData {
    user: {
        name: string
        email: string
        avatar: string
    }
    teams: {
        name: string
        logo: LucideIcon
        plan: string
    }[]
    navGroups: NavGroup[]
}
