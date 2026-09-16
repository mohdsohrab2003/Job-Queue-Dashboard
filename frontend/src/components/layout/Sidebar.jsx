import {
  BarChart3,
  BriefcaseBusiness,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const navItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/create-job",
      label: "Create Job",
      icon: Plus,
    },
    {
      to: "/all-jobs",
      label: "All Jobs",
      icon: BriefcaseBusiness,
    },
    {
      to: "/statistics",
      label: "Statistics",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-slate-950 text-white">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-800 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <BriefcaseBusiness size={20} />
          </div>

          <span className="text-xl font-bold">JobTracker</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Menu
        </p>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `
                  flex w-full items-center gap-3 rounded-lg
                  px-4 py-3 text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }
                  `
                }
              >
                <Icon size={19} />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-800 p-4">
        <p className="text-xs text-slate-500">Job Queue Dashboard</p>

        <p className="mt-1 text-xs text-slate-600">v1.0.0</p>
      </div>
    </aside>
  );
}

export default Sidebar;
