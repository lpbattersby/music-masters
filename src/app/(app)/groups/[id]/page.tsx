import { getCurrentUser, getCurrentUserGroup } from "@/app/lib/auth/dal";
import { getMembersByGroupId } from "@/app/lib/users";
import GroupInfo from "./group-info";
import Link from "next/link";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { ArrowBack } from "@mui/icons-material";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { group, isMember } = await getCurrentUserGroup(id);
  const user = await getCurrentUser();
  const members = await getMembersByGroupId(id);

  return (
    <main className="app-content flex flex-col gap-6">
      <Link href="/dashboard" className="inline-block text-blue hover:underline">
        <ArrowBack /> Home
      </Link>
      <GroupInfo group={group} isMember={isMember} />
      <Paper component="section" aria-labelledby="current-round-title" sx={{ p: 2 }}>
        <Typography variant="h3" component="h2" id="current-round-title">Current round</Typography>
        <Typography color="text.secondary" sx={{ mt: 2, mb: 3 }}>No round yet.</Typography>
        {user.userId === group.createdBy && (
          <Button variant="contained" disabled>Create round</Button>
        )}
      </Paper>
      <Paper component="section" aria-labelledby="members-title" variant="outlined" sx={{ bgcolor: 'transparent', p: 2 }}>
          <Typography variant="h3" component="h2" id="members-title">Members</Typography>
          <List dense sx={{ mt: 2 }}>
            {members.map((member) => (
              <ListItem key={member.userId} disableGutters><ListItemText primary={member.displayName} /></ListItem>
            ))}
          </List>
      </Paper>
    </main>
  );
}
