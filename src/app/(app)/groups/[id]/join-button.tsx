"use client";

import Button from "@mui/material/Button";
import { useFormStatus } from "react-dom";
import { joinGroupAction } from "@/app/actions/groups";

function JoinSubmit() {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="contained" disabled={pending}>{pending ? "Joining..." : "Join"}</Button>;
}

export default function JoinButton({ groupId }: { groupId: number }) {
  return (
    <form action={joinGroupAction}>
      <input type="hidden" name="groupId" value={groupId} />
      <JoinSubmit />
    </form>
  );
}