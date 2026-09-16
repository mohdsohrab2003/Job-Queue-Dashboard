import { Bell, ChevronDown } from "lucide-react";

function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      {/* Page title */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>

        <p className="text-sm text-slate-500">Manage your jobs</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <button
          className="
            relative rounded-lg p-2 text-slate-500
            transition hover:bg-slate-100 hover:text-slate-900
          "
        >
          <Bell size={21} />

          <span
            className="
              absolute right-1 top-1 h-2 w-2
              rounded-full bg-blue-600
            "
          />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200" />

        {/* User */}
        <button className="flex items-center gap-3">
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full bg-blue-100 font-semibold text-blue-700
            "
          >
            JD
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-900">John Doe</p>

            <p className="text-xs text-slate-500">Administrator</p>
          </div>

          <ChevronDown size={17} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
}

export default Header;
