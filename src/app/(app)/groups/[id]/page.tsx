import { getCurrentUser, getCurrentUserGroup } from "@/app/lib/auth/dal";
import GroupInfo from "./group-info";
import InviteButton from "./invite-button";
import JoinButton from "./join-button";
import Link from "next/link";
import Button from "@mui/material/Button";
import { ArrowBack } from "@mui/icons-material";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { group, isMember } = await getCurrentUserGroup(Number(id));
  const user = await getCurrentUser();

  return (
    <main className="app-content">
      <Link href="/dashboard" className="mb-8 inline-block text-blue hover:underline">
        <ArrowBack />
      </Link>
      <GroupInfo group={group} isMember={isMember} />
      <section className="rounded-[18px] border border-outline border-t-5 border-t-blue bg-paper p-5.5 min-[481px]:p-7" aria-labelledby="current-round-title">
        <h2 id="current-round-title" className="font-display text-[25px] leading-snug">Current round</h2>
        <p className="mt-4 mb-6 text-muted">No round yet.</p>
        {user.userId === group.createdBy && (
          <Button variant="contained" disabled>Create round</Button>
        )}
      </section>
    </main>
  );
}