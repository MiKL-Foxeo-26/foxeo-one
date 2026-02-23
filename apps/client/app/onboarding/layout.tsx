// Onboarding layout — pas de dashboard shell
// Full-screen, thème Lab (violet/purple)
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
