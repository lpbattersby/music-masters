import { getGroupsByUserId } from "@/app/lib/groups";
import { getCurrentUser } from "@/app/lib/auth/dal";
import GroupList from "./group-list";
import MMFab from "@/app/fab/fab";
import CreateGroupForm from "@/app/(app)/dashboard/group-form";
import Typography from "@mui/material/Typography";
import {getLatestRoundsByGroupIds} from "@/app/lib/rounds";

export default async function Dashboard() {
    const user = await getCurrentUser()
    const groups = await getGroupsByUserId(user.userId);
    const latestRounds = await getLatestRoundsByGroupIds(groups.map((group) => group.groupId));
    const latestRoundsByGroupId = new Map(latestRounds.map((round) => [round.groupId, round]));
    const groupsWithLatestRounds = groups.map((group) => ({
        ...group,
        latestRound: latestRoundsByGroupId.get(group.groupId),
    }));

    return (
    <main className="app-content pb-[calc(164px+env(safe-area-inset-bottom,0px))]">
        <Typography variant="h1">Your groups<span className="text-brand">.</span></Typography>
        <GroupList groups={groupsWithLatestRounds}/>
        <MMFab id="add-group" label="Create Group" text="Create Group" navigation>
          <CreateGroupForm />
        </MMFab>
    </main>
    );
}
