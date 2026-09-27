import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Eye,
    EyeOff,
    Loader2,
    ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    login,
    register,
} from "../../store/thunks/auth.thunks";

const AuthForms = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        isLoading,
        error,
        isAuthenticated,
    } = useSelector((state) => state.auth);

    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState("");

    // --------------------------------------------------
    // Handle input changes
    // --------------------------------------------------

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setValidationError("");
    };

    // --------------------------------------------------
    // Validate form
    // --------------------------------------------------

    const validateForm = () => {
        const { name, email, password } = formData;

        if (!isLogin && !name.trim()) {
            return "Please enter your name.";
        }

        if (!email.trim()) {
            return "Please enter your email.";
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            return "Please enter a valid email address.";
        }

        if (!password) {
            return "Please enter your password.";
        }

        if (password.length < 6) {
            return "Password must be at least 6 characters.";
        }

        return "";
    };

    // --------------------------------------------------
    // Submit form
    // --------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        setValidationError("");

        const validationMessage = validateForm();

        if (validationMessage) {
            setValidationError(validationMessage);
            return;
        }

        if (isLogin) {
            await dispatch(
                login({
                    email: formData.email.trim(),
                    password: formData.password,
                })
            );
        } else {
            await dispatch(
                register({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                })
            );
        }
        // If login or register is successful, navigate to home
           if (
        login.fulfilled.match(result) ||
        register.fulfilled.match(result)
    ) {
        navigate("/");
    }
    };

    // --------------------------------------------------
    // Switch Login / Register
    // --------------------------------------------------

    const switchMode = () => {
        setIsLogin((prev) => !prev);

        setFormData({
            name: "",
            email: "",
            password: "",
        });

        setValidationError("");
        setShowPassword(false);
    };

    // --------------------------------------------------
    // Clear form after successful authentication
    // --------------------------------------------------

    useEffect(() => {
        if (isAuthenticated) {
            setFormData({
                name: "",
                email: "",
                password: "",
            });
        }
    }, [isAuthenticated]);

    const displayedError = validationError || error;

    return (
        <div className="w-full max-w-105">

            {/* ------------------------------------------ */}
            {/* Header */}
            {/* ------------------------------------------ */}

            <div className="mb-8">
                <h2 className="text-[30px] font-semibold tracking-tight text-folio-text">
                    {isLogin
                        ? "Welcome back"
                        : "Create your account"}
                </h2>

                <p className="mt-2 text-[14px] leading-relaxed text-folio-muted">
                    {isLogin
                        ? "Sign in to continue to your knowledge workspace."
                        : "Create an account and start building your knowledge base."}
                </p>
            </div>

            {/* ------------------------------------------ */}
            {/* Error */}
            {/* ------------------------------------------ */}

            {displayedError && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                    {displayedError}
                </div>
            )}

            {/* ------------------------------------------ */}
            {/* Form */}
            {/* ------------------------------------------ */}

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* Name - Register only */}
                {!isLogin && (
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-[13px] font-medium text-[#263238]"
                        >
                            Full name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            autoComplete="name"
                            disabled={isLoading}
                            className="h-11 w-full rounded-lg border border-[#d9e0e7] bg-white px-3.5 text-[14px] text-folio-text outline-none transition placeholder:text-[#a0aab5] focus:border-folio-accent focus:ring-2 focus:ring-folio-accent/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                        />
                    </div>
                )}

                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-[13px] font-medium text-[#263238]"
                    >
                        Email address
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={isLoading}
                        className="h-11 w-full rounded-lg border border-[#d9e0e7] bg-white px-3.5 text-[14px] text-folio-text outline-none transition placeholder:text-[#a0aab5] focus:border-folio-accent focus:ring-2 focus:ring-folio-accent/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                    />
                </div>

                {/* Password */}
                <div>
                    <div className="mb-2 flex items-center justify-between">

                        <label
                            htmlFor="password"
                            className="block text-[13px] font-medium text-[#263238]"
                        >
                            Password
                        </label>

                        {isLogin && (
                            <button
                                type="button"
                                className="text-[12px] font-medium text-folio-accent transition hover:text-[#2563a0]"
                                onClick={() => {
                                    // Forgot password will be implemented later
                                }}
                            >
                                Forgot password?
                            </button>
                        )}
                    </div>

                    <div className="relative">

                        <input
                            id="password"
                            name="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete={
                                isLogin
                                    ? "current-password"
                                    : "new-password"
                            }
                            disabled={isLoading}
                            className="h-11 w-full rounded-lg border border-[#d9e0e7] bg-white px-3.5 pr-11 text-[14px] text-folio-text outline-none transition placeholder:text-[#a0aab5] focus:border-folio-accent focus:ring-2 focus:ring-folio-accent/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    (prev) => !prev
                                )
                            }
                            disabled={isLoading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b98a6] transition hover:text-folio-accent disabled:cursor-not-allowed"
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOff size={17} />
                            ) : (
                                <Eye size={17} />
                            )}
                        </button>
                    </div>
                </div>

                {/* -------------------------------------- */}
                {/* Submit Button */}
                {/* -------------------------------------- */}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-folio-accent text-[14px] font-medium text-white shadow-sm transition hover:bg-[#3275b3] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isLoading ? (
                        <>
                            <Loader2
                                size={17}
                                className="animate-spin"
                            />

                            {isLogin
                                ? "Signing in..."
                                : "Creating account..."}
                        </>
                    ) : (
                        <>
                            {isLogin
                                ? "Sign in"
                                : "Create account"}

                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>

            {/* ------------------------------------------ */}
            {/* Divider */}
            {/* ------------------------------------------ */}

            <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e6eaf0]" />

                <span className="text-[12px] text-[#9aa5b1]">
                    OR
                </span>

                <div className="h-px flex-1 bg-[#e6eaf0]" />
            </div>

            {/* ------------------------------------------ */}
            {/* Google Button */}
            {/* ------------------------------------------ */}

            <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                    // Google OAuth will be implemented later
                }}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-[#d9e0e7] bg-white text-[14px] font-medium text-[#263238] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {/* Google Icon */}
                <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        fill="#4285F4"
                        d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z"
                    />

                    <path
                        fill="#34A853"
                        d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.75 9.75 0 0 0 12 21.75Z"
                    />

                    <path
                        fill="#FBBC05"
                        d="M6.53 13.83A5.86 5.86 0 0 1 6.22 12c0-.64.11-1.26.31-1.83V7.64H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.36l3.25-2.53Z"
                    />

                    <path
                        fill="#EA4335"
                        d="M12 6.14c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.17 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.72 5.39l3.25 2.53C7.3 7.86 9.46 6.14 12 6.14Z"
                    />
                </svg>

                Continue with Google
            </button>

            {/* ------------------------------------------ */}
            {/* Switch Login / Register */}
            {/* ------------------------------------------ */}

            <p className="mt-7 text-center text-[13px] text-folio-muted">
                {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}

                <button
                    type="button"
                    onClick={switchMode}
                    disabled={isLoading}
                    className="font-medium text-folio-accent transition hover:text-[#2563a0] disabled:cursor-not-allowed"
                >
                    {isLogin
                        ? "Create account"
                        : "Sign in"}
                </button>
            </p>

      

            
        </div>
    );
};

export default AuthForms;