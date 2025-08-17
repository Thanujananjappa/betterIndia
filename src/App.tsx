import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import {
  Header,
  Navigation,
  Dashboard as DashboardComponent,
  ReportAgent,
  MatchingAgent,
  CommunityAgent,
  AlertAgent,
  CameraNetwork,
  SupportCenter,
} from "./components";

// Auth Pages
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";

// Role Dashboards
import AdminDashboard from "./Dashboard/AdminDashboard";
import CommunityDashboard from "./Dashboard/CommunityDashboard";
import NGODashboard from "./Dashboard/NGODashboard";
import PoliceDashboard from "./Dashboard/PoliceDashboard";

// Utils
import { mockCases } from "./utils/mockData";

// Layout wrapper for logged-in users
const AppLayout = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardComponent cases={mockCases} />;
      case "report":
        return <ReportAgent />;
      case "match":
        return <MatchingAgent />;
      case "community":
        return <CommunityAgent />;
      case "alert":
        return <AlertAgent />;
      case "camera":
        return <CameraNetwork />;
      case "support":
        return <SupportCenter />;
      default:
        return <DashboardComponent cases={mockCases} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderActiveTab()}
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Router>
      <Routes>
        {/* ✅ Default route goes to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        {/* ⚠️ Signup not global */}

        {/* Main App after login */}
        <Route
          path="/dashboard"
          element={<AppLayout activeTab={activeTab} setActiveTab={setActiveTab} />}
        />

        {/* Role-specific dashboards */}
        <Route path="/dashboard/admin" element={<AdminDashboard />} />

        {/* ✅ Community dashboard + signup inside */}
        <Route path="/dashboard/community" element={<CommunityDashboard />} />
        <Route path="/dashboard/community/signup" element={<Signup />} />

        <Route path="/dashboard/ngo" element={<NGODashboard />} />
        <Route path="/dashboard/police" element={<PoliceDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
