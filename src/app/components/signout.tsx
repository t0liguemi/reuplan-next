"use client";
export function SignOut(children:string){
  return (
    <a href="/api/auth/logout" className="py-2 px-4 border border-black rounded-md bg-slate-50 text-black font-bold hover:bg-slate-200">
    {children}
  </a>
  );
}
