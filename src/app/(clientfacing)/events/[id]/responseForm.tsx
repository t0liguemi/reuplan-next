import { Button } from "~/components/ui/button";

export default function ResponseInput(props: {
  eventId: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <input type="text" placeholder="Invitee email" />
      <input type="datetime-local" placeholder="Date" />
      <input type="time" placeholder="Start time" />
      <input type="time" placeholder="End time" />
      <Button>Send</Button>
    </div>
  );
}   