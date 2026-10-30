import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ChatbotWidget } from "@/components/ui/ChatbotWidget";
import { SessionTimeoutManager } from "@/features/session/SessionTimeoutManager";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
      <SessionTimeoutManager />
    </div>
  );
}
