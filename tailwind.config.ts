import type { Config } from 'tailwindcss'

const config: Config = {
	darkMode: ['class'],
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			borderWidth: {
				'b-bottom': '0 0 0.2px 0',
				'b-sm': '0.2px'
			},
			keyframes: {
				loopAnimation: {
					to: {
						transform: 'translateX(0)'
					},
					'from, 10%': {
						transform: 'translateX(-100%)'
					}
				},
				scaleAnimation: {
					'0, 100%': {
						transform: 'scale(1.1)'
					},
					'50%': {
						transform: 'scale(0.9)'
					}
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'looping-image': 'loopAnimation 30s linear infinite',
				'scale-animation': 'scaleAnimation 3s ease-in-out infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			colors: {
				background: 'hsl(var(--background))',
				primary: {
					'700': '#92A0AD',
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					'700': '#213A5C',
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				blue: {
					'100': '#EEF4ED',
					'200': '#90A4B0',
					'300': '#758F99',
					'500': '#213A5C',
					'700': '#0E2038',
					'800': '#0d1c30'
				},
				gray: {
					'100': '#E1E1E6',
					'150': '#D9D9D9',
					'200': '#C4C4CC',
					'300': '#7C7C8A',
					'400': '#323238',
					'500': '#29292E',
					'600': '#202024',
					'700': '#121214'
				},
				green: {
					'300': '#92e27a',
					'500': '#007b00'
				},
				white: '#FFFFFF',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				inter: [
					'Inter',
					'sans-serif'
				],
				sans: [
					'Helvetica',
					'Arial',
					'sans-serif'
				]
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}
export default config