import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/thunks/auth.thunks";

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading } = useSelector((state) => state.auth);
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

                          <button
        onClick={async () => {
            const result = await dispatch(logout());

            if (logout.fulfilled.match(result)) {
                navigate("/auth");
            }
        }}
        disabled={isLoading}
        className="mt-2 w-full rounded-lg px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
    >
        Logout
    </button>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1">
                    {/* Header */}
                    <header className="flex h-16 items-center justify-between border-b border-[#e5e7eb] bg-white px-6">
                        <div>
                            <h2 className="text-sm font-medium text-[#64748b]">
                                Dashboard
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf3fb] text-sm font-medium text-[#3275b3]">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>

                            <span className="hidden text-sm font-medium text-[#263238] sm:block">
                                  {user?.name || "User"}
                            </span>
                        </div>
                    </header>

                    {/* Content */}
                    <section className="p-6 md:p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#263238]">
                                Good morning, Anubhav 👋
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
        </div>
    );
};

export default Home;