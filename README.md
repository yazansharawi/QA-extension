# QA Extension - Bug Reporter

A powerful Chrome extension designed for QA engineers, designers, and developers to efficiently identify, flag, and track broken buttons and UI elements across web applications. Built with TypeScript and integrated with Supabase for seamless bug report management.

## 🚀 Features

### Core Functionality
- **🔍 Smart Highlighting**: Toggle highlight mode to visually identify all interactive elements (buttons, links) on any webpage
- **🚩 One-Click Flagging**: Flag broken or problematic buttons with a single click
- **📝 Detailed Reporting**: Add contextual notes and descriptions to your bug reports
- **📊 Report Management**: View, paginate, and manage recent bug reports directly from the extension popup
- **⚡ Real-time Sync**: All reports are instantly stored in Supabase for team collaboration

### User Experience
- **🎨 Modern UI**: Clean, responsive interface with smooth animations and transitions
- **⌨️ Keyboard Shortcuts**: Quick access with `Alt + B` to toggle highlight mode
- **🔔 Instant Feedback**: Visual notifications for successful report submissions
- **📱 Responsive Design**: Optimized for various screen sizes and resolutions

## 🛠️ Tech Stack

- **Frontend**: TypeScript, HTML5, CSS3
- **Build System**: Webpack 5 with TypeScript loader
- **Database**: Supabase (PostgreSQL)
- **APIs**: Chrome Extension APIs (Manifest V3)
- **Development**: ESLint, Prettier, Hot reload

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Chrome browser
- Supabase account

### Step 1: Clone & Install
```bash
git clone https://github.com/yourusername/QA-extension.git
cd QA-extension
npm install
```

### Step 2: Environment Configuration
Create a `.env` file in the root directory:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Database Setup
Create a `reports` table in your Supabase project:
```sql
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  button_text TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
```

### Step 4: Build the Extension
```bash
# Development build with watch mode
npm run watch

# Production build
npm run build
```

### Step 5: Load in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `dist` folder from your project directory
5. The extension icon should appear in your Chrome toolbar

## 🎯 Usage Guide

### Getting Started
1. **Activate Extension**: Click the QA Extension icon in your Chrome toolbar
2. **Enter Highlight Mode**: Click "Flag Buttons" or press `Alt + B`
3. **Identify Elements**: All buttons and links will be outlined in blue
4. **Flag Issues**: Hover over problematic elements and click the flag icon (🚩)
5. **Submit Reports**: Add notes and submit your bug report
6. **View Reports**: Access all reports from the extension popup

### Workflow Tips
- Use the floating "Flag Buttons" button for quick access on any page
- Add detailed notes to help developers understand the issue
- Use the popup to review recent reports and track progress
- Press `Alt + B` for instant highlight mode toggling

### Report Information Captured
- **URL**: Current webpage where the issue was found
- **Button Text**: Text content of the flagged element
- **Timestamp**: When the report was created
- **Notes**: Custom description of the issue
- **Context**: Page context and element details

## 🔧 Development

### Project Structure
```
QA-extension/
├── src/
│   ├── popup/          # Extension popup interface
│   │   ├── popup.html
│   │   ├── popup.ts
│   │   └── popup.css
│   ├── content/        # Content scripts for page injection
│   │   ├── content.ts
│   │   ├── content.css
│   │   └── styles.ts
│   ├── background/     # Background service worker
│   │   └── background.ts
│   └── lib/           # Shared utilities
│       ├── supabase.ts
│       ├── types.ts
│       └── utils.ts
├── public/            # Static assets
├── dist/             # Built extension files
├── manifest.json     # Extension manifest
└── webpack.config.js # Build configuration
```

### Available Scripts
```bash
npm run build      # Production build
npm run watch      # Development build with file watching
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Database Schema

The extension uses a simple but effective schema:

```typescript
interface Report {
  id?: number;
  url: string;
  buttonText: string;
  note?: string;
  created_at?: string;
}
```

## 🔒 Privacy & Security

- **Data Storage**: All reports are stored securely in your Supabase instance
- **Permissions**: Extension only requests necessary permissions (`activeTab`, `storage`)
- **No Tracking**: No analytics or user tracking implemented
- **Local First**: Extension works offline, syncs when connection is available

## 🐛 Troubleshooting

### Common Issues

**Extension not loading:**
- Ensure you've built the project (`npm run build`)
- Check that the `dist` folder exists and contains the built files
- Verify Chrome Developer mode is enabled

**Reports not saving:**
- Check your Supabase credentials in the `.env` file
- Ensure the `reports` table exists in your database
- Check the browser console for any error messages

**Highlight mode not working:**
- Refresh the page after installing/updating the extension
- Check if the page has Content Security Policy restrictions
- Ensure the extension has permission to access the current site

### Getting Help
- Check the browser console for error messages
- Review the extension's popup for any error states
- Ensure all dependencies are properly installed

## 🚀 Future Enhancements

- **Screenshot Capture**: Automatically capture screenshots of flagged elements
- **Team Collaboration**: Share reports with team members
- **Integration APIs**: Connect with Jira, GitHub Issues, or other bug tracking tools
- **Advanced Filtering**: Filter reports by date, URL, or issue type
- **Analytics Dashboard**: Visual reporting and analytics
- **Bulk Operations**: Select and manage multiple reports

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Supabase](https://supabase.com) for backend services
- Icons and design inspiration from modern web standards
- Chrome Extension documentation and best practices

---

**Made with ❤️ for the QA community**
