"use client";

import Fab from "@mui/material/Fab";
import { joinGroupAction } from "@/app/actions/groups";

export default function JoinButton({ groupId }: { groupId: number }) {
  return (
    <form action={joinGroupAction}>
      <input type="hidden" name="groupId" value={groupId} />
      <Fab
        color="primary"
        type="submit"
        variant="extended"
        sx={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
          zIndex: (theme) => theme.zIndex.fab,
        }}
      >
        Join
      </Fab>
    </form>
  );
}