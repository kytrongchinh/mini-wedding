module.exports = {
	purge: {
		enabled: true,
		content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
	},
	theme: {
		extend: {
			extend: {
				colors: {
					primary: {
						default: "#2563eb",
						light: "#3b82f6",
						dark: "#1e40af",
					},
					secondary: {
						default: "#9333ea",
						light: "#a855f7",
						dark: "#6b21a8",
					},
					neutral: {
						100: "#f3f4f6",
						200: "#e5e7eb",
						300: "#d1d5db",
						800: "#1f2937",
						900: "#111827",
					},
				},

				backgroundImage: {
					"gradient-radial": "radial-gradient(circle, var(--tw-gradient-stops))",
					"gradient-conic": "conic-gradient(from 180deg, var(--tw-gradient-stops))",
					"hero-pattern": "url('/public/images/bg/hero.png')",
				},

				spacing: {
					15: "3.75rem", // 60px
					30: "7.5rem", // 120px
					70: "17.5rem", // 280px
				},

				borderRadius: {
					"2xl": "1rem",
					"3xl": "1.5rem",
					"4xl": "2rem",
				},

				transitionProperty: {
					height: "height",
					spacing: "margin, padding",
					"colors-opacity": "background-color, border-color, color, fill, stroke, opacity",
				},
				transitionDuration: {
					0: "0ms",
					2000: "2000ms",
					3000: "3000ms",
				},
				transitionTimingFunction: {
					"in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
					"out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
				},
				transitionDelay: {
					400: "400ms",
					600: "600ms",
				},

				fontFamily: {
					inter: ["Inter", "sans-serif"],
					noto: ["Noto Sans", "sans-serif"],
				},

				boxShadow: {
					soft: "0 2px 10px rgba(0,0,0,0.08)",
					strong: "0 4px 20px rgba(0,0,0,0.15)",
					inner: "inset 0 2px 6px rgba(0,0,0,0.1)",
				},

				keyframes: {
					"fade-in": {
						"0%": { opacity: 0 },
						"100%": { opacity: 1 },
					},
					"slide-up": {
						"0%": { transform: "translateY(20px)", opacity: 0 },
						"100%": { transform: "translateY(0)", opacity: 1 },
					},
					"pulse-soft": {
						"0%, 100%": { opacity: 1 },
						"50%": { opacity: 0.5 },
					},
					wiggle: {
						"0%, 100%": { transform: "rotate(-3deg)" },
						"50%": { transform: "rotate(3deg)" },
					},
				},

				animation: {
					"fade-in": "fade-in 0.5s ease-in-out",
					"slide-up": "slide-up 0.5s ease-out",
					"pulse-soft": "pulse-soft 2s infinite",
					wiggle: "wiggle 1s ease-in-out infinite",
				},
			},
		},
	},
};
