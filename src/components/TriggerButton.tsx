import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const TriggerButton = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="p-1.5 bg-blue-100 hover:bg-blue-200 transition rounded-sm"
    >
      <Menu className="w-5 h-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
};

export default TriggerButton;
