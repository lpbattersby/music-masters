'use client'

import { login } from '@/app/actions/auth'
import { useActionState, useState } from 'react'
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)
  const [formState, setFormState] = useState({
    username: '',
    displayName: '',
    password: ''
  })

  return (
    <Stack component="form" aria-label="Login" action={action} spacing={3}>
      <Typography variant="h1">Login</Typography>
      <TextField 
        variant="outlined" 
        id="username" 
        name="username" 
        label="Username" 
        fullWidth
        autoComplete="username"
        error={!!state?.errors?.username} 
        helperText={state?.errors?.username}
        value={formState.username}
        onChange={(e) => setFormState({ ...formState, username: e.target.value })}
      />

      <TextField 
        variant="outlined" 
        id="password" 
        name="password" 
        label="Password" 
        type="password" 
        fullWidth
        autoComplete="current-password"
        error={!!state?.errors?.password}
        slotProps={{
          formHelperText: { component: 'div' }
        }}
        helperText={
          state?.errors?.password && 
          <>
            Password must:
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </>
        }
        value={formState.password}
        onChange={(e) => setFormState({ ...formState, password: e.target.value })}
      />

      <Typography variant="body2">
        {"Don't have an account?"} <Link href="/signup">Sign up</Link>
      </Typography>

      <Button
        disabled={pending}
        type="submit"
        className="gradient-border"
        sx={{ borderRadius: '50px', px: 5, py: 1.5, color: 'text.primary', width: '100%' }}
      >
        Confirm
      </Button>
      </Stack>
  )
}
