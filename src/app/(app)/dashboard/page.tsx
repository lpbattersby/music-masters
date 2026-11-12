import Image from "next/image";
import { getGroupsByUserId } from "@/app/lib/groups";
import { getCurrentUser } from "@/app/lib/auth/dal";
import GroupList from "./group-list";
import MMFab from "@/app/fab/fab";
import Divider from '@mui/material/Divider'

export default async function Dashboard() {
    const user = await getCurrentUser()
    const groups = await getGroupsByUserId(user.userId);

    return (
    <main className='flex min-w-full flex-col items-center justify-center gap-4 bg-white p-2 pb-10 m-5 rounded-4xl'>
        <b className="text-2xl">Your Groups</b>
        <Divider sx={{ width: '100%' }} />
        <GroupList groups={groups}/>
        <MMFab id="add-group" label="Add Group" text="Create Group">
          <p>Form or content for adding a new group goes here.</p>
        </MMFab>
    </main>
    );
}
