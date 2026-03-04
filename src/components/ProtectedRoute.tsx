import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

type UserRole = "user" | "barber" | "admin";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const roles = (user as { role?: UserRole[] }).role ?? [];
        const hasAllowedRole = allowedRoles.some((allowed) => roles.includes(allowed));
        if (!hasAllowedRole) {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};
