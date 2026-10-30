import { useId, useState } from "react";
import type { NewEventInput } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { TextField } from "@/components/ui/TextField";
import { fieldErrorProps } from "@/lib/aria";
import { readFileAsDataUrl } from "@/lib/file";
import { validateNewEvent, type ValidationErrors } from "@/lib/validation";

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: NewEventInput) => void;
}

const EMPTY_FORM: NewEventInput = {
  name: "",
  description: "",
  location: "",
  image: "",
  startDateTime: "",
  endDateTime: "",
  price: 0,
  maxPeople: 1,
};

export function AddEventModal({ open, onClose, onCreate }: AddEventModalProps) {
  const [form, setForm] = useState<NewEventInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<ValidationErrors<NewEventInput>>({});
  const imageId = useId();
  const imageErrorId = `${imageId}-error`;

  const update = <K extends keyof NewEventInput>(
    key: K,
    value: NewEventInput[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleImage = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) {
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    update("image", dataUrl);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validateNewEvent(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }
    onCreate(form);
    setForm(EMPTY_FORM);
    onClose();
  };

  return (
    <Modal open={open} title="Add event" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          label="Event name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          error={errors.name}
        />

        <div className="flex flex-col">
          <label
            htmlFor={imageId}
            className="mb-1 text-sm font-medium text-slate-700"
          >
            Image
          </label>
          <input
            id={imageId}
            type="file"
            accept="image/*"
            onChange={(e) => handleImage(e.target.files)}
            {...fieldErrorProps(imageErrorId, errors.image)}
          />
          {form.image && (
            <img
              src={form.image}
              className="mt-2 h-24 w-40 rounded object-cover"
            />
          )}
          <FieldError id={imageErrorId} message={errors.image} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Starts"
            type="datetime-local"
            value={form.startDateTime}
            onChange={(e) => update("startDateTime", e.target.value)}
            error={errors.startDateTime}
          />
          <TextField
            label="Ends"
            type="datetime-local"
            value={form.endDateTime}
            onChange={(e) => update("endDateTime", e.target.value)}
            error={errors.endDateTime}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Price (€)"
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => update("price", Number(e.target.value))}
            error={errors.price}
          />
          <TextField
            label="Max people"
            type="number"
            min={1}
            value={form.maxPeople}
            onChange={(e) => update("maxPeople", Number(e.target.value))}
            error={errors.maxPeople}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create event</Button>
        </div>
      </form>
    </Modal>
  );
}
