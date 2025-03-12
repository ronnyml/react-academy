import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const CertificationPage = lazy(() => import("./pages/CertificationPage"));
const CoursePage = lazy(() => import("./pages/CoursePage"));
const EnrollmentPage = lazy(() => import("./pages/EnrollmentPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const UserPage = lazy(() => import("./pages/UserPage"));

export const routes = (
  <>
    <Route path="/" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/certifications" element={<CertificationPage />} />
      <Route path="/courses" element={<CoursePage />} />
      <Route path="/enrollments" element={<EnrollmentPage />} />
      <Route path="/payments" element={<PaymentPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/users" element={<UserPage />} />
    </Route>
  </>
);