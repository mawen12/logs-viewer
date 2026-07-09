import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toggle } from "./ui/toggle";
import { Bug } from "lucide-react";

export function DebugToggle() {
    const [value, setValue] = useState(0)

    useEffect(() => {
        if (value === 1) {
            toast.info('debug enabled')
        } else {
            toast.dismiss()
        }
    }, [value])

    return (
        <Toggle
            variant={'outline'}
            value={value}
            onPressedChange={(pressed) => setValue(pressed ? 1 : 0)}
            className="">
            <Bug className="group-aria-pressed/toggle:text-green-600" />
        </Toggle>
    )
}