import { Providers } from "@/providers/Providers";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}