# Screen Share Test App

A Next.js application demonstrating browser screen-sharing capabilities using the native `getDisplayMedia` Web API. This app showcases proper permission handling, media stream lifecycle management, and clean React state management.

## 🚀 Live Demo

[Deploy your app and add the URL here]

## 📸 Screenshots

### Homepage
![Homepage](screenshots/homepage.png)
*Homepage with browser support detection and feature overview*

### Permission Request
![Permission Request](screenshots/requesting.png)
*Screen picker dialog requesting user permission*

### Active Screen Share
![Active Sharing](screenshots/active.png)
*Live screen preview with stream metadata display*

### Stopped State
![Stopped](screenshots/stopped.png)
*Screen sharing stopped with retry options*

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

## 🧪 Testing

### Manual Testing Checklist

- [ ] Homepage loads and shows browser support status
- [ ] "Start Screen Test" navigates to /screen-test
- [ ] Clicking share button shows browser's screen picker
- [ ] Cancelling picker shows "cancelled" state (not generic error)
- [ ] Selecting a screen shows live preview
- [ ] Metadata (type, resolution, FPS) displays correctly
- [ ] Stopping from browser UI updates state immediately
- [ ] "Retry" starts fresh (no stale streams)
- [ ] Navigation away cleans up resources
- [ ] No console errors during normal usage
- [ ] Works on Chrome and Edge

## ⚠️ Known Limitations & Browser Quirks

### Display Surface Detection
- The `displaySurface` property in `MediaTrackSettings` is not available in all browsers
- Some browsers return "unknown" for display type

### Frame Rate
- Actual frame rate may differ from requested `ideal: 30`
- Frame rate depends on system performance and browser throttling

### Permission Persistence
- Screen sharing permissions are not persistent across sessions
- Users must grant permission each time

### Mobile Browsers
- Screen sharing is not supported on mobile browsers
- App gracefully shows unsupported message

### Safari Support
- Safari has limited `getDisplayMedia` support
- Audio capture behaves differently

## 🔒 Privacy

- **No Recording**: This app only previews, never records
- **No Backend**: All processing is local, no data leaves your device
- **No Storage**: No data is persisted between sessions

## 📄 License

MIT License - feel free to use this code for learning and projects.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

Built with ❤️ using Next.js and native Web APIs
