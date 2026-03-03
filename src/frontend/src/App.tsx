import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { ChallengeProvider } from "./context/ChallengeContext";
import { UserProvider } from "./context/UserContext";
import AdvancedDetailPage from "./pages/AdvancedDetailPage";
import AdvancedPage from "./pages/AdvancedPage";
import ChallengeDaysPage from "./pages/ChallengeDaysPage";
import ChallengeDetailPage from "./pages/ChallengeDetailPage";
import ChallengesPage from "./pages/ChallengesPage";
import ClausulasPage from "./pages/ClausulasPage";
import MenuPage from "./pages/MenuPage";
import OnboardingPage from "./pages/OnboardingPage";
import TermsPage from "./pages/TermsPage";

const rootRoute = createRootRoute({
  component: () => (
    <UserProvider>
      <ChallengeProvider>
        <Outlet />
        <Toaster />
      </ChallengeProvider>
    </UserProvider>
  ),
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    if (localStorage.getItem("chibiBoyOnboarded") === "true") {
      throw redirect({ to: "/menu" });
    }
  },
  component: OnboardingPage,
});

const termosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terminos",
  component: TermsPage,
});

const clausulasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clausulas",
  component: ClausulasPage,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/menu",
  component: MenuPage,
});

const retosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/retos",
  component: ChallengesPage,
});

const retosLevelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/retos/$level",
  component: ChallengeDaysPage,
});

const retosDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/retos/$level/$day",
  component: ChallengeDetailPage,
});

const avanzadoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/avanzado",
  component: AdvancedPage,
});

const avanzadoDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/avanzado/$topic",
  component: AdvancedDetailPage,
});

const routeTree = rootRoute.addChildren([
  onboardingRoute,
  termosRoute,
  clausulasRoute,
  menuRoute,
  retosRoute,
  retosLevelRoute,
  retosDetailRoute,
  avanzadoRoute,
  avanzadoDetailRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
