import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findEventById } from "@/lib/repositories/eventRepository";
import { useRegistrations } from "@/hooks/useRegistrations";
import { Button } from "@/components/ui/Button";
import {
  BuyTicketModal,
  type PaymentResult,
} from "@/features/events/BuyTicketModal";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { formatCurrency, formatDateTime } from "@/lib/format";

export function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { isRegistered, register } = useRegistrations();
  const [modalOpen, setModalOpen] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);

  const event = findEventById(eventId);
  if (!event) {
    return <NotFoundPage />;
  }

  const registered = isRegistered(event.id);

  const openModal = () => {
    setResult(null);
    setModalOpen(true);
  };

  const handlePay = () => {
    switch (event.paymentOutcome) {
      case "success":
        register(event.id);
        setResult({
          type: "success",
          text: "Payment successful. See you there!",
        });
        setModalOpen(false);
        break;
      case "error":
        setResult({
          type: "error",
          text: "Your payment could not be processed. Please try again.",
        });
        break;
      case "notfound":
        // Broken checkout link — routes to a page that does not exist (404).
        navigate(`/checkout/${event.id}/confirm`);
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <span
        onClick={() => navigate(-1)}
        className="cursor-pointer text-sm text-slate-400 hover:text-slate-600"
      >
        ‹ Back
      </span>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <img
          src={event.image}
          alt={event.imageAlt ?? ""}
          className="h-64 w-full object-cover"
        />
        <div className="flex flex-col gap-4 p-6">
          <div className="text-2xl font-semibold text-slate-800">
            {event.name}
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500">
            <span>{event.location}</span>
            <span>{formatDateTime(event.startDateTime)}</span>
            <span>Ends {formatDateTime(event.endDateTime)}</span>
            <span>Up to {event.maxPeople} people</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            {event.description}
          </p>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xl font-semibold text-brand-600">
              {formatCurrency(event.price)}
            </span>
            {registered ? (
              <span className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                You are going
              </span>
            ) : (
              <Button onClick={openModal}>Buy ticket</Button>
            )}
          </div>
        </div>
      </div>

      <BuyTicketModal
        open={modalOpen}
        event={event}
        result={result}
        onClose={() => setModalOpen(false)}
        onPay={handlePay}
      />
    </div>
  );
}
