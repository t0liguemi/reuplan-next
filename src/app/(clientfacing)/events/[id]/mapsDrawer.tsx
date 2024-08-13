"use client";
import { useEffect,useState } from "react";
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
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return (
    isClient ? <div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="font-bold mx-2 px-1 text-2xl bg-muted">{props.location}</Button>
        </DrawerTrigger>
        <DrawerContent className="items-center justify-center gap-2">
          <DrawerTitle >{props.location}</DrawerTitle>
          <DrawerHeader>
            <iframe
            suppressHydrationWarning
              className="align-self-center w-screen h-[50vh]"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/search?q=${locationEncoded}&key=${env.NEXT_PUBLIC_GMAPS_API_KEY}`}
            />{" "}
            <DrawerDescription className="text-sm text-muted-foreground px-4>
              <p 
              ">
                  This map is powered by Google Maps. It may be inaccurate depending
                  on the location inserted by the host.
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>:null);
}
