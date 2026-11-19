"use client";

import {
  useActionState,
  useState,
  type ElementType,
  type HTMLInputTypeAttribute,
  type ReactNode,
} from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { FormState } from "@/app/lib/form-schemas";

type FormErrors = NonNullable<Exclude<FormState, undefined>["errors"]>;
type FieldName = keyof FormErrors;
export type FormAction = (
  previousState: FormState,
  formData: FormData,
) => FormState | Promise<FormState>;

export interface GeneratedField {
  name: FieldName;
  id?: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  endAdornment?: ReactNode;
  helperText?: (errors: string[]) => ReactNode;
  helperTextComponent?: ElementType;
  onChange?: (value: string) => void;
}

interface Props {
  action: FormAction;
  ariaLabel: string;
  fields: GeneratedField[];
  initialValues?: Partial<Record<FieldName, string>>;
  hiddenFields?: { name: string; value: string }[];
  alertErrors?: FieldName[];
  title?: string;
  footer?: ReactNode;
  alignItems?: "center" | "stretch";
  buttonFullWidth?: boolean;
}

export default function GeneratedForm({
  action,
  ariaLabel,
  fields,
  initialValues,
  hiddenFields = [],
  alertErrors = [],
  title,
  footer,
  alignItems,
  buttonFullWidth = false,
}: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    undefined,
  );
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map(({ name }) => [name, initialValues?.[name] ?? ""]),
    ),
  );

  return (
    <Stack
      component="form"
      aria-label={ariaLabel}
      action={formAction}
      spacing={3}
      sx={{ alignItems }}
    >
      {hiddenFields.map(({ name, value }) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {alertErrors.map((name) => {
        const errors = state?.errors?.[name];
        return errors?.length ? (
          <Alert key={name} severity="error">
            {errors.join(" ")}
          </Alert>
        ) : null;
      })}
      {title && <Typography variant="h1">{title}</Typography>}
      {fields.map((field) => {
        const errors = state?.errors?.[field.name];
        return (
          <TextField
            key={field.name}
            variant="outlined"
            id={field.id ?? field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            autoComplete={field.autoComplete}
            fullWidth
            error={!!errors?.length}
            helperText={
              field.helperText ? field.helperText(errors ?? []) : errors
            }
            value={values[field.name] ?? ""}
            onChange={(event) => {
              setValues((current) => ({
                ...current,
                [field.name]: event.target.value,
              }));
              field.onChange?.(event.target.value);
            }}
            slotProps={{
              ...(field.endAdornment && {
                input: { endAdornment: field.endAdornment },
              }),
              ...(field.helperTextComponent && {
                formHelperText: { component: field.helperTextComponent },
              }),
            }}
          />
        );
      })}
      {footer}
      <Button
        disabled={pending}
        type="submit"
        className="gradient-border"
        sx={{
          borderRadius: "50px",
          px: 5,
          py: 1.5,
          color: "text.primary",
          ...(buttonFullWidth && { width: "100%" }),
        }}
      >
        Confirm
      </Button>
    </Stack>
  );
}
