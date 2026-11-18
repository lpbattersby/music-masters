"use client";

import { createRoundAction } from "@/app/actions/rounds";
import GeneratedForm, { type GeneratedField } from "@/app/form/generated-form";
import { Group } from "@/app/lib/schema";
import { findDeadline } from "@/app/lib/helpers";

export default function CreateRoundForm({ group }: { group: Group }) {
  const today = new Date();
  const fields: GeneratedField[] = [
    { name: "name", label: "Name" },
    { name: "description", label: "Description" },
    { name: "submissionDeadline", label: "Submission Deadline", type: "date" },
    { name: "votingDeadline", label: "Voting Deadline", type: "date" },
  ];

  return (
    <GeneratedForm
      action={createRoundAction}
      ariaLabel="Create Round"
      fields={fields}
      initialValues={{
        submissionDeadline: findDeadline(group.submissionWindowDays, today),
        votingDeadline: findDeadline(
          group.submissionWindowDays + group.votingWindowDays,
          today,
        ),
      }}
      hiddenFields={[{ name: "groupId", value: group.groupId }]}
      alertErrors={["groupId"]}
      alignItems="center"
    />
  );
}
