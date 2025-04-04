
import { Dashboard } from "../components/Dashboard";
import PageTransition from "@/components/PageTransition";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background p-4">
        <Dashboard />
      </div>
    </PageTransition>
  );
};

export default Index;
