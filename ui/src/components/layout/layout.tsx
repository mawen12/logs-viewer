
import { Activity } from "lucide-react";
import type { ReactNode } from "react";
import { TimeFilter } from "../business/TimeFilter";
import { DebugToggle } from "../debug-toggle";
import { ThemeSwitch } from "../theme-switch";
import { TimeRangePicker } from "../time-range-picker";
import { Separator } from "../ui/separator";
import { Container } from "./container";
import { Header } from "./header";
import { Main } from "./main";

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
                <TimeFilter/>
                <ThemeSwitch />
            </Header>

            <Separator className='shadow-sm' />

            {/* ===== Main ===== */}
            <Main compact className='p-2 space-y-4'>
                {children}
            </Main>
        </Container>
    )
}