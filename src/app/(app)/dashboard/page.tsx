import { getGroupsByUserId } from "@/app/lib/groups";
import { getCurrentUser } from "@/app/lib/auth/dal";
import GroupList from "./group-list";
import MMFab from "@/app/fab/fab";
import CreateGroupForm from "@/app/(app)/dashboard/group-form";

export default async function Dashboard() {
    const user = await getCurrentUser()
    const groups = await getGroupsByUserId(user.userId);

    return (
    <main className="app-content pb-[calc(164px+env(safe-area-inset-bottom,0px))]">
        <h1 className="display-heading">Your groups<span className="text-brand">.</span></h1>
        <GroupList groups={groups}/>
        <MMFab id="add-group" label="Create Group" text="Create Group" navigation>
          <CreateGroupForm />
        </MMFab>
    </main>
    );
}
