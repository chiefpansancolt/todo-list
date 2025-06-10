### Data Management

- **Export Data**: Use File menu → Export Data (Ctrl/Cmd+E)
  - **JSON Format**: Complete backup with all details
  - **CSV Format**: Spreadsheet-compatible for analysis
- **Auto-save**: All changes saved automatically
- **Local Storage**: Data stored securely on your computer# Todo Desktop App

A modern, elegant todo list desktop application built with Electron and styled with Tailwind CSS.

## Features

- ✅ **Task Management**: Add, edit, delete, and complete tasks
- 📊 **Priorities**: Set task priority levels (High, Medium, Low) with visual indicators
- 📅 **Due Dates**: Optional due dates with past due indicators
- 🏷️ **Categories**: Organize tasks with custom color-coded categories
- 🎯 **Drag & Drop**: Reorder active tasks with smooth animations
- 💾 **Persistent Storage**: Tasks, categories, and priorities are saved locally
- ⌨️ **Keyboard Shortcuts**: Full keyboard support for efficient task management
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🌓 **Dark Mode**: Toggle between light and dark themes
- ✨ **Animations**: Smooth transitions and fade effects
- 📁 **Collapsible Sections**: Hide completed tasks to reduce clutter
- 🖥️ **Window State**: Remembers window size and position

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Create a new directory for your project:**
   ```bash
   mkdir todo-desktop-app
   cd todo-desktop-app
   ```

2. **Create the project files:**
   - Copy all the provided files into your project directory
   - Create an `icon.png` file (256x256 pixels recommended) for the app icon

3. **Install dependencies:**
   ```bash
   npm install
   ```

### Using Local Tailwind CSS (Optional)

If you prefer to use Tailwind CSS locally instead of the CDN:

1. **Install Tailwind CSS:**
   ```bash
   npm install -D tailwindcss
   npx tailwindcss init
   ```

2. **Replace the `tailwind.config.js` with the provided configuration**

3. **Create a `styles/input.css` file:**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Add a build script to `package.json`:**
   ```json
   "scripts": {
     "build-css": "tailwindcss -i ./styles/input.css -o ./styles/output.css --watch"
   }
   ```

5. **Update `index.html` to use the local CSS file:**
   Replace the CDN script with:
   ```html
   <link href="./styles/output.css" rel="stylesheet">
   ```

### Development

1. **Run the application in development mode:**
   ```bash
   npm start
   ```

2. **For hot-reload CSS (if using local Tailwind):**
   ```bash
   # In a separate terminal
   npm run build-css
   ```

### Building for Distribution

1. **Build for your current platform:**
   ```bash
   npm run build
   ```

2. **Build for specific platforms:**
   ```bash
   # Windows
   npm run build-win

   # macOS
   npm run build-mac

   # Linux
   npm run build-linux
   ```

The built applications will be in the `dist` folder.

## Creating App Icons

For distribution, you'll need platform-specific icons:

- **Windows**: `icon.ico` (256x256)
- **macOS**: `icon.icns` (512x512)
- **Linux**: `icon.png` (512x512)

You can use tools like:
- [electron-icon-builder](https://github.com/safu9/electron-icon-builder)
- [Icon Generator](https://www.electron.build/icons)

## Usage

### Keyboard Shortcuts

- **Ctrl/Cmd + N**: Focus on new task input
- **Enter**: Add new task (when input is focused)
- **Escape**: Cancel editing
- **Delete**: Delete selected task
- **Tab**: Navigate through interface elements

### Task Management

- **Add Task**: Click "New Task" button or press Ctrl/Cmd + N
- **Edit Task**: Hover and click edit button (pencil icon)
- **Task Modal**: 
  - Enter task description (required)
  - Set priority level (High/Medium/Low)
  - Select category
  - Choose due date
- **Save/Cancel**: Click Save or press Enter to save, Cancel or Escape to close
- **Complete Task**: Click the checkbox - completed tasks fade out after 3 seconds
- **Collapse Completed**: Click completed tasks header to show/hide completed items
- **Delete Tasks**: 
  - Click "Delete" button in header to enter delete mode
  - Select one or more tasks by clicking them
  - Click "Delete Selected" to confirm deletion
- **Reorder Tasks**: Drag and drop active tasks to reorder them
- **Visual Indicators**: 
  - Past due tasks show red pulsing text
  - High priority: red up arrow (↑)
  - Medium priority: yellow up arrow (↑)
  - Low priority: blue down arrow (↓)

### Category Management

- **Open Categories**: Click the "Categories" button in the header
- **Add Category**: Enter name and pick a color, then click Add
- **Edit Category**: Click the pencil icon to edit name and color
- **Delete Category**: Click trash icon next to custom categories
- **Default Categories**: Personal (blue), Work (green), and Urgent (red) can be edited but not deleted
- **Visual Organization**: Tasks show with category colors and badges

### Data Management

- **Export Data**: Click "Export" button to download your data
  - **JSON Format**: Complete backup with all details
  - **CSV Format**: Spreadsheet-compatible for analysis
- **Auto-save**: All changes saved automatically
- **Local Storage**: Data stored securely on your computer

## Customization

### Styling with Tailwind

The app uses Tailwind utility classes throughout. Key customization points:

- **Colors**: Modify the primary color scheme in `tailwind.config.js`
- **Animations**: Add custom animations in the config
- **Dark Mode**: Customize dark mode colors and styles
- **Spacing**: Adjust padding/margins using Tailwind's spacing scale

### Adding Features

The codebase is structured for easy extension:

- **Import Data**: Add import functionality to restore JSON backups
- **Task Properties**: Add notes, attachments, or time tracking
- **Filters**: Implement task filtering by status, priority, date, or category
- **Views**: Add calendar view, kanban board, or list grouping
- **Notifications**: Add system notifications for due tasks
- **Recurring Tasks**: Implement repeating tasks functionality
- **Collaboration**: Add task sharing or assignment features
- **Search**: Add full-text search across tasks

## Troubleshooting

### Common Issues

1. **App won't start**: 
   - Ensure all dependencies are installed
   - Check Node.js version compatibility

2. **Tasks not saving**:
   - Check file permissions in the user data directory
   - Look for errors in the developer console (View → Toggle Developer Tools)

3. **Styling issues**:
   - If using local Tailwind, ensure the CSS is being built
   - Check that all Tailwind classes are included in the config

## Project Structure

```
todo-app/
├── main.js           # Electron main process
├── preload.js        # Secure bridge between main and renderer
├── index.html        # Main UI with Tailwind classes
├── renderer.js       # Client-side logic
├── package.json      # Dependencies and scripts
├── tailwind.config.js # Tailwind configuration
├── icon.png          # App icon
└── dist/            # Built applications (after building)
```

## License

MIT License - feel free to use this project for personal or commercial purposes.