'use client'

import { createGroupAction } from '@/app/actions/groups'
import { useActionState, useState } from 'react'
import TextInput from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Fab from '@mui/material/Fab';

export default function CreateGroupForm() {
  const [state, action, pending] = useActionState(createGroupAction, undefined)
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    submissionWindowDays: '',
    votingWindowDays: ''
  })

  return (
    <form aria-label="Create Group" action={action} className="flex flex-col justify-center items-center gap-6">
      <TextInput 
        variant="outlined" 
        id="name" 
        name="name" 
        label="Name"
        className="w-full"
        error={!!state?.errors?.name} 
        helperText={state?.errors?.name}
        value={formState.name}
        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
      />

      <TextInput 
        variant="outlined" 
        id="description" 
        name="description" 
        label="Description" 
        className="w-full"
        error={!!state?.errors?.description}
        helperText={state?.errors?.description}
        value={formState.description}
        onChange={(e) => setFormState({ ...formState, description: e.target.value })}
      />
      <TextInput 
          variant="outlined" 
          id="submissionWindow" 
          name="submissionWindowDays" 
          label="Submission Window" 
          type="number"
          className="w-full"
          error={!!state?.errors?.submissionWindowDays}
          helperText={state?.errors?.submissionWindowDays}
          value={formState.submissionWindowDays}
          onChange={(e) => setFormState({ ...formState, submissionWindowDays: e.target.value })}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">days</InputAdornment>
            }
          }}
        />
    

      <TextInput 
        variant="outlined" 
        id="votingWindow" 
        name="votingWindowDays" 
        label="Voting Window"
        type="number"
        className="w-full"
        error={!!state?.errors?.votingWindowDays}
        helperText={state?.errors?.votingWindowDays}
        value={formState.votingWindowDays}
        onChange={(e) => setFormState({ ...formState, votingWindowDays: e.target.value })}
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">days</InputAdornment>
          }
        }}
      />

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
