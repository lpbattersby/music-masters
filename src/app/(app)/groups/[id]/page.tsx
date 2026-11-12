import { getCurrentUserGroup } from "@/app/lib/auth/dal";
import GroupInfo from "./group-info";
import InviteButton from "./invite-button";
import JoinButton from "./join-button";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { group, isMember } = await getCurrentUserGroup(Number(id));

  return (
    <main className="flex max-w-[700px] w-9/10 flex-col items-start justify-center gap-4 bg-white p-2 pb-10 m-5 rounded-4xl">
      <h1 className="text-2xl">{group.name}</h1>
      <GroupInfo group={group} />
      {isMember ? <InviteButton /> : <JoinButton groupId={group.groupId} />}
    </main>
  );
}