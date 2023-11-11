/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    transparent: "transparent",
    current: "currentColor",
    extend: {
      colors: {
        gray: {
          50: "#F7FAFC",
          900: "#171923",
        },
        orange: {
          500: "#ff8b1a",
        },
        // light mode
        tremor: {
          brand: {
            faint: "#e0edff", // blue-50
            muted: "#4b83ff25", // blue-200
            subtle: "#4b83ff25", // blue-400
            DEFAULT: "#0042da", // blue-500
            emphasis: "#806200", // blue-700
            inverted: "#ffffff", // white
          },
          background: {
            muted: "#F7FAFC", // gray-50
            subtle: "#EDF2F7", // gray-100
            DEFAULT: "#ffffff", // white
            emphasis: "#2D3748", // gray-700
          },
          border: {
            DEFAULT: "#E2E8F0", // gray-200
          },
          ring: {
            DEFAULT: "#E2E8F0", // gray-200
          },
          content: {
            subtle: "#A0AEC0", // gray-400
            DEFAULT: "#718096", // gray-500
            emphasis: "#2D3748", // gray-700
            strong: "#718096", // gray-900
            inverted: "#ffffff", // white
          },
        },
        // dark mode
        "dark-tremor": {
          brand: {
            faint: "#0B1229", // custom
            muted: "#4b83ff25", // blue-950
            subtle: "#4b83ff25", // blue-300
            DEFAULT: "#0042da", // blue-500
            emphasis: "#1a5fff", // blue-400
            inverted: "#1a202c", // gray-950
          },
          background: {
            muted: "#131A2B", // custom
            subtle: "#1A202C", // gray-800 --> gray-700
            DEFAULT: "#1A202C", // gray-900 --> gray-800
            emphasis: "#CBD5E0", // gray-300
          },
          border: {
            DEFAULT: "#242C3A", // gray-800 --> gray-750
          },
          ring: {
            DEFAULT: "#242C3A", // gray-800 --> gray-750
          },
          content: {
            subtle: "#4A5568", // gray-600
            DEFAULT: "#718096", // gray-500
            emphasis: "#E2E8F0", // gray-200
            strong: "#F7FAFC", // gray-50
            inverted: "#000000", // black
          },
        },
      },
      boxShadow: {
        // light
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        // dark
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },
      fontSize: {
        "tremor-label": ["0.75rem"],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      fontFamily: {
        sans: ["var(--font-open-sans)"],
        body: ["var(--font-open-sans)"],
        display: ["var(--font-outfit)"],
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  plugins: [require("@headlessui/tailwindcss")],
};
