import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ThemeSwitch } from "@/components/theme-switch";
import { SourcesDialogs } from "./components/sources-dialogs";
import { SourcesPrimaryButtons } from "./components/sources-primary-buttons";
import { SourcesProvider } from "./components/sources-provider";
import { SourcesContent } from "./content";

export function Sources() {
    return (
        <SourcesProvider>
            <Header fixed>
                <div className="me-auto" />
                <ThemeSwitch />
            </Header>

            <Main fixed className='flex min-h-0 flex-1 flex-col gap-4 sm:gap-6 overflow-hidden!'>
                <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Sources</h2>
                        <p className='text-muted-foreground'>
                            Here&apos;s a list of your sources for this month!
                        </p>
                    </div>
                    <SourcesPrimaryButtons />
                </div>

                <div className='flex min-h-0 flex-1 flex-col'>
                    {/* <SourcesTable /> */}
                    <SourcesContent />
                </div>
            </Main>

            <SourcesDialogs />
        </SourcesProvider>
    )
}