import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Eye,
    EyeOff,
    Loader2,
    ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {
    login,
    register,
    googleLogin,
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
        let result;

        if (isLogin) {
            result= await dispatch(
                login({
                    email: formData.email.trim(),
                    password: formData.password,
                })
            );
        } else {
            result= await dispatch(
                register({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                })
            );
        }
        console.log("AUTH RESULT:", result);
console.log("IS LOGIN FULFILLED:", login.fulfilled.match(result));
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

            <div className="flex w-full justify-center">
                <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                        if (credentialResponse.credential) {
                            const res = await dispatch(
                                googleLogin(credentialResponse.credential)
                            );
                            if (googleLogin.fulfilled.match(res)) {
                                navigate("/");
                            }
                        }
                    }}
                    onError={() => {
                        setValidationError(
                            "Google authentication was cancelled or failed."
                        );
                    }}
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    text="continue_with"
                    width="100%"
                />
            </div>

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