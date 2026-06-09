import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  HomeIcon,
  PaperAirplaneIcon,
  ArrowsRightLeftIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

const Layout = () => {
  const { user, logout } = useAuth();
  const { firstName, lastName, email } = user || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem("darkMode") === "true" ||
      (!("darkMode" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
    { name: "Send Money", path: "/send", icon: PaperAirplaneIcon },
    { name: "Transactions", path: "/transactions", icon: ArrowsRightLeftIcon },
    { name: "Profile", path: "/profile", icon: UserCircleIcon },
  ];

  const getUserInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };
  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-[#0e0e11]">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-50 ${isCollapsed ? "w-20" : "w-64"} bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} h-20 px-6`}
          >
            <div
              className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"} transition-all duration-300`}
            >
              <div className="w-8 h-8 flex-shrink-0 bg-primary-600 dark:bg-primary-500 rounded flex items-center justify-center text-white font-bold text-lg shadow-sm">
                R
              </div>
              {!isCollapsed && (
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-opacity duration-300">
                  Rakam
                </span>
              )}
            </div>

            {/* Mobile Sidebar Close */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white ml-2"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Collapse Toggle Button (Desktop Only) */}
          <div className="hidden lg:flex px-4 items-center justify-center mb-2">
            <button
              onClick={toggleCollapse}
              className={`w-full flex items-center ${isCollapsed ? "justify-center" : "justify-end"} p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800`}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronDoubleRightIcon className="w-4 h-4 stroke-2" />
              ) : (
                <ChevronDoubleLeftIcon className="w-4 h-4 stroke-2" />
              )}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  title={isCollapsed ? item.name : ""}
                  className={`group flex items-center ${isCollapsed ? "justify-center px-0" : "px-3"} py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800/50 dark:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/40 dark:hover:text-white"
                  }`}
                >
                  <Icon
                    className={`flex-shrink-0 w-5 h-5 stroke-2 transition-colors ${
                      isActive
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    } ${!isCollapsed && "mr-3"}`}
                  />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-300">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section & Logout (Sidebar Bottom) */}
          <div className="absolute bottom-0 w-full border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 space-y-4">
            <div
              className={`flex items-center ${isCollapsed ? "justify-center" : "px-2"} transition-all duration-300`}
            >
              <div
                className="flex-shrink-0 w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 font-medium text-sm"
                title={firstName}
              >
                {getUserInitials(firstName, lastName)}
              </div>
              {!isCollapsed && (
                <div className="ml-3 truncate">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {firstName} {lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {email}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              title={isCollapsed ? "Sign out" : ""}
              className={`w-full flex items-center ${isCollapsed ? "justify-center" : "px-3"} py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-800/40 dark:hover:text-red-400 transition-colors`}
            >
              <ArrowRightOnRectangleIcon
                className={`w-5 h-5 stroke-2 ${!isCollapsed && "mr-3"}`}
              />
              {!isCollapsed && "Sign out"}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden dark:bg-[#0e0e11]">
          {/* Header */}
          <header className="flex-shrink-0 bg-white/80 dark:bg-[#0e0e11]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-10 sticky top-0">
            <div className="flex items-center justify-between h-20 px-6 sm:px-8">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden mr-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <Bars3Icon className="w-6 h-6 stroke-2" />
                </button>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white hidden sm:block capitalize">
                  {location.pathname.replace("/", "") || "Dashboard"}
                </h1>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-5">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <SunIcon className="w-5 h-5 stroke-2" />
                  ) : (
                    <MoonIcon className="w-5 h-5 stroke-2" />
                  )}
                </button>

                {/* Navbar Avatar */}
                <div className="flex items-center border-l pl-3 sm:pl-5 border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                        {firstName || "User"}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 font-medium text-sm border border-gray-200 dark:border-gray-700">
                      {getUserInitials(firstName, lastName)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-6 py-8 sm:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
