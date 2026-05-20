import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeProvider";
import { IconBrightness } from '@tabler/icons-react';
import { TimeFilter } from "../business/TimeFilter";
import { WebsocketButton } from "../business/WebsocketButton";
import { Badge } from "../ui/badge";


export function Header() {
    const { toggleTheme } = useTheme();

    return (
        <header className="bg-white dark:bg-black flex h-10 items-center border-b px-4">
            <div className="text-lg font-semibold relative">
                Logs-Viewer
                 <Badge className="w-8 px-2 absolute z-index-3 bg-blue-50 text-blue-700 dark:text-blue-300 dark:bg-blue-500">dev</Badge>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <WebsocketButton/>

                <TimeFilter />

                <Button variant="outline" size="icon-sm" onClick={() => toggleTheme()} >
                    <IconBrightness />
                </Button>
            </div>
        </header>
    )
}