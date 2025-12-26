const { light } = require('./src/_assets/themes/themes');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
    mode: 'jit',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		screens: {
  			xs: '450px'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: 0
  				},
  				'100%': {
  					opacity: 1
  				}
  			},
  			marquee: {
  				'0%': {
  					transform: 'translateX(0%)'
  				},
  				'100%': {
  					transform: 'translateX(-100%)'
  				}
  			},
  			marquee2: {
  				'0%': {
  					transform: 'translateX(100%)'
  				},
  				'100%': {
  					transform: 'translateX(0%)'
  				}
  			}
  		},
  		animation: {
  			fadeIn: 'fadeIn 1.3s ease-in-out',
  			'spin-slow-30': 'spin 30s linear infinite',
  			'spin-slow-25': 'spin 25s linear infinite',
  			'spin-slow-10': 'spin 10s linear infinite',
  			'marquee-infinite': 'marquee 25s linear infinite'
  		},
  		colors: {
                ...light,
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
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
  			nunitobold700: [
  				'BoldFont700'
  			],
  			nunitosemiBold600: [
  				'SemiBoldFont600'
  			],
  			nunitoregular400: [
  				'RegularFont400'
  			],
  			titleRegular: [
  				'SFProDisplayRegular'
  			],
  			titleUltraLightItalic: [
  				'SFProDisplayUltraLightItalic'
  			],
  			titleThinItalic: [
  				'SFProDisplayThinItalic'
  			],
  			titleLightItalic: [
  				'SFProDisplayLightItalic'
  			],
  			titleMedium: [
  				'SFProDisplayMedium'
  			],
  			titleSemiBoldItalic: [
  				'SFProDisplaySemiBoldItalic'
  			],
  			titleBold: [
  				'SFProDisplayBold'
  			],
  			titleHeavyItalic: [
  				'SFProDisplayHeavyItalic'
  			],
  			titleBlackItalic: [
  				'SFProDisplayBlackItalic'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  variants: {
    extend: {
      scale: ['active']
    }
  },
  plugins: [require("tailwindcss-animate")],
}

