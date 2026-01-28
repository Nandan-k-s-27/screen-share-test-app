# Screen Share Test App

A Next.js application demonstrating browser screen-sharing capabilities using the native `getDisplayMedia` Web API. This app showcases proper permission handling, media stream lifecycle management, and clean React state management.

## 🚀 Live Demo

[(https://screen-share-test-app.vercel.app/)]

## ✨ Features

- **Browser Support Detection**: Verifies `getDisplayMedia` API availability before allowing navigation
- **Multiple Permission States**: Distinct handling for requesting, granted, cancelled, denied, and error states
- **Live Screen Preview**: Real-time video preview of shared screen/window/tab
- **Stream Metadata Display**: Shows display type, resolution, and frame rate
- **Lifecycle Detection**: Automatically detects when user stops sharing via browser UI
- **Clean Resource Management**: Proper cleanup of media tracks on unmount
- **Responsive Design**: Mobile-safe layout (even when screen share is unsupported)
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **APIs**: Native Browser Web APIs (`getDisplayMedia`)

## 📋 Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Modern browser (Chrome 72+, Edge 79+)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/screen-share-test-app.git
cd screen-share-test-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage (/)
│   ├── screen-test/
│   │   └── page.tsx          # Screen test page (/screen-test)
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── Button.tsx            # Reusable button component
│   ├── StatusDisplay.tsx     # Status indicator component
│   ├── ScreenPreview.tsx     # Video preview with metadata
│   └── index.ts              # Component exports
├── hooks/
│   ├── useScreenShare.ts     # Screen sharing logic hook
│   └── index.ts              # Hook exports
└── types/
    ├── screen-share.ts       # TypeScript type definitions
    └── index.ts              # Type exports
```

## 🔄 Screen Sharing Flow

### 1. Homepage (`/`)
- Checks for `navigator.mediaDevices.getDisplayMedia` support
- Shows browser compatibility status
- Displays "Start Screen Test" button if supported
- Shows detailed unsupported browser message if not

### 2. Permission Request
- Calls `getDisplayMedia({ video: { frameRate: { ideal: 30 } }, audio: false })`
- Button is disabled during request
- Loading indicator shows while picker is open

### 3. Active Sharing
- Displays live video preview using `<video>` element
- Extracts and shows metadata from `track.getSettings()`:
  - Display surface type (monitor/window/browser tab)
  - Resolution (width × height)
  - Frame rate (FPS)
- Listens for `track.onended` event for lifecycle detection

### 4. Stream End Detection
- Detects user stopping via browser UI
- Detects unexpected stream termination
- Immediately updates UI state
- Releases all media tracks
- Clears video element

### 5. End/Retry Flow
- Shows "Screen sharing stopped" message
- Provides "Retry Screen Test" button (fresh `getDisplayMedia` call)
- Provides "Back to Home" button
- No track reuse or memory leaks

## 🎛️ State Machine

```
idle → requesting → active → stopped
          ↓           ↓
       cancelled    (via track.onended)
          ↓
        denied
          ↓
        error
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

