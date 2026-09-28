import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { DiscoveryProvider } from "./store/DiscoveryProvider";
import { Home } from "./pages/Home";
import { Discover } from "./pages/Discover";
import { Results } from "./pages/Results";
import { Specialties } from "./pages/Specialties";
import { SpecialtyDetail } from "./pages/SpecialtyDetail";
import { Compare } from "./pages/Compare";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { Disclaimer } from "./pages/Disclaimer";
import { Sources } from "./pages/Sources";

function ScrollToTop() {
  const { pathname, search } = useLocation();
  const prev = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (prev.current !== pathname + search) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
    prev.current = pathname + search;
  }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <DiscoveryProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/results" element={<Results />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/specialty/:id" element={<SpecialtyDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </DiscoveryProvider>
  );
}