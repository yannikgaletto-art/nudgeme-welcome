import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    toast({
      title: "Something went wrong",
      description: "Returning to home...",
      duration: 2000,
    });
  }, [location.pathname]);

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: "#F5E6D3" }}
    >
      <div className="text-6xl mb-6">🔍</div>
      <h1
        className="text-3xl font-semibold mb-2 text-center"
        style={{ color: "#2C3E50", fontFamily: "Inter, sans-serif" }}
      >
        Page not found
      </h1>
      <p
        className="text-base text-center mb-8 max-w-[300px]"
        style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}
      >
        The page you're looking for doesn't exist.
      </p>
      <Button
        variant="nudge"
        size="cta"
        onClick={handleReturn}
        className="max-w-[280px]"
      >
        Return Home
      </Button>
      <p
        className="text-xs mt-6 text-center"
        style={{ color: "rgba(44, 62, 80, 0.4)", fontFamily: "Inter, sans-serif" }}
      >
        Attempted: {location.pathname}
      </p>
    </div>
  );
};

export default NotFound;
