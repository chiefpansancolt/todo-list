# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-10-29

### Chores

- Update Dependencies
- Update GitHub Actions resource versions

## [1.1.0] - 2025-6-21

### Features

- Redo how import versions are evaluated to support 1.x.x for import ov 1.0.0 and above

### Fixes

- [#7](https://github.com/chiefpansancolt/todo-list/issues/7): Clean up Extra Details Popover

### Chores

- Fix dmg builds for GitHub Actions

## [1.0.1] - 2025-6-21

### Fixes

- Clean up Win Build
- Restructure Version refs in files

### Chores

- Bump Version Dependencies

## [1.0.0] - 2025-6-14

### 🎉 Initial Release

Welcome to Todo List v1.0.0! A modern, elegant desktop todo application built with Electron, React, and TypeScript.

### ✨ Added

#### Core Task Management

- **Task Creation** - Create tasks with title and detailed descriptions
- **Task Editing** - Edit existing tasks with inline and modal editing
- **Task Completion** - Mark tasks as complete/incomplete with smooth animations
- **Task Deletion** - Delete individual tasks or bulk delete with delete mode
- **Task Reordering** - Drag and drop to reorder active tasks

#### Organization Features

- **Custom Categories** - Create, edit, and delete color-coded categories
- **Priority Levels** - Set High, Medium, or Low priority with visual indicators
- **Due Dates** - Calendar picker with date selection and overdue notifications
- **Extra Details** - Rich text details with expandable popover display
- **Smart Sorting** - Auto-sort by priority, due date, and overdue status

#### User Interface

- **Modern Design** - Clean, responsive interface built with Tailwind CSS
- **Dark Mode** - System-aware theme switching with manual toggle
- **Animations** - Smooth transitions, fade effects, and micro-interactions
- **Collapsible Sections** - Toggle completed tasks visibility
- **Visual Feedback** - Loading states, hover effects, and status indicators

#### Data Management

- **Persistent Storage** - Local file-based storage in user data directory
- **Export Options**:
  - JSON format for complete backup with all task details
  - CSV format for spreadsheet analysis
- **Import Support** - Restore tasks and categories from JSON exports
- **Data Validation** - Robust error handling and data integrity checks

#### Desktop Integration

- **Native Menus** - Platform-specific menu bars with full functionality
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + N` - New Task
  - `Ctrl/Cmd + T` - Manage Categories
  - `Ctrl/Cmd + D` - Toggle Dark Mode
  - `Ctrl/Cmd + Shift + D` - Toggle Delete Mode
  - `Ctrl/Cmd + I` - Import Data
  - `Ctrl/Cmd + Shift + E` - Export as JSON
  - `Escape` - Cancel/Close Modal
- **Window Management** - Minimize, maximize, fullscreen, zoom controls
- **Cross-Platform** - Windows, macOS, and Linux support

#### Internationalization

- **Multi-Language Support** - 10 languages included:
  - English
  - Spanish (Español)
  - French (Français)
  - German (Deutsch)
  - Portuguese (Português)
  - Japanese (日本語)
  - Chinese Simplified (中文)
  - Korean (한국어)
  - Italian (Italiano)
  - Dutch (Nederlands)
- **Dynamic Language Switching** - Change language without restart
- **Localized Calendars** - Region-appropriate date formats and calendars

#### Developer Features

- **TypeScript** - Full type safety throughout the application
- **Modern React** - React 19 with hooks and concurrent features
- **IPC Security** - Secure communication via contextBridge
- **Modular Architecture** - Clean separation of concerns
- **Build System** - Fast Vite-powered development and building

### 🏗️ Technical Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Desktop**: Electron 36, electron-vite
- **UI Components**: Custom shadcn/ui components with Radix UI primitives
- **Icons**: React Icons (Font Awesome)
- **Build**: electron-builder for cross-platform packaging

### 📦 Distribution

- **Windows**: NSIS installer (.exe)
- **macOS**: DMG disk image (.dmg)
- **Linux**: AppImage and Deb packages

### 📊 Default Data

- **Pre-configured Categories**:
  - Personal (Blue)
  - Work (Green)
  - Urgent (Red)
- **Sample Data Structure** - Clean initialization with default categories

---

## Project Links

- **Repository**: [GitHub](https://github.com/chiefpansancolt/todo-list-app)
- **Discord**: [Community](https://discord.gg/chiefpansancolt)
- **Issues**: [Bug Reports & Feature Requests](https://github.com/chiefpansancolt/todo-list-app/issues)

## Credits

Created by [chiefpansancolt](https://chiefpansancolt.dev) with ❤️

Built with modern web technologies and best practices for a native desktop experience.
