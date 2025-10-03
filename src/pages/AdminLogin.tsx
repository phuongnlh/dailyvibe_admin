import {
  Stars,
  Sparkles,
  Download,
  ArrowRight,
  Loader2,
  EyeOff,
  Eye,
  Mail,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import React, { useCallback, useState } from "react";
import type { LoginData } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import PekodaLogo from "../components/PekodaLogo";
import { toast } from "react-toastify";
import { validateEmail } from "../utils/validation";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

// Constants
const MIN_PASSWORD_LENGTH = 6;

const FIELD_CLASSES = {
  base: "block w-full py-2 sm:py-2.5 border rounded-lg sm:rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ease-in-out hover:shadow-md text-sm",
  normal: "border-gray-300",
  error: "border-red-300 bg-red-50 focus:ring-red-500",
  focus: "focus:ring-[#6a0dad]",
} as const;

// Separate InputField component to prevent re-render issues
const InputField = React.memo(
  ({
    icon: Icon,
    type,
    name,
    label,
    placeholder,
    value,
    error,
    rightElement,
    onChange,
  }: {
    icon: any;
    type: string;
    name: string;
    label: string;
    placeholder: string;
    value: string;
    error?: string;
    rightElement?: React.ReactNode;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => {
    const getInputClassName = (hasError: boolean, extraClasses = "") => {
      const errorClasses = hasError
        ? FIELD_CLASSES.error
        : FIELD_CLASSES.normal;
      return `${FIELD_CLASSES.base} ${errorClasses} ${FIELD_CLASSES.focus} ${extraClasses}`;
    };

    return (
      <div className="space-y-1">
        <label
          htmlFor={name}
          className="block text-xs sm:text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
            <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          </div>
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={getInputClassName(
              !!error,
              rightElement
                ? "pl-8 sm:pl-10 pr-8 sm:pr-10"
                : "pl-8 sm:pl-10 pr-3"
            )}
            placeholder={placeholder}
            autoComplete={
              name === "email"
                ? "email"
                : name === "password"
                ? "current-password"
                : "off"
            }
          />
          {rightElement}
        </div>
        {error && (
          <p className="text-xs text-red-600 animate-slide-up">{error}</p>
        )}
      </div>
    );
  }
);
const AdminLogin = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  // Helper functions
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      if (prev[fieldName as keyof FormErrors]) {
        return { ...prev, [fieldName]: undefined };
      }
      return prev;
    });
  }, []);

  const handleApiError = useCallback((error: any, defaultMessage: string) => {
    const errorMessage = error.response?.data?.message || defaultMessage;
    setErrors({ general: errorMessage });
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      clearFieldError(name);
    },
    [clearFieldError]
  );

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (error: any) {
      console.error("Login error:", error);
      handleApiError(error, "Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-white/10 animate-pulse-slow">
          <Stars size={40} />
        </div>
        <div className="absolute top-40 right-20 text-white/10 animate-pulse-slow delay-1000">
          <Sparkles size={32} />
        </div>
        <div className="absolute bottom-32 left-20 text-white/10 animate-pulse-slow delay-2000">
          <Stars size={40} />
        </div>
        <div className="absolute bottom-20 right-10 text-white/10 animate-pulse-slow delay-500">
          <Sparkles size={20} />
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
          <div className="flex flex-col lg:flex-row min-h-[500px] max-h-[85vh]">
            {/* Left side - Brand illustration */}
            <div className="lg:w-1/2 bg-gradient-to-br from-[#431c66] via-[#6a0dad] to-[#a83279] p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20"></div>
              <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse-slow"></div>
              <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse-slow delay-1000"></div>

              {/* Pekoda logo with enhanced animations */}
              <div className="relative z-10 text-center animate-slide-in-left">
                <div className="mb-4 sm:mb-2 animate-float">
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-30 animate-pulse-slow"></div>
                    {/* Logo with multiple animations */}
                    <div className="relative transform hover:scale-110 transition-all duration-500 animate-bounce-slow">
                      <PekodaLogo
                        size="lg"
                        showText={true}
                        textColor="text-white"
                        className="animate-glow"
                      />
                    </div>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 font-poppins animate-fade-in-up">
                  Welcome to Pekoda
                </h1>
                <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium mb-3 sm:mb-4 animate-fade-in-up delay-200">
                  Experience the full Pekoda on mobile devices
                </p>

                {/* Download App */}
                <motion.div
                  className="mt-2 bg-gradient-to-br from-[#FCCBF0]/40 to-[#FF5A57]/20 dark:from-[#1B2062]/30 dark:to-[#6700A3]/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-[#E02F75]/20 dark:border-[#6700A3]/30"
                  style={{
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                >
                  <motion.div
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-gradient-to-br from-[#E02F75] to-[#6700A3] rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg"
                  >
                    <Download className="w-6 h-6 text-white" />
                  </motion.div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 font-poppins">
                    Download the App
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Experience the full Pekoda on mobile devices
                  </p>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px rgba(224, 47, 117, 0.4)",
                    }}
                    onClick={() => {
                      toast.info("This feature is coming soon!");
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-[#E02F75] to-[#6700A3] text-white py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-[#E02F75]/25"
                  >
                    Download
                  </motion.button>
                </motion.div>
              </div>
            </div>

            {/* Right side - Auth forms */}
            <div className="lg:w-1/2 p-3 sm:p-4 lg:p-6 flex flex-col justify-center animate-slide-in-right bg-white overflow-y-hidden">
              <div className="w-full max-w-sm mx-auto">
                {/* Header */}
                <div className="text-center mb-3 sm:mb-4">
                  <div className="inline-flex items-center justify-center mb-2 sm:mb-3">
                    <div className="animate-pulse-slow">
                      <PekodaLogo
                        size="md"
                        className="shadow-lg hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 font-poppins">
                    Pekoda
                  </h2>
                  <p className="text-gray-600 text-sm">Welcome back!</p>
                </div>

                {/* Auth Forms with transition */}
                <div className="relative">
                  <div className="transition-all duration-500 ease-in-out opacity-100 translate-x-0">
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-3 font-sans"
                    >
                      {/* Header */}
                      <div className="text-center mb-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 font-poppins">
                          Login with your Admin account
                        </h3>
                      </div>

                      {/* General Error Message */}
                      {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-2 sm:p-3 text-red-600 text-xs sm:text-sm animate-slide-up">
                          {errors.general}
                        </div>
                      )}

                      {/* Email Field */}
                      <InputField
                        icon={Mail}
                        type="email"
                        name="email"
                        label="Email Address"
                        placeholder="Enter your email"
                        value={formData.email}
                        error={errors.email}
                        onChange={handleChange}
                      />

                      {/* Password Field */}
                      <InputField
                        icon={Lock}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        value={formData.password}
                        error={errors.password}
                        onChange={handleChange}
                        rightElement={
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center transition-colors duration-200"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 hover:text-gray-600" />
                            ) : (
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        }
                      />

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center px-3 sm:px-4 py-2 sm:py-2.5 border border-transparent rounded-lg sm:rounded-xl shadow-xl text-sm font-medium text-white bg-[#6a0dad] hover:bg-[#4b0082] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6a0dad] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-2xl transform"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">
                              Logging in...
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm">Login</span>
                            <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-3 sm:mt-4 text-white/70">
          <p className="text-xs">© 2025 Pekoda.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
