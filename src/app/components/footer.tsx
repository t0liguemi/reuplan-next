"use client";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import React from "react";
import Link from "next/link";

export default function Footer() {
  const [windowWidth, setWindowWidth] = React.useState(0);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="mb-2 mt-6 flex w-screen items-center justify-between px-4 text-sm font-light text-muted-foreground/60">
      <p>
        Reuplan by{" "}
        <a href="https://linktr.ee/t0liguemi" className="font-bold">
          t0liguemi
        </a>
        , 2024.
      </p>

      <div className="flex flex-row gap-4">
        <Link href="/contact">Contact</Link>
        <Dialog>
          <DialogTrigger>Guide</DialogTrigger>
          <DialogContent className="min-w-fit max-w-max min-h-fit">
            <DialogTitle>Using reuplan:</DialogTitle>
            <iframe
              width={windowWidth*0.7}
              height={windowWidth*0.7*9/16}
              src="https://www.youtube.com/embed/p8vgaGH6w5A?si=83h2wNm07y52pvIf"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
