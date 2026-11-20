import { getCurrentUser, getCurrentUserGroup } from "@/app/lib/auth/dal";
import { getMembersByGroupId } from "@/app/lib/users";
import { getRoundsByGroupId } from "@/app/lib/rounds";
import { getSongSubmissionByRoundAndUser } from "@/app/lib/submissions";
import GroupInfo from "./group-info";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { ArrowBack } from "@mui/icons-material";
import { formatRelativeTime } from "@/app/lib/date-utils";
import DialogButton from "@/app/dialog/dialog-button";
import CreateRoundForm from "./round-form";
import SongSubmissionForm from "./song-submission-form";
import { RoundState, getRoundState } from "@/app/lib/helpers";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { group, isMember } = await getCurrentUserGroup(id);
  const user = await getCurrentUser();
  const isOwner = group.createdBy === user.userId;
  const members = await getMembersByGroupId(id);
  const rounds = await getRoundsByGroupId(id);

  const latestRound = rounds.length > 0 ? rounds[0] : undefined;

  const roundState: RoundState | undefined = latestRound
    ? getRoundState(latestRound)
    : undefined;
  const songSubmission =
    latestRound && isMember && roundState === RoundState.Submitting
      ? await getSongSubmissionByRoundAndUser(latestRound.roundId, user.userId)
      : undefined;

  return (
    <main className="app-content flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="inline-block text-blue hover:underline"
      >
        <ArrowBack /> Home
      </Link>
      <GroupInfo group={group} isMember={isMember} />
      <Paper
        component="section"
        aria-labelledby="current-round-title"
        sx={{ p: 2 }}
      >
        <Typography variant="h3" component="h2" id="current-round-title">
          Current round
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2, mb: 3 }}>
          {latestRound
            ? latestRound.name + " | " + latestRound.description
            : "No round yet."}
        </Typography>

        <Stack direction="column" spacing={2} useFlexGap sx={{ mt: 3 }}>
          {roundState === undefined &&
            (isOwner ? (
              <DialogButton
                id="create-round-dialog"
                name="Create Round"
                buttonLabel="Create round"
                sx={{ width: "100%" }}
              >
                <CreateRoundForm group={group} />
              </DialogButton>
            ) : (
              <Button variant="outlined">Create round</Button>
            ))}
          {roundState === RoundState.Submitting && latestRound && (
            <DialogButton
              id={`submit-song-dialog-${latestRound.roundId}`}
              name="Submit Song"
              buttonLabel={
                <>
                  Submit Song{" "}
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                    sx={{ paddingLeft: 1 }}
                  >
                    Due in {formatRelativeTime(latestRound.submissionDeadline)}
                  </Typography>
                </>
              }
              sx={{ width: "100%" }}
            >
              <SongSubmissionForm
                roundId={latestRound.roundId}
                initialSongUrl={songSubmission?.songUrl}
              />
            </DialogButton>
          )}
          {roundState === RoundState.Voting && latestRound && (
            <Button
              variant="contained"
              color="info"
              className="gradient-border"
              sx={{ width: "100%" }}
            >
              Vote{" "}
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
                sx={{ paddingLeft: 1 }}
                  >
                    Due in {formatRelativeTime(latestRound.votingDeadline)}
              </Typography>
            </Button>
          )}
          {roundState === RoundState.Finished && (
            <Button variant="contained" sx={{ width: "100%" }}>
              See Results
            </Button>
          )}
        </Stack>
      </Paper>
      <Paper
        component="section"
        aria-labelledby="members-title"
        variant="outlined"
        sx={{ bgcolor: "transparent", p: 2 }}
      >
        <Typography variant="h3" component="h2" id="members-title">
          Members
        </Typography>
        <List dense sx={{ mt: 2 }}>
          {members.map((member) => (
            <ListItem key={member.userId} disableGutters>
              <ListItemText primary={member.displayName} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper
        variant="outlined"
        aria-labelledby="past-rounds-title"
        sx={{
          p: 2,
          color: "info.main",
          borderStyle: "dashed",
          bgcolor: "transparent",
        }}
      >
        <Typography variant="h3" component="h2" id="past-rounds-title">
          Past Rounds
        </Typography>
        <List dense sx={{ mt: 2 }}>
          {rounds.map((round) => (
            <ListItem key={round.roundId} disableGutters>
              <ListItemText primary={round.name} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </main>
  );
}
