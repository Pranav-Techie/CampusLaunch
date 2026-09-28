import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ApplicationTracker from "./pages/ApplicationTracker";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved";
import Home from "./pages/Home";
import AccountType from "./pages/AccountType";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import Opportunities from "./pages/Opportunities";
import OpportunityDetails from "./pages/OpportunityDetails";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* HOME */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* ACCOUNT TYPE */}
      <Route
        path="/auth"
        element={<AccountType />}
      />

      <Route
        path="/login"
        element={<AccountType />}
      />

      {/* STUDENT LOGIN */}
      <Route
        path="/login/student"
        element={<Login />}
      />

      {/* ADMIN LOGIN */}
      <Route
        path="/login/admin"
        element={<Login />}
      />

      {/* OLD AUTH LOGIN */}
      <Route
        path="/auth/login"
        element={<Login />}
      />

      {/* REGISTER */}
      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/auth/register"
        element={<Register />}
      />

      {/* STUDENT DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* APPLICATION TRACKER */}
      <Route
        path="/tracker"
        element={
          <ProtectedRoute>
            <ApplicationTracker />
          </ProtectedRoute>
        }
      />

      {/* ALIAS USED BY DASHBOARD */}
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <ApplicationTracker />
          </ProtectedRoute>
        }
      />

      {/* SAVED */}
      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <Saved />
          </ProtectedRoute>
        }
      />

      {/* PROFILE */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* OPPORTUNITIES */}
      <Route
        path="/opportunities"
        element={
          <ProtectedRoute>
            <Opportunities />
          </ProtectedRoute>
        }
      />

      {/* SINGLE OPPORTUNITY */}
      <Route
        path="/opportunities/:id"
        element={
          <ProtectedRoute>
            <OpportunityDetails />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;