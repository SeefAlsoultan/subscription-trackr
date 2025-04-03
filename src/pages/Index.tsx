
import { Dashboard } from "../components/Dashboard";
import SupabaseConnectionTest from "../components/SupabaseConnectionTest";

const Index = () => {
  return (
    <>
      <SupabaseConnectionTest />
      <Dashboard />
    </>
  );
};

export default Index;
