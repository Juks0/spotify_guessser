# Background Colors Documentation

This document lists all the places where background colors are changed in the Spotify Guesser project.

## 🎨 CSS Variables (Theme System)

### Light Theme (`:root`)
**File**: `src/index.css`

- `--background: oklch(1 0 0)` - Main background (white)
- `--card: oklch(1 0 0)` - Card background (white)
- `--popover: oklch(1 0 0)` - Popover background (white)
- `--secondary: oklch(0.97 0 0)` - Secondary background (light gray)
- `--muted: oklch(0.97 0 0)` - Muted background (light gray)
- `--accent: oklch(0.97 0 0)` - Accent background (light gray)
- `--sidebar: oklch(0.985 0 0)` - Sidebar background (very light gray)
- `--sidebar-accent: oklch(0.97 0 0)` - Sidebar accent (light gray)
- `--border: oklch(0.922 0 0)` - Border color (light gray)
- `--input: oklch(0.922 0 0)` - Input background (light gray)

### Dark Theme (`.dark`)
**File**: `src/index.css`

- `--background: oklch(0.145 0 0)` - Main background (dark gray)
- `--card: oklch(0.145 0 0)` - Card background (dark gray)
- `--popover: oklch(0.145 0 0)` - Popover background (dark gray)
- `--secondary: oklch(0.269 0 0)` - Secondary background (medium dark gray)
- `--muted: oklch(0.269 0 0)` - Muted background (medium dark gray)
- `--accent: oklch(0.269 0 0)` - Accent background (medium dark gray)
- `--sidebar: oklch(0.205 0 0)` - Sidebar background (darker gray)
- `--sidebar-accent: oklch(0.269 0 0)` - Sidebar accent (medium dark gray)
- `--border: oklch(0.269 0 0)` - Border color (medium dark gray)
- `--input: oklch(0.269 0 0)` - Input background (medium dark gray)

## 🎨 Scrollbar Backgrounds

### Light Theme Scrollbars
**File**: `src/index.css`

- `.custom-scrollbar::-webkit-scrollbar-track` - `rgba(255, 255, 255, 0.1)` (very light white)
- `.custom-scrollbar::-webkit-scrollbar-thumb` - `rgba(255, 255, 255, 0.3)` (semi-transparent white)
- `.custom-scrollbar::-webkit-scrollbar-thumb:hover` - `rgba(255, 255, 255, 0.5)` (more opaque white)

### Dark Theme Scrollbars
**File**: `src/index.css`

- `.dark .custom-scrollbar::-webkit-scrollbar-track` - `rgba(255, 255, 255, 0.05)` (very transparent white)
- `.dark .custom-scrollbar::-webkit-scrollbar-thumb` - `rgba(255, 255, 255, 0.15)` (semi-transparent white)
- `.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover` - `rgba(255, 255, 255, 0.3)` (more opaque white)

## 🎨 Inline Styles (Hardcoded Colors)

### App.tsx
**File**: `src/App.tsx`

- Music Dashboard button: `backgroundColor: '#1DB954'` (Spotify green)
- Top Artists button: `backgroundColor: '#1DB954'` (Spotify green)
- Top Tracks button: `backgroundColor: '#1DB954'` (Spotify green)
- Quiz Game button: `backgroundColor: '#1DB954'` (Spotify green)
- Login button: `backgroundColor: '#1DB954'` (Spotify green)

### Navbar.tsx
**File**: `src/components/Navbar.tsx`

- Loading navbar: `background: '#282c34'` (dark gray)
- Main navbar: `background: '#282c34'` (dark gray)

### ProtectedRoute.tsx
**File**: `src/components/ProtectedRoute.tsx`

- Login button: `backgroundColor: '#1DB954'` (Spotify green)

## 🎨 Tailwind CSS Classes

### Music Dashboard Component
**File**: `src/components/music-dashboard.tsx`

- Main container: `bg-background` (uses CSS variable)
- Loading skeletons: `bg-muted` (uses CSS variable)
- Hover states: `hover:bg-muted/50` (semi-transparent muted)
- Friend avatar fallback: `bg-primary/10` (primary color with 10% opacity)

### UI Components
**Files**: `src/components/ui/*.tsx`

- Various components use Tailwind classes like:
  - `bg-background` - Main background
  - `bg-card` - Card background
  - `bg-muted` - Muted background
  - `bg-primary` - Primary background
  - `bg-secondary` - Secondary background
  - `bg-accent` - Accent background
  - `bg-destructive` - Destructive background
  - `bg-transparent` - Transparent background

## 🎨 Component-Specific Backgrounds

### Friends.tsx
**File**: `src/components/Friends.tsx`

- Multiple inline styles with hardcoded colors:
  - `backgroundColor: 'white'` - White backgrounds
  - `backgroundColor: '#f8f9fa'` - Light gray backgrounds
  - `backgroundColor: '#28a745'` - Green backgrounds
  - `backgroundColor: '#007bff'` - Blue backgrounds
  - `backgroundColor: '#dc3545'` - Red backgrounds
  - `backgroundColor: '#e3f2fd'` - Light blue backgrounds
  - `backgroundColor: '#e8f5e8'` - Light green backgrounds
  - `backgroundColor: 'rgba(0,0,0,0.5)'` - Semi-transparent black overlay

### QuizGame.tsx
**File**: `src/components/QuizGame.tsx`

- Multiple inline styles with hardcoded colors:
  - `backgroundColor: '#007bff'` - Blue backgrounds
  - `backgroundColor: '#28a745'` - Green backgrounds
  - `backgroundColor: '#f8f9fa'` - Light gray backgrounds
  - `backgroundColor: '#ffffff'` - White backgrounds

## 📝 Notes

1. **Theme System**: The project uses CSS custom properties for theme support, allowing easy switching between light and dark modes.

2. **Spotify Branding**: Many buttons use `#1DB954` (Spotify green) for brand consistency.

3. **Accessibility**: The color system is designed with proper contrast ratios for accessibility.

4. **Consistency**: Most components use the CSS variable system rather than hardcoded colors for better maintainability.

5. **Scrollbars**: Custom scrollbar styling is implemented for better visual consistency across browsers.

## 🔧 Maintenance

When adding new background colors:
1. Use CSS variables when possible for theme support
2. Follow the existing color naming convention
3. Test both light and dark themes
4. Ensure proper contrast ratios for accessibility
5. Document new colors in this file
