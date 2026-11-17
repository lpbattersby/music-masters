'use client'

import { createRoundAction } from '@/app/actions/rounds'
import { useActionState, useState } from 'react'
import TextInput from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { Group } from '@/app/lib/schema';
import findDeadline from '@/app/lib/helpers';

export default function CreateRoundForm({ group }: { group: Group }) {
  const [state, action, pending] = useActionState(createRoundAction, undefined)
  const [formState, setFormState] = useState(() => {
    const today = new Date()

    return {
      name: '',
      description: '',
      submissionDeadline: findDeadline(group.submissionWindowDays, today),
      votingDeadline: findDeadline(
        group.submissionWindowDays + group.votingWindowDays,
        today,
      ),
    }
  })

  return (
    <Stack component="form" aria-label="Create Round" action={action} spacing={3} sx={{ alignItems: 'center' }}>
      <input type="hidden" name="groupId" value={group.groupId} />
      {state?.errors?.groupId && <Alert severity="error">{state.errors.groupId.join(' ')}</Alert>}
      <TextInput 
        variant="outlined" 
        id="name" 
        name="name" 
        label="Name"
        fullWidth
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
        fullWidth
        error={!!state?.errors?.description}
        helperText={state?.errors?.description}
        value={formState.description}
        onChange={(e) => setFormState({ ...formState, description: e.target.value })}
      />

      <TextInput 
        variant="outlined" 
        id="submissionDeadline" 
        name="submissionDeadline" 
        label="Submission Deadline" 
        type="date"
        fullWidth
        error={!!state?.errors?.submissionDeadline}
        helperText={state?.errors?.submissionDeadline}
        value={formState.submissionDeadline}
        onChange={(e) => setFormState({ ...formState, submissionDeadline: e.target.value })}
      />

      <TextInput 
        variant="outlined" 
        id="votingDeadline" 
        name="votingDeadline" 
        label="Voting Deadline" 
        type="date"
        fullWidth
        error={!!state?.errors?.votingDeadline}
        helperText={state?.errors?.votingDeadline}
        value={formState.votingDeadline}
        onChange={(e) => setFormState({ ...formState, votingDeadline: e.target.value })}
      />

      <Button
        disabled={pending}
        type="submit"
        className="gradient-border"
        sx={{ borderRadius: '50px', px: 5, py: 1.5, color: 'text.primary' }}
      >
        Confirm
      </Button>
    </Stack>
  )
}
