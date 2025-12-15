import { useLocation } from "react-router-dom";

type DoGoodScenario = "office" | "home" | "date" | "stranger" | "friends" | "sport";

const CheckInQuestion = () => {
  const location = useLocation();
  const scenario = location.state?.scenario as DoGoodScenario;

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#F5E6D3" }}
    >
      <h1
        className="text-[28px] md:text-[32px] font-semibold text-center"
        style={{
          fontFamily: "'Playfair Display', serif",
          color: "#2C3E50",
        }}
      >
        Check-in Question
      </h1>
      <p className="mt-4 text-base text-center" style={{ color: "#6B7280" }}>
        Scenario: {scenario || "Not selected"}
      </p>
      <p className="mt-2 text-sm text-center" style={{ color: "#6B7280" }}>
        (Part 2 - Coming soon)
      </p>
    </main>
  );
};

export default CheckInQuestion;
