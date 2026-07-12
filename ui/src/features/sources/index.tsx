import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ThemeSwitch } from "@/components/theme-switch";
import { SourcesPrimaryButtons } from "./components/sources-primary-buttons";

export function Sources() {
    return (
        <>
            <Header fixed>
                <div className="me-auto"/>
                <ThemeSwitch />
            </Header>

            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Sources</h2>
                        <p className='text-muted-foreground'>
                            Here&apos;s a list of your sources for this month!
                        </p>
                    </div>
                    <SourcesPrimaryButtons />
                </div>
                
            </Main>


        </>
    )
}