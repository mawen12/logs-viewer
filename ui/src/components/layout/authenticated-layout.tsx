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
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset
                className={cn(
                    '@container/content',
                    'has-data-[layout=fixed]:h-svh',
                    'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
                )}
            >
                {children ?? <Outlet />}
            </SidebarInset>
            {/* <Container>
            
                <Header>
                    <div className='flex flex-row items-center justify-between gap-1 me-auto'>
                        <Activity size={18} className={'text-blue-400'} />
                        <h1 className='text-2xl font-bold tracking-tight'>
                            Log Viewer
                        </h1>
                    </div>

                    <DebugToggle/>
                    <TimeRangePicker/>
                    <ThemeSwitch />
                </Header>

                <Separator className='shadow-sm' />

        
                <Main className='p-2 space-y-4 flex flex-row items-center justify-between'>
                    {children ?? <Outlet/> }
                </Main>
            </Container> */}

        </SidebarProvider>
    )
}