"use client"

import { CopyIcon } from "lucide-react"
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function Copier({stringToCopy}:{stringToCopy:string}) {
    const t = useTranslations("AnonEventPage")
    
    return (
        <button onClick={async ()=>{await navigator.clipboard.writeText(stringToCopy);toast(t("clipboardToast"))}}><CopyIcon/></button>
    )
}