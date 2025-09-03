// src/pages/Unauthorized.tsx
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (user) {
      // Navigate to user's dashboard based on role
      navigate(`/${user.role}/dashboard`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-card dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-foreground dark:text-white mb-2">
          Unauthorized Access
        </h1>
        <p className="text-muted-foreground dark:text-gray-400 mb-6">
          You don't have permission to access this page.
        </p>
        <Button onClick={handleGoBack} className="w-full">
          Go Back
        </Button>
      </div>
    </div>
  );
}