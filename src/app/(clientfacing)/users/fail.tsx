"use client";
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function FailedPage () {
    const router = useRouter()
    toast("You don't have the required permissions to access this page")
    router.push("/")

    return <>
    </>}