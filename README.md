# DesignQA Bug Reporter

A Chrome extension that helps QA engineers and designers flag broken buttons on webpages and store reports in Supabase.

## Features

- 🔍 Highlight mode to identify broken buttons
- 🚩 Flag broken buttons with a single click
- 📝 Add notes to your bug reports
- 📊 View recent bug reports in the popup
- 📱 Responsive and user-friendly interface
- ⌨️ Keyboard shortcut support (Alt + B)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/designqa-assignment.git
cd designqa-assignment
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

4. Build the extension:
```bash
npm run build
```

5. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from the project directory

## Usage

1. Click the extension icon in your Chrome toolbar to open the popup
2. Click "Start Highlighting" or press `Alt + B` to enter highlight mode
3. Hover over any button on the webpage to see the flag icon
4. Click the flag icon to report a broken button
5. Add a note to your report (optional)
6. Submit the report
7. View your recent reports in the popup

```
## Technologies Used

- TypeScript
- Chrome Extension APIs
- Supabase
- Webpack
- HTML/CSS
