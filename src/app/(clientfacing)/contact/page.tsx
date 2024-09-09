import { Separator } from "~/components/ui/separator";
import ContactForm from "./contactForm";
import { auth } from "auth";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex w-full flex-col items-center justify-start px-2 py-8 sm:px-4 md:px-8 lg:px-12">
      <h1 className="pb-2 text-3xl font-extrabold">Contact</h1>
      <Separator orientation="horizontal" className="mb-4 w-full" />
      <p className="text-md my-4 font-light text-muted-foreground">
        You have questions? You want to report a bug? You want to suggest a
        feature? You want to say hi? You want to collaborate? You want to hire
        me? You want to... live forever? <br/>Please be kind and respectful. I
        might not be able to tolerate it otherwise.
      </p>
      <ContactForm name={session?.user?.name} email={session?.user?.email} />
    </div>
  );
}
