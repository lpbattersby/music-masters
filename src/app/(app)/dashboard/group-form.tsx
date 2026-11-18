'use client'

import { createGroupAction } from '@/app/actions/groups'
import GeneratedForm, { type GeneratedField } from '@/app/form/generated-form'
import InputAdornment from '@mui/material/InputAdornment'

export default function CreateGroupForm() {
  const fields: GeneratedField[] = [
    { name: 'name', label: 'Name' },
    { name: 'description', label: 'Description' },
    {
      name: 'submissionWindowDays',
      id: 'submissionWindow',
      label: 'Submission Window',
      type: 'number',
      endAdornment: <InputAdornment position="end">days</InputAdornment>,
    },
    {
      name: 'votingWindowDays',
      id: 'votingWindow',
      label: 'Voting Window',
      type: 'number',
      endAdornment: <InputAdornment position="end">days</InputAdornment>,
    },
  ]

  return (
    <GeneratedForm
      action={createGroupAction}
      ariaLabel="Create Group"
      fields={fields}
      alignItems="center"
    />
  )
}
