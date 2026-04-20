// Root layout — pass-through.
// <html> is handled by [locale]/layout.tsx and (legal)/layout.tsx
// to allow per-locale lang attribute without a double <html> warning.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
