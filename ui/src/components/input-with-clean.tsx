import { cn } from "@/lib/utils";
import { SearchIcon, X } from "lucide-react";
import React, { type Ref } from "react";
import { Button } from "./ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

type InputWithCleanProps = React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: Ref<HTMLInputElement>
    setValue: (value: string) => void
}

export function InputWithClean({ className, disabled, ref, value, setValue, ...props }: InputWithCleanProps) {

    return (
        <InputGroup className={className}>
            <InputGroupInput ref={ref} disabled={disabled} className={cn(className)} value={value} onChange={(event) => setValue(event.target.value)} {...props}/>
            <InputGroupAddon align="inline-start">
                <SearchIcon className="text-muted-foreground" />
            </InputGroupAddon>

            <InputGroupAddon align={'inline-end'}>
                <Button
                    aria-haspopup="true"
                    size='icon'
                    variant={'ghost'}
                    className={cn(value == "" && "hidden")}
                    onClick={() => setValue('')}
                >
                    <X />
                </Button>
            </InputGroupAddon>
        </InputGroup>
    )
}