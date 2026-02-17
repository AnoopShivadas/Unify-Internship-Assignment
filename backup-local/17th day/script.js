const projectsDatabase = [
  {
    id: 1,
    studentName: 'Rahul Sharma',
    projectTitle: 'E-Commerce Website',
    status: 'Completed',
    price: 45000,
    expenses: 12000
  },
  {
    id: 2,
    studentName: 'Priya Patel',
    projectTitle: 'Mobile Banking App',
    status: 'Completed',
    price: 85000,
    expenses: 28000
  },
  {
    id: 3,
    studentName: 'Amit Kumar',
    projectTitle: 'Restaurant Management System',
    status: 'Pending',
    price: 52000,
    expenses: 18000
  },
  {
    id: 4,
    studentName: 'Sneha Reddy',
    projectTitle: 'Social Media Dashboard',
    status: 'Completed',
    price: 38000,
    expenses: 10000
  },
  {
    id: 5,
    studentName: 'Vikram Singh',
    projectTitle: 'Inventory Management',
    status: 'Pending',
    price: 62000,
    expenses: 22000
  },
  {
    id: 6,
    studentName: 'Anjali Verma',
    projectTitle: 'Healthcare Portal',
    status: 'Completed',
    price: 95000,
    expenses: 35000
  },
  {
    id: 7,
    studentName: 'Karan Mehta',
    projectTitle: 'Learning Management System',
    status: 'Completed',
    price: 72000,
    expenses: 25000
  },
  {
    id: 8,
    studentName: 'Neha Gupta',
    projectTitle: 'Real Estate Platform',
    status: 'Pending',
    price: 68000,
    expenses: 20000
  },
  {
    id: 9,
    studentName: 'Rohan Joshi',
    projectTitle: 'Fitness Tracking App',
    status: 'Completed',
    price: 42000,
    expenses: 15000
  },
  {
    id: 10,
    studentName: 'Pooja Nair',
    projectTitle: 'Travel Booking System',
    status: 'Pending',
    price: 78000,
    expenses: 28000
  },
  {
    id: 11,
    studentName: 'Arjun Kapoor',
    projectTitle: 'Food Delivery App',
    status: 'Completed',
    price: 55000,
    expenses: 18000
  },
  {
    id: 12,
    studentName: 'Divya Iyer',
    projectTitle: 'Event Management Portal',
    status: 'Completed',
    price: 48000,
    expenses: 16000
  }
];

let currentFilter = 'all';

function calculateStatistics() {
  const completedProjects = projectsDatabase.filter(project => project.status === 'Completed');
  const pendingProjects = projectsDatabase.filter(project => project.status === 'Pending');

  const projectsWithTax = projectsDatabase.map(project => ({
    ...project,
    priceWithTax: project.price * 1.18
  }));

  const totalRevenue = projectsDatabase.reduce((sum, project) => sum + project.price, 0);

  const totalExpenses = projectsDatabase.reduce((sum, project) => sum + project.expenses, 0);

  const netProfit = totalRevenue - totalExpenses;

  return {
    completedCount: completedProjects.length,
    pendingCount: pendingProjects.length,
    totalRevenue,
    totalExpenses,
    netProfit,
    projectsWithTax
  };
}

function animateValue(element, start, end, duration, prefix = '', suffix = '') {
  const startTimestamp = performance.now();
  const step = (currentTimestamp) => {
    const progress = Math.min((currentTimestamp - startTimestamp) / duration, 1);
    const currentValue = Math.floor(progress * (end - start) + start);
    element.textContent = prefix + currentValue.toLocaleString('en-IN') + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}

function updateDashboardStats() {
  const stats = calculateStatistics();

  animateValue(document.getElementById('completedCount'), 0, stats.completedCount, 1000);
  animateValue(document.getElementById('pendingCount'), 0, stats.pendingCount, 1000);
  animateValue(document.getElementById('totalRevenue'), 0, stats.totalRevenue, 1500, '₹');
  animateValue(document.getElementById('totalExpenses'), 0, stats.totalExpenses, 1500, '₹');
  animateValue(document.getElementById('netProfit'), 0, stats.netProfit, 1500, '₹');
}

function renderTable(filter = 'all') {
  const stats = calculateStatistics();
  const tbody = document.getElementById('tableBody');

  let filteredProjects = projectsDatabase;
  if (filter === 'completed') {
    filteredProjects = projectsDatabase.filter(p => p.status === 'Completed');
  } else if (filter === 'pending') {
    filteredProjects = projectsDatabase.filter(p => p.status === 'Pending');
  }

  tbody.innerHTML = '';

  filteredProjects.forEach((project, index) => {
    const projectWithTax = stats.projectsWithTax.find(p => p.id === project.id);
    const row = document.createElement('tr');
    row.style.animation = `fadeInUp 0.5s ease-out ${index * 0.05}s both`;

    row.innerHTML = `
      <td><strong>#${project.id}</strong></td>
      <td>${project.studentName}</td>
      <td>${project.projectTitle}</td>
      <td>
        <span class="status-badge ${project.status === 'Completed' ? 'status-completed' : 'status-pending'}">
          ${project.status}
        </span>
      </td>
      <td>₹${project.price.toLocaleString('en-IN')}</td>
      <td>₹${Math.round(projectWithTax.priceWithTax).toLocaleString('en-IN')}</td>
      <td>₹${project.expenses.toLocaleString('en-IN')}</td>
    `;

    tbody.appendChild(row);
  });
}

function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');
      currentFilter = filter;
      renderTable(filter);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateDashboardStats();
  renderTable('all');
  setupFilterButtons();
});
