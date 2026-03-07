// ============================================================
// ADMIN PAGE - Route wrapper for the admin dashboard
// Only accessible to users in the "Admins" Cognito group
// ============================================================

import { Suspense, lazy } from "react";
import { LoadingScreen } from "../components/LoadingScreen";

const AdminDashboard = lazy(() =>
  import("../components/admin").then((m) => ({ default: m.AdminDashboard }))
);

export default function AdminPage() {
  return (
    <Suspense fallback={<LoadingScreen theme="blush" />}>
      <AdminDashboard
        isOpen={true}
        onClose={() => {
          // Navigate back; the admin route handles itself
          window.history.back();
        }}
      />
    </Suspense>
  );
}
