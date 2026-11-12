import { getCurrentUser, getCurrentUserGroup } from "@/app/lib/auth/dal";
import { getMembersByGroupId } from "@/app/lib/users";
import GroupInfo from "./group-info";
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
  const members = await getMembersByGroupId(Number(id));

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
      <section className="mt-6 flex flex-col items-start justify-between gap-6 rounded-[18px] border border-outline p-5.5 min-[481px]:flex-row min-[481px]:items-center min-[481px]:p-7">
        <div>
          <h2 className="font-display text-[25px] leading-snug">Members</h2>
          <ul className="mt-4">
            {members.map((member) => (
              <li key={member.userId}>{member.displayName}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}