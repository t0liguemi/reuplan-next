"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { env } from "~/env";

export default function MapsDrawer(props: { location: string }) {
  const locationEncoded = encodeURI(props.location);
  const t = useTranslations("EventPage");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="overflow-hidden max-w-full flex flex-row justify-start h-fit bg-muted px-1 text-2xl font-bold hover:bg-muted/40"
          >
              {props.location}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="items-center justify-center gap-2 bg-background/60 dark:bg-muted/20 backdrop-blur-lg">
          <DrawerTitle>{props.location}</DrawerTitle>
          <DrawerHeader>
            <iframe
              suppressHydrationWarning
              className="align-self-center h-[50vh] w-screen"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/search?q=${locationEncoded}&key=${env.NEXT_PUBLIC_GMAPS_API_KEY}`}
            />{" "}
            <DrawerDescription className="px-4> <p text-sm text-muted-foreground">
              {t("mapsDisclaimer")}
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  ) : null;
}
