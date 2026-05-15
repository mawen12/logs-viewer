import { IconCaretRightFilled } from "@tabler/icons-react";
import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Spinner } from "../ui/spinner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface ExecuteButtonProps {
    loading: boolean;
    handleQuery: (refresh?: boolean) => void;
}

export function ExecuteButton({ loading, handleQuery }: ExecuteButtonProps) {
    return (
        <ButtonGroup>
            <Button variant="outline" onClick={() => handleQuery(false)} disabled={loading}>
                {loading ? <Spinner /> : <IconCaretRightFilled />}
                Execute
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" disabled={loading}>
                        <MoreHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleQuery(true)} className="">
                        Execute refresh
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </ButtonGroup>
    )
}