
import { Activity } from "lucide-react";
import type { ReactNode } from "react";
import { DebugToggle } from "../debug-toggle";
import { ThemeSwitch } from "../theme-switch";
import { Separator } from "../ui/separator";
import { Container } from "./container";
import { Header } from "./header";
import { Main } from "./main";
import { TimeRangePicker } from "../time-range/time-range-picker";

export type LayoutProps = {
    children: ReactNode
}

export function Layout({ children }: LayoutProps) {
    return (
        <Container>
            {/* ===== Top Heading ===== */}
            <Header compact>
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

            {/* ===== Main ===== */}
            <Main className='p-2 space-y-4 flex flex-row items-center justify-between'>
                {children}
            </Main>
        </Container>
    )
}