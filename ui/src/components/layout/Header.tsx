import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeProvider";
import { IconBrightness } from '@tabler/icons-react';
import { TimeFilter } from "../business/TimeFilter";

export function Header() {
    const { toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-20 bg-white dark:bg-black flex h-10 items-center border-b px-4">
            <div className="text-lg font-semibold">
                Logs-Viewer
            </div>

            <div className="ml-auto flex items-center gap-2">
                <TimeFilter />

                <Button variant="outline" size="icon-sm" onClick={() => toggleTheme()} >
                    <IconBrightness />
                </Button>
            </div>
        </header>
    )
}