/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        poppins: ["Poppins", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "fade-in-out": "fadeInOut 3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "bounce-slow": "bounce 2s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        ripple: "ripple 0.6s ease-out",
        shimmer: "shimmer 2s ease-in-out infinite",
        heartbeat: "heartbeat 1.5s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInOut: {
          "0%": { opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { filter: "drop-shadow(0 0 5px rgba(168, 85, 247, 0.4))" },
          "100%": { filter: "drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        shimmer:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
      },
      maxWidth: {
        "screen-2xl": "1536px",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-inset": "inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)",
        glow: "0 0 20px rgba(147, 51, 234, 0.4)",
        "glow-lg": "0 0 40px rgba(147, 51, 234, 0.6)",
      },
      // keyframes: {
      //   spinGradient: {
      //     "0%": { transform: "rotate(0deg)" },
      //     "100%": { transform: "rotate(360deg)" },
      //   },
      // },
      // animation: {
      //   spinGradient: "spinGradient 4s linear infinite",
      // },
    },
  },
  plugins: [
    function ({ addUtilities, addComponents }) {
      const newUtilities = {
        ".scrollbar-thin": {
          "scrollbar-width": "thin",
        },
        ".scrollbar-thumb-gray-300": {
          "scrollbar-color": "#d1d5db transparent",
        },
        ".scrollbar-thumb-gray-600": {
          "scrollbar-color": "#4b5563 transparent",
        },
        ".scrollbar-track-transparent": {
          "scrollbar-track-color": "transparent",
        },
        ".scrollbar-thin::-webkit-scrollbar": {
          width: "6px",
        },
        ".scrollbar-thin::-webkit-scrollbar-track": {
          background: "transparent",
        },
        ".scrollbar-thin::-webkit-scrollbar-thumb": {
          "background-color": "#d1d5db",
          "border-radius": "3px",
        },
        ".dark .scrollbar-thin::-webkit-scrollbar-thumb": {
          "background-color": "#4b5563",
        },
        ".scrollbar-thin::-webkit-scrollbar-thumb:hover": {
          "background-color": "#9ca3af",
        },
        ".dark .scrollbar-thin::-webkit-scrollbar-thumb:hover": {
          "background-color": "#6b7280",
        },
        ".glass": {
          background: "rgba(255, 255, 255, 0.1)",
          "backdrop-filter": "blur(20px)",
          "-webkit-backdrop-filter": "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".glass-dark": {
          background: "rgba(0, 0, 0, 0.1)",
          "backdrop-filter": "blur(20px)",
          "-webkit-backdrop-filter": "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".scrollbar-hide": {
          "scrollbar-width": "none" /* Firefox */,
          "-ms-overflow-style": "none" /* IE and Edge */,
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none" /* Chrome, Safari, Opera */,
        },
      };

      const newComponents = {
        ".btn-glow": {
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "-100%",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            transition: "left 0.5s",
          },
          "&:hover::before": {
            left: "100%",
          },
        },
        ".ripple-effect": {
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "0",
            height: "0",
            "border-radius": "50%",
            background: "rgba(255, 255, 255, 0.5)",
            transform: "translate(-50%, -50%)",
            transition: "width 0.6s, height 0.6s",
          },
          "&:active::after": {
            width: "300px",
            height: "300px",
          },
        },
      };

      addUtilities(newUtilities);
      addComponents(newComponents);
    },
  ],
};
