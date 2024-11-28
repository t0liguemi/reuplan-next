"use client"

import { CopyIcon } from "lucide-react"
import { toast } from "sonner";

export default function Copier({stringToCopy}:{stringToCopy:string}) {
    
    return (
        <button onClick={async ()=>{await navigator.clipboard.writeText(stringToCopy);toast("Copied link to clipbard.")}}><CopyIcon/></button>
    )
}