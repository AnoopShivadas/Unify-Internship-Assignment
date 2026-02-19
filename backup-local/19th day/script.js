class TaskDashboard {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.currentPriority = 'medium';
    this.currentFilter = 'all';
    this.currentCategory = 'work';
    this.searchQuery = '';
    this.sortBy = 'date-new';

    this.initElements();
    this.attachEventListeners();
    this.render();
  }

  initElements() {
    this.taskInput = document.getElementById('taskInput');
    this.addTaskBtn = document.getElementById('addTaskBtn');
    this.tasksContainer = document.getElementById('tasksContainer');
    this.totalTasksEl = document.getElementById('totalTasks');
    this.activeTasks = document.getElementById('activeTasks');
    this.completedTasksEl = document.getElementById('completedTasks');
    this.progressPercent = document.getElementById('progressPercent');
    this.progressBar = document.getElementById('progressBar');
    this.emptyState = document.getElementById('emptyState');
    this.themeToggle = document.getElementById('themeToggle');
    this.searchInput = document.getElementById('searchInput');
    this.sortSelect = document.getElementById('sortSelect');
    this.categorySelect = document.getElementById('categorySelect');
    this.priorityBtn = document.getElementById('priorityBtn');
    this.priorityMenu = document.getElementById('priorityMenu');
    this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
    this.exportBtn = document.getElementById('exportBtn');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.categoryItems = document.querySelectorAll('.category-item');
  }

  attachEventListeners() {
    this.addTaskBtn.addEventListener('click', () => this.addTask());
    this.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });

    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.render();
    });
    this.sortSelect.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.render();
    });
    this.categorySelect.addEventListener('change', (e) => {
      this.currentCategory = e.target.value;
    });

    this.priorityBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePriorityMenu(e);
    });

    document.addEventListener('click', () => {
      this.priorityMenu.classList.remove('visible');
    });

    this.priorityMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const option = e.target.closest('.priority-option');
      if (option) {
        this.currentPriority = option.dataset.priority;
        this.updatePriorityIcon();
        this.priorityMenu.classList.remove('visible');
      }
    });

    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    });

    this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    this.exportBtn.addEventListener('click', () => this.exportTasks());
  }

  toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    const icon = this.themeToggle.querySelector('.theme-icon');
    icon.textContent = isDark ? '☀️' : '🌙';
  }

  togglePriorityMenu(e) {
    const rect = e.target.getBoundingClientRect();
    this.priorityMenu.style.top = (rect.bottom + 10) + 'px';
    this.priorityMenu.style.left = rect.left + 'px';
    this.priorityMenu.classList.toggle('visible');
  }

  updatePriorityIcon() {
    const icons = { high: '🔴', medium: '🟡', low: '🟢' };
    this.priorityBtn.querySelector('span').textContent = icons[this.currentPriority];
  }

  addTask() {
    const text = this.taskInput.value.trim();
    if (!text) {
      this.taskInput.focus();
      return;
    }

    const task = {
      id: Date.now(),
      text,
      completed: false,
      priority: this.currentPriority,
      category: this.currentCategory,
      createdAt: new Date().getTime(),
      completedAt: null
    };

    this.tasks.unshift(task);
    this.saveTasks();
    this.taskInput.value = '';
    this.render();
    this.taskInput.focus();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.render();
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().getTime() : null;
      this.saveTasks();
      this.render();
    }
  }

  editTask(id, newText) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.text = newText;
      this.saveTasks();
      this.render();
    }
  }

  getFilteredTasks() {
    let filtered = this.tasks;

    if (this.currentFilter === 'active') {
      filtered = filtered.filter(t => !t.completed);
    } else if (this.currentFilter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    } else if (this.currentFilter === 'high') {
      filtered = filtered.filter(t => t.priority === 'high' && !t.completed);
    }

    if (this.searchQuery) {
      filtered = filtered.filter(t =>
        t.text.toLowerCase().includes(this.searchQuery)
      );
    }

    return filtered;
  }

  getSortedTasks(tasks) {
    const sorted = [...tasks];

    switch (this.sortBy) {
      case 'date-old':
        sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'priority':
        const priorityMap = { high: 1, medium: 2, low: 3 };
        sorted.sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority]);
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.text.localeCompare(b.text));
        break;
      default:
        sorted.sort((a, b) => b.createdAt - a.createdAt);
    }

    return sorted;
  }

  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const active = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    this.totalTasksEl.textContent = total;
    this.completedTasksEl.textContent = completed;
    this.activeTasks.textContent = active;
    this.progressPercent.textContent = progress + '%';
    this.progressBar.style.width = progress + '%';
  }

  createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `task-item priority-${task.priority}${task.completed ? ' completed' : ''}`;
    div.dataset.id = task.id;

    const categoryColors = {
      work: '#667eea',
      personal: '#f093fb',
      shopping: '#4facfe',
      health: '#43e97b'
    };

    const categoryIcons = {
      work: '💼',
      personal: '👤',
      shopping: '🛒',
      health: '💚'
    };

    const createdDate = new Date(task.createdAt);
    const timeString = this.formatTime(createdDate);

    div.innerHTML = `
      <div class="task-content">
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <div class="task-main">
          <span class="task-text">${this.escapeHtml(task.text)}</span>
          <div class="task-meta">
            <span class="task-category" style="background: ${categoryColors[task.category]}80;">
              ${categoryIcons[task.category]} ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}
            </span>
            <span class="task-priority-badge ${task.priority}">${task.priority.toUpperCase()}</span>
            <span class="task-time">${timeString}</span>
          </div>
        </div>
      </div>
      <div class="task-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    const checkbox = div.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => this.toggleTask(task.id));

    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      div.classList.add('fade-out');
      setTimeout(() => this.deleteTask(task.id), 300);
    });

    const editBtn = div.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => this.enableEditMode(task, div));

    const taskText = div.querySelector('.task-text');
    taskText.addEventListener('click', () => this.toggleTask(task.id));

    return div;
  }

  enableEditMode(task, element) {
    const taskText = element.querySelector('.task-text');
    const originalText = task.text;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalText;
    input.className = 'search-input';
    input.style.flex = '1';

    taskText.replaceWith(input);
    input.focus();
    input.select();

    const saveEdit = () => {
      const newText = input.value.trim();
      if (newText && newText !== originalText) {
        this.editTask(task.id, newText);
      } else {
        this.render();
      }
    };

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') saveEdit();
    });
  }

  formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  clearCompleted() {
    if (confirm('Are you sure you want to clear all completed tasks?')) {
      this.tasks = this.tasks.filter(t => !t.completed);
      this.saveTasks();
      this.render();
    }
  }

  exportTasks() {
    const data = {
      exported: new Date().toISOString(),
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.completed).length,
      tasks: this.tasks
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  render() {
    this.tasksContainer.innerHTML = '';
    const filtered = this.getFilteredTasks();
    const sorted = this.getSortedTasks(filtered);

    if (sorted.length === 0) {
      this.emptyState.classList.remove('hidden');
    } else {
      this.emptyState.classList.add('hidden');
      sorted.forEach(task => {
        this.tasksContainer.appendChild(this.createTaskElement(task));
      });
    }

    this.updateStats();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const dashboard = new TaskDashboard();

  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const icon = document.querySelector('.theme-icon');
    icon.textContent = '☀️';
  }
});
