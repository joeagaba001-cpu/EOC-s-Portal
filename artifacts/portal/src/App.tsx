import { useEffect, useRef, lazy, Suspense } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useGetMyProfile } from "@workspace/api-client-react";

import Home from "./pages/Home";
import CompleteRegistration from "./pages/CompleteRegistration";
import NotFound from "./pages/not-found";

const Dashboard = lazy(() => import("./pages/participant/Dashboard"));
const Profile = lazy(() => import("./pages/participant/Profile"));
const Skills = lazy(() => import("./pages/participant/Skills"));
const Payments = lazy(() => import("./pages/participant/Payments"));
const Notifications = lazy(() => import("./pages/participant/Notifications"));
const Announcements = lazy(() => import("./pages/participant/Announcements"));

const OfficerHome = lazy(() => import("./pages/officer/OfficerHome"));
const OfficerParticipants = lazy(() => import("./pages/officer/OfficerParticipants"));
const OfficerPayments = lazy(() => import("./pages/officer/OfficerPayments"));
const OfficerSkills = lazy(() => import("./pages/officer/OfficerSkills"));
const OfficerPackages = lazy(() => import("./pages/officer/OfficerPackages"));
const OfficerNotifications = lazy(() => import("./pages/officer/OfficerNotifications"));
const OfficerSettings = lazy(() => import("./pages/officer/OfficerSettings"));

const About = lazy(() => import("./pages/About"));
const Programs = lazy(() => import("./pages/Programs"));
const Contact = lazy(() => import("./pages/Contact"));
const Sponsorship = lazy(() => import("./pages/Sponsorship"));
const BeneficiaryFund = lazy(() => import("./pages/BeneficiaryFund"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Blog = lazy(() => import("./pages/Blog"));

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#0F5132",
    colorForeground: "#333333",
    colorMutedForeground: "#6b7280",
    colorDanger: "#ef4444",
    colorBackground: "#FFFFFF",
    colorInput: "#f9fafb",
    colorInputForeground: "#333333",
    colorNeutral: "#e5e7eb",
    fontFamily: "'Poppins', sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden border border-gray-100 shadow-2xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "font-serif text-2xl text-[#0F5132] text-center",
    headerSubtitle: "text-gray-500 text-center",
    formButtonPrimary: "bg-[#0F5132] hover:bg-[#0d4429] text-white",
    footerActionLink: "text-[#0F5132] hover:text-[#0d4429]",
    dividerText: "text-gray-400",
    formFieldLabel: "text-gray-700 font-medium",
    socialButtonsBlockButtonText: "text-gray-700",
  },
};

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-accent/30 px-4 py-12">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-accent/30 px-4 py-12">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function AuthRouter() {
  const { data: profile, isLoading } = useGetMyProfile();

  if (isLoading) return <PageLoader />;
  if (!profile?.role) return <Redirect to="/complete-registration" />;
  if (profile.role === "participant") return <Redirect to="/dashboard" />;
  if (profile.role === "officer") return <Redirect to="/officer" />;
  return <Redirect to="/complete-registration" />;
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in"><AuthRouter /></Show>
      <Show when="signed-out"><Home /></Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" component={HomeRedirect} />

            {/* Public pages */}
            <Route path="/about" component={About} />
            <Route path="/programs" component={Programs} />
            <Route path="/contact" component={Contact} />
            <Route path="/sponsorship" component={Sponsorship} />
            <Route path="/beneficiary" component={BeneficiaryFund} />
            <Route path="/faq" component={FAQ} />
            <Route path="/gallery" component={Gallery} />
            <Route path="/blog" component={Blog} />

            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/complete-registration" component={CompleteRegistration} />

            {/* Participant routes */}
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/profile" component={Profile} />
            <Route path="/skills" component={Skills} />
            <Route path="/payments" component={Payments} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/announcements" component={Announcements} />

            {/* Officer routes */}
            <Route path="/officer" component={OfficerHome} />
            <Route path="/officer/participants" component={OfficerParticipants} />
            <Route path="/officer/payments" component={OfficerPayments} />
            <Route path="/officer/skills" component={OfficerSkills} />
            <Route path="/officer/packages" component={OfficerPackages} />
            <Route path="/officer/notifications" component={OfficerNotifications} />
            <Route path="/officer/settings" component={OfficerSettings} />

            <Route component={NotFound} />
          </Switch>
        </Suspense>
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
