export default function CustomerHomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-base)]">
      <div className="w-full max-w-sm mx-auto p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">TableQR Pro</h1>
        <p className="text-[var(--text-muted)] mt-2">
          Please scan the QR code on your table to view the menu.
        </p>
      </div>
    </main>
  );
}
