const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

const userDataPath = app.getPath('userData');
const windowStateFile = path.join(userDataPath, 'window-state.json');

function loadWindowState() {
	try {
		return JSON.parse(fs.readFileSync(windowStateFile, 'utf8'));
	} catch (e) {
		return {
			width: 800,
			height: 600,
			x: undefined,
			y: undefined,
		};
	}
}

function saveWindowState() {
	if (!mainWindow) return;

	const bounds = mainWindow.getBounds();
	const state = {
		width: bounds.width,
		height: bounds.height,
		x: bounds.x,
		y: bounds.y,
		isMaximized: mainWindow.isMaximized(),
	};

	fs.writeFileSync(windowStateFile, JSON.stringify(state));
}

function createWindow() {
	const windowState = loadWindowState();

	mainWindow = new BrowserWindow({
		width: windowState.width,
		height: windowState.height,
		x: windowState.x,
		y: windowState.y,
		minWidth: 400,
		minHeight: 300,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
			nodeIntegration: false,
		},
		icon: path.join(__dirname, 'icon.png'),
		show: false,
	});

	if (windowState.isMaximized) {
		mainWindow.maximize();
	}

	mainWindow.loadFile('index.html');

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});

	mainWindow.on('close', () => {
		saveWindowState();
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	const template = [
		{
			label: 'File',
			submenu: [
				{
					label: 'New Task',
					accelerator: 'CmdOrCtrl+N',
					click: () => {
						mainWindow.webContents.send('focus-new-task');
					},
				},
				{ type: 'separator' },
				{
					label: 'Export',
					submenu: [
						{
							label: 'as JSON',
							accelerator: 'CmdOrCtrl+Shift+J',
							click: () => {
								mainWindow.webContents.send('export-json');
							},
						},
						{
							label: 'as CSV',
							accelerator: 'CmdOrCtrl+Shift+C',
							click: () => {
								mainWindow.webContents.send('export-csv');
							},
						},
					],
				},
				{ type: 'separator' },
				{
					label: 'Quit',
					accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
					click: () => {
						app.quit();
					},
				},
			],
		},
		{
			label: 'Edit',
			submenu: [
				{ label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
				{ label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
				{ type: 'separator' },
				{ label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
				{ label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
				{ label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
			],
		},
		{
			label: 'View',
			submenu: [
				{ label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
				{ label: 'Force Reload', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
				{ label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
				{ type: 'separator' },
				{ label: 'Actual Size', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
				{ label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
				{ label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
				{ type: 'separator' },
				{ label: 'Toggle Fullscreen', accelerator: 'F11', role: 'togglefullscreen' },
			],
		},
		{
			label: 'Help',
			submenu: [
				{
					label: 'About',
					click: () => {
						require('electron').dialog.showMessageBox(mainWindow, {
							type: 'info',
							title: 'About Todo App',
							message: 'Todo Desktop App',
							detail: 'A simple and elegant todo list application built with Electron and Tailwind CSS.',
							buttons: ['OK'],
						});
					},
				},
			],
		},
	];

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

const tasksFile = path.join(userDataPath, 'tasks.json');
const categoriesFile = path.join(userDataPath, 'categories.json');

ipcMain.handle('load-tasks', async () => {
	try {
		const data = fs.readFileSync(tasksFile, 'utf8');
		return JSON.parse(data);
	} catch (e) {
		return [];
	}
});

ipcMain.handle('save-tasks', async (event, tasks) => {
	try {
		fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
		return { success: true };
	} catch (e) {
		console.error('Error saving tasks:', e);
		return { success: false, error: e.message };
	}
});

ipcMain.handle('load-categories', async () => {
	try {
		const data = fs.readFileSync(categoriesFile, 'utf8');
		return JSON.parse(data);
	} catch (e) {
		return [];
	}
});

ipcMain.handle('save-categories', async (event, categories) => {
	try {
		fs.writeFileSync(categoriesFile, JSON.stringify(categories, null, 2));
		return { success: true };
	} catch (e) {
		console.error('Error saving categories:', e);
		return { success: false, error: e.message };
	}
});
