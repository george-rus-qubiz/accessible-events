import { useState } from "react";
import type { EventItem } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { formatCurrency } from "@/lib/format";

export interface PaymentResult {
  type: "success" | "error";
  text: string;
}

interface BuyTicketModalProps {
  open: boolean;
  event: EventItem;
  result: PaymentResult | null;
  onClose: () => void;
  onPay: () => void;
}

export function BuyTicketModal({
  open,
  event,
  result,
  onClose,
  onPay,
}: BuyTicketModalProps) {
  const [card, setCard] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handleSubmit = (formEvent: React.FormEvent) => {
    formEvent.preventDefault();
    onPay();
  };

  const isCardValid = /^\d{16}$/.test(card);
  const cardError =
    card !== "" && !isCardValid ? "Card number must be exactly 16 digits." : "";

  const isNameValid = /^[A-Za-z\s]+$/.test(name.trim());
  const nameError =
    name !== "" && !isNameValid ? "Name must only contain letters." : "";

  const expiryFormatMatch = /^(\d{2})\/(\d{2})$/.exec(expiry);
  const isExpiryFormatValid = expiryFormatMatch !== null;
  const isExpiryDateValid = (() => {
    if (!expiryFormatMatch) {
      return false;
    }
    const month = Number(expiryFormatMatch[1]);
    const year = 2000 + Number(expiryFormatMatch[2]);
    if (month < 1 || month > 12) {
      return false;
    }
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    return (
      year > currentYear || (year === currentYear && month >= currentMonth)
    );
  })();
  const isExpiryValid = isExpiryFormatValid && isExpiryDateValid;
  const expiryError =
    expiry !== "" && !isExpiryFormatValid
      ? "Enter the expiry date in MM/YY format."
      : expiry !== "" && !isExpiryDateValid
        ? "Enter a valid, non-expired date."
        : "";

  const isCvcValid = /^\d{3}$/.test(cvc);
  const cvcError =
    cvc !== "" && !isCvcValid ? "CVC must be exactly 3 digits." : "";

  const isComplete = isCardValid && isNameValid && isExpiryValid && isCvcValid;

  return (
    <Modal open={open} title={`Buy ticket — ${event.name}`} onClose={onClose}>
      {result && (
        <div
          className={`mb-4 rounded-md px-3 py-2 text-sm ${
            result.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {result.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="Card number"
          inputMode="numeric"
          autoComplete="cc-number"
          value={card}
          onChange={(e) => setCard(e.target.value)}
          placeholder="1234123412341234"
          error={cardError}
        />
        <TextField
          label="Name on card"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          error={nameError}
        />
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Expiry date (MM/YY)"
            autoComplete="cc-exp"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder="MM/YY"
            error={expiryError}
          />
          <TextField
            label="CVC"
            inputMode="numeric"
            autoComplete="cc-csc"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            placeholder="123"
            error={cvcError}
          />
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm text-slate-500">Total</span>
          <span className="text-lg font-semibold text-slate-800">
            {formatCurrency(event.price)}
          </span>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isComplete}>
            Pay now
          </Button>
        </div>
      </form>
    </Modal>
  );
}
