import { hash } from "crypto";
export function saltAndHashPassword(password: string) {
    const hashedPassword = hash("sha256",password)
return hashedPassword}