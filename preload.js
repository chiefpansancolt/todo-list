const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	loadTasks: () => ipcRenderer.invoke('load-tasks'),
	saveTasks: (tasks) => ipcRenderer.invoke('save-tasks', tasks),
	loadCategories: () => ipcRenderer.invoke('load-categories'),
	saveCategories: (categories) => ipcRenderer.invoke('save-categories', categories),
	onFocusNewTask: (callback) => {
		ipcRenderer.on('focus-new-task', callback);
	},
	onExportData: (callback) => {
		ipcRenderer.on('export-data', callback);
	},
	onExportJSON: (callback) => {
		ipcRenderer.on('export-json', callback);
	},
	onExportCSV: (callback) => {
		ipcRenderer.on('export-csv', callback);
	},
	removeAllListeners: (channel) => {
		ipcRenderer.removeAllListeners(channel);
	},
});
