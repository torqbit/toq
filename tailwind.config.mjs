import typography from "@tailwindcss/typography";

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            code: {
              backgroundColor: "#f3f4f6", // Tailwind's gray-100
              color: "#111827", // Tailwind's gray-900
              padding: "0.2em 0.4em",
              borderRadius: "0.25rem",
            },
            "pre code": {
              backgroundColor: "transparent",
              padding: 0,
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};
