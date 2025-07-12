import React, { useEffect, useState } from "react";
import "./App.css";
import LandingPage from "./components/LandingPage";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorks from "./components/HowItWorks";
import WhyChoose from "./components/WhyChoose";
import ConnectUs from "./components/ConnectUs";
import Model from "./components/Model";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import MainNavbar from "./components/MainNavbar";

function useScrollToSection() {
  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname === "/" &&
      location.state &&
      location.state.scrollTo
    ) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
}

function Home(props) {
  useScrollToSection();
  const location = useLocation();

  useEffect(() => {
    // If there is no scrollTo in state, scroll to top on mount
    if (!location.state || !location.state.scrollTo) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location]);

  return (
    <>
      <div id="landing">
        <LandingPage {...props} />
      </div>
      <div id="whychoose">
        <WhyChoose />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="howitworks">
        <HowItWorks />
      </div>
      <div id="contact">
        <ConnectUs />
      </div>
    </>
  );
}

function ReviewPage() {
  return (
    <>
      <Model />
    </>
  );
}

export default function App() {
  // Smooth scroll handler
  const handleScrollToSection = (id) => (e) => {
    e.preventDefault();
    if (id === "landing") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  // For Try Now button navigation
  const navigate = useNavigate();
  const handleModelRoute = () => navigate("/review");
  // On /review, navbar links go to / and scroll to section
  const handleNavFromReview = (id) => (e) => {
    e.preventDefault();
    navigate("/", { state: { scrollTo: id } });
  };
  // On /review, Try Now does nothing
  const handleTryNowNoop = () => {};

  const location = useLocation();
  const isReviewPage = location.pathname === "/review";

  // Manage menuOpen state here
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <MainNavbar
        onNav={isReviewPage ? handleNavFromReview : handleScrollToSection}
        onTryNow={isReviewPage ? handleTryNowNoop : handleModelRoute}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home onNav={handleScrollToSection} onTryNow={handleModelRoute} />
          }
        />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </>
  );
}
