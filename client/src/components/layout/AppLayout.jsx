import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, getProfile, logout } from "../../store/thunks/auth.thunks";
import {
    LayoutDashboard,
    Database,
    MessageSquare,
    Settings,
    User,
    LogOut,
    ChevronDown,
    X,
    Mail,
    IdCard,
    Calendar,
    RefreshCw,
    Menu,
    Layers,
} from "lucide-react";

export default function AppLayout({ children, title = "Dashboard" }) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { user, isLoading } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isRefreshingProfile, setIsRefreshingProfile] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!user) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, user]);

    // Handle outside clicks and ESC key for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
                setIsProfileModalOpen(false);
                setIsMobileSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleGetProfile = async () => {
        setIsMenuOpen(false);
        setIsProfileModalOpen(true);
        setIsRefreshingProfile(true);
        try {
            await dispatch(getProfile()).unwrap();
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        } finally {
            setIsRefreshingProfile(false);
        }
    };

    const handleRefreshProfile = async () => {
        setIsRefreshingProfile(true);
        try {
            await dispatch(getProfile()).unwrap();
        } catch (err) {
            console.error("Failed to refresh profile:", err);
        } finally {
            setIsRefreshingProfile(false);
        }
    };

    const handleLogout = async () => {
        setIsMenuOpen(false);
        const result = await dispatch(logout());
        if (logout.fulfilled.match(result)) {
            navigate("/auth");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    const userInitial = user?.name?.charAt(0).toUpperCase() || "U";
    const displayName = user?.name || "User";
    const userEmail = user?.email || "No email available";

    const navItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/",
            isActive: location.pathname === "/",
        },
        {
            id: "knowledge-base",
            label: "Knowledge Bases",
            icon: Database,
            path: "/knowledge-base",
            isActive: location.pathname.startsWith("/knowledge-base"),
        },
        {
            id: "chat",
            label: "Chat",
            icon: MessageSquare,
            path: "/chat",
            isActive: location.pathname.startsWith("/chat"),
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#263238] flex flex-col">
            <div className="flex flex-1 min-h-screen">
                {/* Mobile sidebar overlay */}
                {isMobileSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-[#e5e7eb] bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
                        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="flex h-16 items-center justify-between border-b border-[#e5e7eb] px-6">
                        <div 
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2.5 cursor-pointer"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#3275b3] to-[#4fa0e4] text-white shadow-xs">
                                <Layers size={20} />
                            </div>
                            <h1 className="text-lg font-bold tracking-tight text-[#263238]">
                                Knowledge<span className="text-[#3275b3]">GPT</span>
                            </h1>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 md:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="p-4 space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        navigate(item.path);
                                        setIsMobileSidebarOpen(false);
                                    }}
                                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                                        item.isActive
                                            ? "bg-[#eaf3fb] text-[#3275b3] shadow-xs"
                                            : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#263238]"
                                    }`}
                                >
                                    <Icon size={18} className={item.isActive ? "text-[#3275b3]" : "text-[#94a3b8]"} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="absolute bottom-0 w-64 border-t border-[#e5e7eb] p-4 bg-white">
                        <button 
                            type="button"
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#64748b] hover:bg-[#f8fafc] hover:text-[#263238] transition-colors"
                        >
                            <Settings size={18} className="text-[#94a3b8]" />
                            <span>Settings</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col min-w-0">
                    {/* Header */}
                    <header className="relative flex h-16 items-center justify-between border-b border-[#e5e7eb] bg-white px-4 md:px-8 z-30">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsMobileSidebarOpen(true)}
                                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
                                aria-label="Open sidebar"
                            >
                                <Menu size={20} />
                            </button>
                            <h2 className="text-sm font-semibold text-[#64748b]">
                                {title}
                            </h2>
                        </div>

                        {/* User dropdown area */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen((prev) => !prev)}
                                aria-expanded={isMenuOpen}
                                aria-haspopup="true"
                                className="group flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-3 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#3275b3]/20"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf3fb] text-sm font-semibold text-[#3275b3] shadow-xs ring-2 ring-white transition-transform group-hover:scale-105">
                                    {userInitial}
                                </div>

                                <span className="hidden text-sm font-medium text-[#263238] sm:block">
                                    {displayName}
                                </span>

                                <ChevronDown
                                    size={16}
                                    className={`text-[#64748b] transition-transform duration-200 ${
                                        isMenuOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-[#e5e7eb] bg-white py-2 shadow-lg ring-1 ring-black/5 z-40 transition-all animate-in fade-in-0 zoom-in-95">
                                    {/* User header info */}
                                    <div className="border-b border-[#f1f5f9] px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf3fb] text-base font-semibold text-[#3275b3]">
                                                {userInitial}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <p className="truncate text-sm font-semibold text-[#263238]">
                                                    {displayName}
                                                </p>
                                                <p className="truncate text-xs text-[#64748b]">
                                                    {userEmail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-1">
                                        <button
                                            type="button"
                                            onClick={handleGetProfile}
                                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#334155] hover:bg-[#f1f5f9] transition-colors"
                                        >
                                            <User size={16} className="text-[#3275b3]" />
                                            <span>Get Profile</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            disabled={isLoading}
                                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            <LogOut size={16} className="text-red-500" />
                                            <span>{isLoading ? "Logging out..." : "Logout"}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Content slot */}
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>

            {/* Profile Modal */}
            {isProfileModalOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs transition-opacity animate-in fade-in-0"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsProfileModalOpen(false);
                    }}
                >
                    <div 
                        className="relative w-full max-w-md rounded-2xl border border-[#e5e7eb] bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-150"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-[#f1f5f9] px-6 py-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf3fb] text-[#3275b3]">
                                    <User size={18} />
                                </div>
                                <h3 className="text-base font-semibold text-[#263238]">
                                    User Profile
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsProfileModalOpen(false)}
                                className="rounded-lg p-1.5 text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#263238] transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {/* Avatar & Display Name */}
                            <div className="mb-6 flex flex-col items-center text-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf3fb] text-2xl font-bold text-[#3275b3] ring-4 ring-[#eaf3fb]/60">
                                    {userInitial}
                                </div>
                                <h4 className="mt-3 text-lg font-semibold text-[#263238]">
                                    {displayName}
                                </h4>
                                <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                    Active Account
                                </span>
                            </div>

                            {/* Details List */}
                            <div className="space-y-3 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4 text-sm">
                                <div className="flex items-center justify-between gap-2 border-b border-[#e5e7eb]/60 pb-3">
                                    <div className="flex items-center gap-2 text-[#64748b]">
                                        <Mail size={16} />
                                        <span>Email</span>
                                    </div>
                                    <span className="font-medium text-[#263238] truncate max-w-[200px]">
                                        {userEmail}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-2 border-b border-[#e5e7eb]/60 pb-3">
                                    <div className="flex items-center gap-2 text-[#64748b]">
                                        <IdCard size={16} />
                                        <span>User ID</span>
                                    </div>
                                    <span className="font-mono text-xs text-[#263238] truncate max-w-[180px]">
                                        {user?._id || user?.id || "N/A"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-[#64748b]">
                                        <Calendar size={16} />
                                        <span>Joined</span>
                                    </div>
                                    <span className="font-medium text-[#263238]">
                                        {formatDate(user?.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between border-t border-[#f1f5f9] bg-[#fafafa] px-6 py-3.5 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={handleRefreshProfile}
                                disabled={isRefreshingProfile}
                                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#3275b3] hover:bg-[#eaf3fb] transition-colors disabled:opacity-50"
                            >
                                <RefreshCw 
                                    size={14} 
                                    className={isRefreshingProfile ? "animate-spin" : ""} 
                                />
                                <span>{isRefreshingProfile ? "Refreshing..." : "Refresh Profile"}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsProfileModalOpen(false)}
                                className="rounded-lg bg-[#3275b3] px-4 py-2 text-xs font-medium text-white hover:bg-[#28699f] transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
