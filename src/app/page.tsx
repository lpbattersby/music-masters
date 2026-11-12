import PublicShell from "./public-shell";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <PublicShell>
      <Typography variant="h1">Welcome to <br /> Music Masters</Typography>
      <Typography sx={{ mt: 2.5, mb: 3.5 }}>Create a group, submit tracks in themed rounds and vote for your favourites!</Typography>
      <Stack spacing={2}>
      <Button
        href="/login"
        variant="contained"
        size="large"
        sx={{ borderRadius: 50, bgcolor: 'text.primary' }}
      >
        Login
      </Button>
      <Button
        href="/signup"
        size="large"
        className="gradient-border"
        sx={{ borderRadius: 50, color: 'text.primary' }}
      >
        Sign Up
      </Button>
      </Stack>
    </PublicShell>
  );
}
