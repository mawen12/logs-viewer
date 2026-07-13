import { cn } from "@/lib/utils";
import { Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export type AuthenticatedLayoutProps = {
    children?: ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    return (
        <SidebarProvider className="has-data-[layout=fixed]:h-svh">
            <AppSidebar />
            <SidebarInset
                // data-layout="fixed"
                className={cn(
                    '@container/content',
                    // 'has-data-[layout=fixed]:h-svh',
                    'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
                )}
            >
                {children ?? <Outlet />}
            </SidebarInset>
        </SidebarProvider>
    )
}