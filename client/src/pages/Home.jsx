import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, getProfile, logout } from "../store/thunks/auth.thunks";
import { 
    User, 
    LogOut, 
    ChevronDown, 
    X, 
    Mail, 
    IdCard, 
    Calendar, 
    RefreshCw
} from "lucide-react";

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isRefreshingProfile, setIsRefreshingProfile] = useState(false);

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

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="flex min-h-screen">

                {/* Sidebar */}
                <aside className="hidden w-64 border-r border-[#e5e7eb] bg-white md:block">
                    <div className="flex h-16 items-center border-b border-[#e5e7eb] px-6">
                        <h1 className="text-xl font-semibold text-[#263238]">
                            KnowledgeGPT
                        </h1>
                    </div>

                    <nav className="p-4">
                        <button
                            onClick={() => navigate("/")}
                            className="w-full rounded-lg bg-[#eaf3fb] px-4 py-3 text-left text-sm font-medium text-[#3275b3]"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() => navigate("/knowledge-base")}
                            className="mt-2 w-full rounded-lg px-4 py-3 text-left text-sm text-[#64748b] hover:bg-[#f8fafc]"
                        >
                            Knowledge Bases
                        </button>

                        <button
                            onClick={() => navigate("/chat")}
                            className="mt-2 w-full rounded-lg px-4 py-3 text-left text-sm text-[#64748b] hover:bg-[#f8fafc]"
                        >
                            Chat
                        </button>
                    </nav>

                    <div className="absolute bottom-0 w-64 border-t border-[#e5e7eb] p-4">
                        <button className="w-full rounded-lg px-4 py-3 text-left text-sm text-[#64748b] hover:bg-[#f8fafc]">
                            Settings
                        </button>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1">
                    {/* Header */}
                    <header className="relative flex h-16 items-center justify-between border-b border-[#e5e7eb] bg-white px-6">
                        <div>
                            <h2 className="text-sm font-medium text-[#64748b]">
                                Dashboard
                            </h2>
                        </div>

                        {/* User dropdown area */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen((prev) => !prev)}
                                aria-expanded={isMenuOpen}
                                aria-haspopup="true"
                                className="group flex items-center gap-3 rounded-full py-1.5 pl-2 pr-3 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#3275b3]/20"
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

                    {/* Content */}
                    <section className="p-6 md:p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#263238]">
                                Good morning, {user?.name ? user.name.split(" ")[0] : "there"} 👋
                            </h1>

                            <p className="mt-2 text-sm text-[#64748b]">
                                What would you like to research today?
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
                                <p className="text-sm text-[#64748b]">
                                    Knowledge Bases
                                </p>

                                <p className="mt-2 text-3xl font-semibold text-[#263238]">
                                    0
                                </p>
                            </div>

                            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
                                <p className="text-sm text-[#64748b]">
                                    Documents
                                </p>

                                <p className="mt-2 text-3xl font-semibold text-[#263238]">
                                    0
                                </p>
                            </div>

                            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
                                <p className="text-sm text-[#64748b]">
                                    Conversations
                                </p>

                                <p className="mt-2 text-3xl font-semibold text-[#263238]">
                                    0
                                </p>
                            </div>

                        </div>

                        {/* Knowledge Bases */}
                        <div className="mt-10">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-[#263238]">
                                    Your Knowledge Bases
                                </h2>

                                <button className="text-sm font-medium text-[#3275b3] hover:underline">
                                    View all
                                </button>
                            </div>

                            <div className="rounded-xl border border-dashed border-[#d9e0e7] bg-white p-10 text-center">
                                <h3 className="text-sm font-medium text-[#263238]">
                                    No knowledge bases yet
                                </h3>

                                <p className="mt-2 text-sm text-[#64748b]">
                                    Create your first knowledge base to start
                                    researching your documents.
                                </p>

                                <button className="mt-5 rounded-lg bg-[#3275b3] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#28699f]">
                                    Create Knowledge Base
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
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
};

export default Home;