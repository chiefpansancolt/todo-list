
class TodoApp {
	constructor() {
		this.tasks = [];
		this.categories = [];
		this.draggedElement = null;
		this.editingTaskId = null;
		this.editingCategoryId = null;
		this.deleteMode = false;
		this.selectedForDelete = new Set();
		this.completedCollapsed = false;

		this.defaultCategories = [
			{ id: 'personal', name: 'Personal', color: '#3B82F6' },
			{ id: 'work', name: 'Work', color: '#10B981' },
			{ id: 'urgent', name: 'Urgent', color: '#EF4444' },
		];

		this.init();
	}

	async init() {
		await this.loadTasks();
		await this.loadCategories();

		this.setupEventListeners();

		this.setupIPCListeners();

		this.render();

		this.initTheme();

		this.loadUIPreferences();
	}

	setupEventListeners() {
		const addListener = (id, event, handler) => {
			const element = document.getElementById(id);
			if (element) {
				element.addEventListener(event, handler);
			}
		};

		addListener('new-task-btn', 'click', () => this.openTaskModal());

		addListener('close-task-modal-btn', 'click', () => this.closeTaskModal());
		addListener('cancel-task-btn', 'click', () => this.closeTaskModal());

		const taskForm = document.getElementById('task-form');
		if (taskForm) {
			taskForm.addEventListener('submit', (e) => {
				e.preventDefault();
				this.saveTask();
			});
		}

		addListener('task-modal', 'click', (e) => {
			if (e.target.id === 'task-modal') {
				this.closeTaskModal();
			}
		});

		addListener('close-export-modal-btn', 'click', () => this.closeExportModal());
		addListener('export-modal', 'click', (e) => {
			if (e.target.id === 'export-modal') {
				this.closeExportModal();
			}
		});

		addListener('categories-btn', 'click', () => this.openCategoryModal());
		addListener('close-modal-btn', 'click', () => this.closeCategoryModal());
		addListener('add-category-btn', 'click', () => this.addCategory());

		addListener('new-category-name', 'keypress', (e) => {
			if (e.key === 'Enter') {
				this.addCategory();
			}
		});

		addListener('category-modal', 'click', (e) => {
			if (e.target.id === 'category-modal') {
				this.closeCategoryModal();
			}
		});

		addListener('delete-mode-btn', 'click', () => this.toggleDeleteMode());
		addListener('confirm-delete-btn', 'click', () => this.deleteSelectedTasks());
		addListener('cancel-delete-btn', 'click', () => this.exitDeleteMode());

		addListener('theme-toggle', 'click', () => this.toggleTheme());

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				if (this.deleteMode) {
					this.exitDeleteMode();
				} else if (document.getElementById('task-modal')?.classList.contains('flex')) {
					this.closeTaskModal();
				} else if (document.getElementById('export-modal')?.classList.contains('flex')) {
					this.closeExportModal();
				} else if (document.getElementById('category-modal')?.classList.contains('flex')) {
					if (this.editingCategoryId) {
						this.cancelEditCategory();
					} else {
						this.closeCategoryModal();
					}
				}
			}
		});
	}

	setupIPCListeners() {
		window.electronAPI.onFocusNewTask(() => {
			this.openTaskModal();
		});

		window.electronAPI.onExportData(() => {
			this.openExportModal();
		});

		window.electronAPI.onExportJSON(() => {
			this.exportJSON();
		});

		window.electronAPI.onExportCSV(() => {
			this.exportCSV();
		});
	}

	async loadTasks() {
		try {
			this.tasks = await window.electronAPI.loadTasks();
		} catch (error) {
			console.error('Error loading tasks:', error);
			this.tasks = [];
		}
	}

	async loadCategories() {
		try {
			const saved = await window.electronAPI.loadCategories();
			if (saved && saved.length > 0) {
				this.categories = saved;
			} else {
				this.categories = [...this.defaultCategories];
				this.saveCategories();
			}
		} catch (error) {
			this.categories = [...this.defaultCategories];
			this.saveCategories();
		}
	}

	async saveTasks() {
		try {
			await window.electronAPI.saveTasks(this.tasks);
		} catch (error) {
			console.error('Error saving tasks:', error);
		}
	}

	async saveCategories() {
		try {
			await window.electronAPI.saveCategories(this.categories);
		} catch (error) {
			console.error('Error saving categories:', error);
		}
	}

	openTaskModal(taskId = null) {
		const modal = document.getElementById('task-modal');
		const title = document.getElementById('task-modal-title');
		const submitBtn = document.getElementById('save-task-btn');

		document.getElementById('task-text').value = '';
		document.getElementById('task-priority').value = '';
		document.getElementById('task-category').value = '';
		document.getElementById('task-date').value = '';

		if (taskId) {
			this.editingTaskId = taskId;
			const task = this.tasks.find((t) => t.id === taskId);
			if (task) {
				title.textContent = 'Edit Task';
				submitBtn.textContent = 'Update Task';

				document.getElementById('task-text').value = task.text;
				document.getElementById('task-priority').value = task.priority || '';
				document.getElementById('task-category').value = task.categoryId || '';
				document.getElementById('task-date').value = task.dueDate || '';
			}
		} else {
			this.editingTaskId = null;
			title.textContent = 'New Task';
			submitBtn.textContent = 'Add Task';
		}

		this.renderCategorySelectModal();

		modal.classList.remove('hidden');
		modal.classList.add('flex');

		setTimeout(() => {
			document.getElementById('task-text').focus();
		}, 100);
	}

	closeTaskModal() {
		const modal = document.getElementById('task-modal');
		modal.classList.add('hidden');
		modal.classList.remove('flex');
		this.editingTaskId = null;
	}

	saveTask() {
		const text = document.getElementById('task-text').value.trim();
		const priority = document.getElementById('task-priority').value;
		const categoryId = document.getElementById('task-category').value;
		const dueDate = document.getElementById('task-date').value;

		if (!text) return;

		if (this.editingTaskId) {
			const task = this.tasks.find((t) => t.id === this.editingTaskId);
			if (task) {
				task.text = text;
				task.priority = priority || null;
				task.categoryId = categoryId || null;
				task.dueDate = dueDate || null;
				task.updatedAt = new Date().toISOString();
			}
		} else {
			const newTask = {
				id: Date.now().toString(),
				text: text,
				completed: false,
				createdAt: new Date().toISOString(),
				dueDate: dueDate || null,
				categoryId: categoryId || null,
				priority: priority || null,
			};

			this.tasks.push(newTask);
		}

		this.saveTasks();
		this.render();
		this.closeTaskModal();
	}

	renderCategorySelectModal() {
		const select = document.getElementById('task-category');
		select.innerHTML =
			'<option value="">No category</option>' +
			this.categories
				.map((category) => `<option value="${category.id}">${this.escapeHtml(category.name)}</option>`)
				.join('');
	}

	toggleTask(id) {
		const task = this.tasks.find((t) => t.id === id);
		if (task) {
			task.completed = !task.completed;
			task.completedAt = task.completed ? new Date().toISOString() : null;

			if (task.completed) {
				setTimeout(() => {
					const taskElement = document.querySelector(`[data-task-id="${id}"]`);
					if (taskElement && task.completed) {
						taskElement.classList.add('animate-fade-out');
						setTimeout(() => {
							this.render();
						}, 500);
					}
				}, 3000);
			}

			this.saveTasks();
			this.render();
		}
	}

	deleteTask(id) {
		this.tasks = this.tasks.filter((t) => t.id !== id);
		this.saveTasks();
		this.render();
	}

	toggleDeleteMode() {
		this.deleteMode = !this.deleteMode;
		document.body.classList.toggle('delete-mode', this.deleteMode);

		if (this.deleteMode) {
			document.getElementById('delete-mode-actions').classList.remove('hidden');
			this.selectedForDelete.clear();
			this.updateDeleteCount();
		} else {
			this.exitDeleteMode();
		}

		this.render();
	}

	exitDeleteMode() {
		this.deleteMode = false;
		this.selectedForDelete.clear();
		document.body.classList.remove('delete-mode');
		document.getElementById('delete-mode-actions').classList.add('hidden');
		this.render();
	}

	toggleTaskSelection(id) {
		if (this.selectedForDelete.has(id)) {
			this.selectedForDelete.delete(id);
		} else {
			this.selectedForDelete.add(id);
		}
		this.updateDeleteCount();
		this.render();
	}

	updateDeleteCount() {
		const count = this.selectedForDelete.size;
		document.getElementById('delete-count').textContent = count;
		document.getElementById('confirm-delete-btn').disabled = count === 0;
	}

	deleteSelectedTasks() {
		if (this.selectedForDelete.size === 0) return;

		this.tasks = this.tasks.filter((t) => !this.selectedForDelete.has(t.id));
		this.saveTasks();
		this.exitDeleteMode();
	}

	editTask(id) {
		this.openTaskModal(id);
	}

	openCategoryModal() {
		const modal = document.getElementById('category-modal');
		modal.classList.remove('hidden');
		modal.classList.add('flex');
		this.renderCategories();
		document.getElementById('new-category-name').focus();
	}

	closeCategoryModal() {
		const modal = document.getElementById('category-modal');
		modal.classList.add('hidden');
		modal.classList.remove('flex');

		document.getElementById('new-category-name').value = '';
		document.getElementById('new-category-color').value = '#3B82F6';
	}

	addCategory() {
		const nameInput = document.getElementById('new-category-name');
		const colorInput = document.getElementById('new-category-color');
		const name = nameInput.value.trim();

		if (name) {
			const newCategory = {
				id: Date.now().toString(),
				name: name,
				color: colorInput.value,
			};

			this.categories.push(newCategory);
			this.saveCategories();

			nameInput.value = '';
			colorInput.value = '#3B82F6';

			this.renderCategories();
			this.render();

			nameInput.focus();
		}
	}

	editCategory(id) {
		this.editingCategoryId = id;
		this.renderCategories();

		setTimeout(() => {
			const nameInput = document.querySelector(`[data-edit-category-name="${id}"]`);
			if (nameInput) {
				nameInput.focus();
				nameInput.select();
			}
		}, 0);
	}

	saveEditCategory(id, newName, newColor) {
		const category = this.categories.find((c) => c.id === id);
		if (category && newName.trim()) {
			category.name = newName.trim();
			category.color = newColor;
			this.saveCategories();
			this.render();
		}

		this.editingCategoryId = null;
		this.renderCategories();
	}

	cancelEditCategory() {
		this.editingCategoryId = null;
		this.renderCategories();
	}

	deleteCategory(id) {
		if (['personal', 'work', 'urgent'].includes(id)) return;

		this.categories = this.categories.filter((c) => c.id !== id);

		this.tasks.forEach((task) => {
			if (task.categoryId === id) {
				task.categoryId = null;
			}
		});

		this.saveCategories();
		this.saveTasks();

		this.renderCategories();
		this.render();
	}

	getCategoryById(id) {
		return this.categories.find((c) => c.id === id);
	}

	renderCategories() {
		const container = document.getElementById('categories-list');

		if (this.categories.length === 0) {
			container.innerHTML = '<p class="text-gray-500 text-center py-4">No categories yet</p>';
			return;
		}

		container.innerHTML = this.categories
			.map((category) => {
				const isDefault = ['personal', 'work', 'urgent'].includes(category.id);
				const isEditing = this.editingCategoryId === category.id;

				if (isEditing) {
					return `
									<div class="category-item flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<div class="flex items-center gap-2 flex-1">
													<input 
															type="color" 
															value="${category.color}"
															data-edit-category-color="${category.id}"
															class="w-8 h-8 border border-gray-300 rounded cursor-pointer"
													>
													<input 
															type="text" 
															value="${this.escapeHtml(category.name)}"
															data-edit-category-name="${category.id}"
															class="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
															maxlength="20"
															onkeypress="if(event.key === 'Enter') todoApp.saveEditCategory('${category.id}', this.value, document.querySelector('[data-edit-category-color=\\'${category.id}\\']').value)"
													>
											</div>
											<div class="flex gap-1 ml-2">
													<button 
															onclick="todoApp.saveEditCategory('${category.id}', document.querySelector('[data-edit-category-name=\\'${category.id}\\']').value, document.querySelector('[data-edit-category-color=\\'${category.id}\\']').value)"
															class="text-green-600 hover:text-green-700 transition-colors p-1"
															title="Save"
													>
															<i class="fas fa-check"></i>
													</button>
													<button 
															onclick="todoApp.cancelEditCategory()"
															class="text-gray-500 hover:text-gray-700 transition-colors p-1"
															title="Cancel"
													>
															<i class="fas fa-times"></i>
													</button>
											</div>
									</div>
							`;
				}

				return `
							<div class="category-item flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<div class="flex items-center gap-3">
											<div 
													class="w-6 h-6 rounded-full border-2 border-gray-300" 
													style="background-color: ${category.color}"
											></div>
											<span class="font-medium text-gray-700">${this.escapeHtml(category.name)}</span>
									</div>
									<div class="flex items-center gap-2">
											${isDefault ? '<span class="text-xs text-gray-400 category-default">Default</span>' : ''}
											<button 
													onclick="todoApp.editCategory('${category.id}')"
													class="text-blue-500 hover:text-blue-700 transition-colors p-1"
													title="Edit category"
											>
													<i class="fas fa-edit text-sm"></i>
											</button>
											${
												!isDefault
													? `
													<button 
															onclick="todoApp.deleteCategory('${category.id}')"
															class="text-red-500 hover:text-red-700 transition-colors p-1"
															title="Delete category"
													>
															<i class="fas fa-trash text-sm"></i>
													</button>
											`
													: ''
											}
									</div>
							</div>
					`;
			})
			.join('');
	}

	parseLocalDate(dateString) {
		if (!dateString) return null;
		const [year, month, day] = dateString.split('-').map((num) => parseInt(num));
		return new Date(year, month - 1, day);
	}

	isPastDue(task) {
		if (!task.dueDate || task.completed) return false;

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const dueDate = this.parseLocalDate(task.dueDate);

		return dueDate < today;
	}

	formatDueDate(dateString) {
		if (!dateString) return '';

		const date = this.parseLocalDate(dateString);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (
			date.getFullYear() === today.getFullYear() &&
			date.getMonth() === today.getMonth() &&
			date.getDate() === today.getDate()
		) {
			return 'Today';
		}

		if (
			date.getFullYear() === tomorrow.getFullYear() &&
			date.getMonth() === tomorrow.getMonth() &&
			date.getDate() === tomorrow.getDate()
		) {
			return 'Tomorrow';
		}

		const options = { month: 'short', day: 'numeric' };
		if (date.getFullYear() !== today.getFullYear()) {
			options.year = 'numeric';
		}

		return date.toLocaleDateString('en-US', options);
	}

	getPriorityDisplay(priority) {
		if (!priority) return '';

		switch (priority) {
			case 'high':
				return '<i class="fas fa-arrow-up priority-high" title="High priority"></i>';
			case 'medium':
				return '<i class="fas fa-arrow-up priority-medium" title="Medium priority"></i>';
			case 'low':
				return '<i class="fas fa-arrow-down priority-low" title="Low priority"></i>';
			default:
				return '';
		}
	}

	getLightColor(color, opacity = 0.1) {
		const r = parseInt(color.slice(1, 3), 16);
		const g = parseInt(color.slice(3, 5), 16);
		const b = parseInt(color.slice(5, 7), 16);

		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}

	getContrastColor(color) {
		const r = parseInt(color.slice(1, 3), 16);
		const g = parseInt(color.slice(3, 5), 16);
		const b = parseInt(color.slice(5, 7), 16);

		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

		return luminance > 0.5 ? '#1F2937' : '#F3F4F6';
	}

	handleDragStart(e, id) {
		this.draggedElement = id;
		e.target.classList.add('opacity-50');
	}

	handleDragEnd(e) {
		e.target.classList.remove('opacity-50');
	}

	handleDragOver(e) {
		e.preventDefault();
		const draggingOver = e.target.closest('.task-item');
		if (draggingOver && !draggingOver.classList.contains('opacity-50')) {
			draggingOver.classList.add('border-t-2', 'border-blue-500');
		}
	}

	handleDragLeave(e) {
		const draggingOver = e.target.closest('.task-item');
		if (draggingOver) {
			draggingOver.classList.remove('border-t-2', 'border-blue-500');
		}
	}

	handleDrop(e, dropId) {
		e.preventDefault();
		const dropTarget = e.target.closest('.task-item');
		if (dropTarget) {
			dropTarget.classList.remove('border-t-2', 'border-blue-500');
		}

		if (this.draggedElement && this.draggedElement !== dropId) {
			const draggedIndex = this.tasks.findIndex((t) => t.id === this.draggedElement);
			const dropIndex = this.tasks.findIndex((t) => t.id === dropId);

			if (draggedIndex !== -1 && dropIndex !== -1) {
				const draggedTask = this.tasks[draggedIndex];
				const dropTask = this.tasks[dropIndex];

				if (!draggedTask.completed && !dropTask.completed) {
					this.tasks.splice(draggedIndex, 1);

					const newDropIndex = this.tasks.findIndex((t) => t.id === dropId);

					this.tasks.splice(newDropIndex, 0, draggedTask);

					this.saveTasks();
					this.render();
				}
			}
		}

		this.draggedElement = null;
	}

	createTaskElement(task) {
		const isPastDue = this.isPastDue(task);
		const category = task.categoryId ? this.getCategoryById(task.categoryId) : null;
		const isSelectedForDelete = this.selectedForDelete.has(task.id);

		const taskClasses = task.completed
			? 'opacity-75 bg-gray-50'
			: `bg-white hover:shadow-md ${!this.deleteMode ? 'cursor-move' : ''} task-with-category ${isSelectedForDelete ? 'selected-for-delete' : ''}`;

		const textClasses = task.completed ? 'line-through text-gray-500' : 'text-gray-800';

		const draggableAttrs =
			!task.completed && !this.deleteMode
				? 'draggable="true" ondragstart="todoApp.handleDragStart(event, \'' +
					task.id +
					'\')" ondragend="todoApp.handleDragEnd(event)" ondragover="todoApp.handleDragOver(event)" ondragleave="todoApp.handleDragLeave(event)" ondrop="todoApp.handleDrop(event, \'' +
					task.id +
					'\')"'
				: '';

		const deleteClickHandler =
			this.deleteMode && !task.completed ? `onclick="todoApp.toggleTaskSelection('${task.id}')"` : '';

		const dueDateDisplay = task.dueDate
			? `
					<span class="text-sm ${isPastDue ? 'text-red-500 font-semibold past-due-indicator' : 'text-gray-500'}">
							<i class="fas fa-calendar-alt mr-1"></i>${this.formatDueDate(task.dueDate)}
					</span>
			`
			: '';

		const categoryDisplay = category
			? `
					<span 
							class="category-badge"
							style="background-color: ${this.getLightColor(category.color, 0.2)}; color: ${category.color};"
					>
							${this.escapeHtml(category.name)}
					</span>
			`
			: '';

		const priorityDisplay = task.priority
			? `
					<span class="text-sm">${this.getPriorityDisplay(task.priority)}</span>
			`
			: '';

		const backgroundColor =
			category && !task.completed ? `background-color: ${this.getLightColor(category.color, 0.05)};` : '';

		return `
					<div 
							class="task-item flex items-center p-3 rounded-lg shadow-sm transition-all duration-200 ${taskClasses}" 
							data-task-id="${task.id}"
							style="${backgroundColor}"
							${draggableAttrs}
							${deleteClickHandler}
					>
							${category && !task.completed ? `<div class="task-category-bg" style="background-color: ${category.color};"></div>` : ''}
							${
								!this.deleteMode
									? `
									<input 
											type="checkbox" 
											${task.completed ? 'checked' : ''}
											onchange="todoApp.toggleTask('${task.id}')"
											class="mr-3 h-5 w-5 text-blue-500 rounded focus:ring-blue-400 cursor-pointer"
											aria-label="Toggle task completion"
									>
							`
									: ''
							}
							<div class="flex-1 flex flex-col gap-1">
									<span 
											class="${textClasses}"
									>
											${this.escapeHtml(task.text)}
									</span>
									<div class="flex items-center gap-3">
											${priorityDisplay}
											${categoryDisplay}
											${dueDateDisplay}
									</div>
							</div>
							${
								!this.deleteMode && !task.completed
									? `
									<button 
											onclick="todoApp.editTask('${task.id}')"
											class="ml-2 text-blue-500 hover:text-blue-700 transition-colors edit-button"
											title="Edit task"
											aria-label="Edit task"
									>
											<i class="fas fa-edit"></i>
									</button>
							`
									: ''
							}
					</div>
			`;
	}

	render() {
		const activeTasks = this.tasks.filter((t) => !t.completed);
		const completedTasks = this.tasks.filter((t) => t.completed);

		activeTasks.sort((a, b) => {
			const aPastDue = this.isPastDue(a);
			const bPastDue = this.isPastDue(b);

			if (aPastDue && !bPastDue) return -1;
			if (!aPastDue && bPastDue) return 1;

			const priorityOrder = { high: 1, medium: 2, low: 3, '': 4 };
			const aPriority = priorityOrder[a.priority || ''] || 4;
			const bPriority = priorityOrder[b.priority || ''] || 4;
			if (aPriority !== bPriority) return aPriority - bPriority;

			if (a.dueDate && b.dueDate) {
				const aDate = this.parseLocalDate(a.dueDate);
				const bDate = this.parseLocalDate(b.dueDate);
				const dateDiff = aDate - bDate;
				if (dateDiff !== 0) return dateDiff;
			}
			if (a.dueDate && !b.dueDate) return -1;
			if (!a.dueDate && b.dueDate) return 1;

			if (a.categoryId && b.categoryId) {
				const aCat = this.getCategoryById(a.categoryId);
				const bCat = this.getCategoryById(b.categoryId);
				if (aCat && bCat) {
					return aCat.name.localeCompare(bCat.name);
				}
			}
			if (a.categoryId && !b.categoryId) return -1;
			if (!a.categoryId && b.categoryId) return 1;

			return 0;
		});

		document.getElementById('active-count').textContent = `${activeTasks.length} active`;
		document.getElementById('completed-count').textContent = `${completedTasks.length} completed`;

		const activeContainer = document.getElementById('active-tasks');
		if (activeTasks.length === 0) {
			activeContainer.innerHTML = `
							<div id="empty-state" class="text-center py-12 text-gray-400">
									<i class="fas fa-clipboard-list text-6xl mb-4"></i>
									<p class="text-lg">No tasks yet. Click "New Task" to add one!</p>
							</div>
					`;
		} else {
			activeContainer.innerHTML = activeTasks
				.map((task) => `<div class="group">${this.createTaskElement(task)}</div>`)
				.join('');
		}

		const completedSection = document.getElementById('completed-section');
		const completedContainer = document.getElementById('completed-tasks');

		if (completedTasks.length > 0) {
			completedSection.classList.remove('hidden');

			const completedHeader = completedSection.querySelector('h2');
			completedHeader.innerHTML = `
							<button 
									onclick="todoApp.toggleCompletedCollapse()"
									class="flex items-center w-full text-left hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
							>
									<i class="fas fa-chevron-${this.completedCollapsed ? 'right' : 'down'} mr-2 text-sm transition-transform duration-200"></i>
									<i class="fas fa-check-circle mr-2 text-green-500"></i>
									Completed Tasks (${completedTasks.length})
							</button>
					`;

			if (this.completedCollapsed) {
				completedContainer.classList.add('hidden');
			} else {
				completedContainer.classList.remove('hidden');
				completedContainer.innerHTML = completedTasks
					.map((task) => `<div class="group">${this.createTaskElement(task)}</div>`)
					.join('');
			}
		} else {
			completedSection.classList.add('hidden');
		}
	}

	openExportModal() {
		const modal = document.getElementById('export-modal');
		modal.classList.remove('hidden');
		modal.classList.add('flex');
	}

	closeExportModal() {
		const modal = document.getElementById('export-modal');
		modal.classList.add('hidden');
		modal.classList.remove('flex');
	}

	exportJSON() {
		const data = {
			version: '1.0',
			exportDate: new Date().toISOString(),
			tasks: this.tasks,
			categories: this.categories,
			stats: {
				totalTasks: this.tasks.length,
				activeTasks: this.tasks.filter((t) => !t.completed).length,
				completedTasks: this.tasks.filter((t) => t.completed).length,
			},
		};

		const json = JSON.stringify(data, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		this.downloadFile(blob, `todo-backup-${this.getDateString()}.json`);
		this.closeExportModal();
	}

	exportCSV() {
		const headers = ['Task', 'Status', 'Priority', 'Category', 'Due Date', 'Created Date', 'Completed Date'];

		const rows = this.tasks.map((task) => {
			const category = task.categoryId ? this.getCategoryById(task.categoryId) : null;
			return [
				this.escapeCSV(task.text),
				task.completed ? 'Completed' : 'Active',
				task.priority || '',
				category ? this.escapeCSV(category.name) : '',
				task.dueDate || '',
				new Date(task.createdAt).toLocaleDateString(),
				task.completedAt ? new Date(task.completedAt).toLocaleDateString() : '',
			];
		});

		const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

		const blob = new Blob([csv], { type: 'text/csv' });
		this.downloadFile(blob, `todo-tasks-${this.getDateString()}.csv`);
		this.closeExportModal();
	}

	downloadFile(blob, filename) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	getDateString() {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
	}

	escapeCSV(str) {
		if (!str) return '';
		if (str.includes(',') || str.includes('\n') || str.includes('"')) {
			return `"${str.replace(/"/g, '""')}"`;
		}
		return str;
	}

	loadUIPreferences() {
		const collapsed = localStorage.getItem('completedCollapsed');
		this.completedCollapsed = collapsed === 'true';
	}

	toggleCompletedCollapse() {
		this.completedCollapsed = !this.completedCollapsed;
		localStorage.setItem('completedCollapsed', this.completedCollapsed);
		this.render();
	}

	initTheme() {
		const savedTheme = localStorage.getItem('theme') || 'light';
		if (savedTheme === 'dark') {
			document.documentElement.classList.add('dark');
			this.updateThemeIcon(true);
		}
	}

	toggleTheme() {
		const isDark = document.documentElement.classList.toggle('dark');
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
		this.updateThemeIcon(isDark);
	}

	updateThemeIcon(isDark) {
		const icon = document.querySelector('#theme-toggle i');
		icon.className = isDark ? 'fas fa-sun text-yellow-500' : 'fas fa-moon text-gray-600';
	}

	escapeHtml(text) {
		const map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;',
		};
		return text.replace(/[&<>"']/g, (m) => map[m]);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	window.todoApp = new TodoApp();
});

window.addEventListener('beforeunload', () => {
	window.electronAPI.removeAllListeners('focus-new-task');
	window.electronAPI.removeAllListeners('export-data');
	window.electronAPI.removeAllListeners('export-json');
	window.electronAPI.removeAllListeners('export-csv');
});
