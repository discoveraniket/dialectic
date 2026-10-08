/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // VS Code Dark Theme color palette
        vscode: {
          titleBar: '#181818',
          activityBar: '#181818',
          activityBarBadge: '#0078d4',
          sidebar: '#1e1e1e',
          sidebarBorder: '#2b2b2b',
          editorGroupHeader: '#1e1e1e',
          tabActive: '#1e1e1e',
          tabInactive: '#181818',
          tabBorder: '#2b2b2b',
          editorBg: '#1e1e1e',
          panelBg: '#181818',
          panelBorder: '#2b2b2b',
          statusBar: '#007acc',
          statusBarBorder: '#007acc',
          statusItemHover: '#1f8ad2',
          highlight: '#37373d',
          inputBg: '#313131',
          inputBorder: '#3c3c3c',
          textMuted: '#858585',
          textPrimary: '#cccccc',
          textBright: '#ffffff',
          accent: '#0078d4',
          accentHover: '#026ec1',
          diffAdded: '#238636',
          diffRemoved: '#da3633',
        }
      },
      fontFamily: {
        mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
