'use client'

import { signup } from '@/app/actions/auth'
import { useActionState, useState } from 'react'
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Fab from '@mui/material/Fab';

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)
  const [formState, setFormState] = useState({
    username: '',
    displayName: '',
    password: ''
  })

  return (
    <form aria-label="Sign up" action={action} className="flex flex-col justify-center items-center gap-6">
      <b className="text-2xl">Sign Up</b>
      <br />
      <TextField 
        variant="outlined" 
        id="username" 
        name="username" 
        label="Username" 
        error={!!state?.errors?.username} 
        helperText={state?.errors?.username}
        value={formState.username}
        onChange={(e) => setFormState({ ...formState, username: e.target.value })}
      />

      <TextField 
        variant="outlined" 
        id="displayName" 
        name="displayName" 
        label="Display Name" 
        error={!!state?.errors?.displayName} 
        helperText={state?.errors?.displayName}
        value={formState.displayName}
        onChange={(e) => setFormState({ ...formState, displayName: e.target.value })}
      />

      <TextField 
        variant="outlined" 
        id="password" 
        name="password" 
        label="Password" 
        type="password" 
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

      <div>
        Already have an account? <Link href="/login">Log in</Link>
      </div>

      <Fab 
        disabled={pending}
        variant="extended"
        type="submit"
        className="gradient-border"
        sx={{ borderRadius: '50px', px: 5, py: 1.5, color: 'black' }}
      >
        Confirm
      </Fab>
    </form>
  )
}
