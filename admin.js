// Admin-specific JavaScript functionality

// Initialize apps if not exists
function initializeApps() {
    if (!localStorage.getItem('apps')) {
        const defaultApps = [
            {
                name: 'Facebook',
                url: 'https://facebook.com',
                category: 'Social Media',
                subcategory: 'Social Network',
                description: 'Connect with friends and the world around you on Facebook.',
                points: 100,
                icon: null,
                dateAdded: new Date().toISOString()
            },
            {
                name: 'Instagram',
                url: 'https://instagram.com',
                category: 'Social Media',
                subcategory: 'Photo & Video',
                description: 'Share your moments with the world through photos and videos.',
                points: 75,
                icon: null,
                dateAdded: new Date().toISOString()
            },
            {
                name: 'WhatsApp',
                url: 'https://whatsapp.com',
                category: 'Social Media',
                subcategory: 'Messaging',
                description: 'Simple. Secure. Reliable messaging.',
                points: 50,
                icon: null,
                dateAdded: new Date().toISOString()
            }
        ];
        localStorage.setItem('apps', JSON.stringify(defaultApps));
    }
}

// Initialize apps
initializeApps();

// Get all apps
function getApps() {
    return JSON.parse(localStorage.getItem('apps') || '[]');
}

// Save apps
function saveApps(apps) {
    localStorage.setItem('apps', JSON.stringify(apps));
}

// Add new app
function addApp(appData) {
    try {
        const apps = getApps();
        apps.push(appData);
        saveApps(apps);
        return true;
    } catch (error) {
        console.error('Error adding app:', error);
        return false;
    }
}

// Load admin name
function loadAdminName() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const nameElement = document.getElementById('adminName');
        if (nameElement) {
            nameElement.textContent = `Welcome, ${currentUser.name}`;
        }
    }
}

// Load admin dashboard
function loadAdminDashboard() {
    loadAdminName();
    loadDashboardStats();
    loadAppsGrid();
}

// Load dashboard statistics
function loadDashboardStats() {
    const apps = getApps();
    const users = getUsers().filter(u => u.role === 'user');
    
    // Calculate total completed tasks and points
    let totalTasks = 0;
    let totalPoints = 0;
    
    users.forEach(user => {
        if (user.tasksCompleted) {
            totalTasks += user.tasksCompleted;
        }
        if (user.points) {
            totalPoints += user.points;
        }
    });
    
    // Update stats
    document.getElementById('totalApps').textContent = apps.length;
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('totalPoints').textContent = totalPoints;
}

// Load apps grid
function loadAppsGrid() {
    const apps = getApps();
    const appsGrid = document.getElementById('appsGrid');
    
    if (!appsGrid) return;
    
    appsGrid.innerHTML = '';
    
    apps.forEach(app => {
        const appCard = document.createElement('div');
        appCard.className = 'app-card';
        appCard.innerHTML = `
            <div class="app-icon">${app.name.charAt(0).toUpperCase()}</div>
            <h4>${app.name}</h4>
            <p>${app.description}</p>
            <div class="app-details">
                <small><strong>Category:</strong> ${app.category}</small><br>
                <small><strong>Subcategory:</strong> ${app.subcategory}</small>
            </div>
            <div class="app-points">${app.points} POINTS</div>
            <div class="app-actions">
                <button onclick="editApp('${app.name}')" class="btn btn-secondary">Edit</button>
                <button onclick="deleteApp('${app.name}')" class="btn btn-danger">Delete</button>
            </div>
        `;
        appsGrid.appendChild(appCard);
    });
    
    // Add CSS for app actions
    if (!document.querySelector('#appActionStyles')) {
        const style = document.createElement('style');
        style.id = 'appActionStyles';
        style.textContent = `
            .app-actions {
                margin-top: 1rem;
                display: flex;
                gap: 0.5rem;
            }
            .app-actions button {
                flex: 1;
                padding: 8px 16px;
                font-size: 0.9rem;
            }
            .btn-danger {
                background: #dc3545;
                color: white;
            }
            .btn-danger:hover {
                background: #c82333;
            }
            .app-details {
                margin: 1rem 0;
                color: #666;
            }
        `;
        document.head.appendChild(style);
    }
}

// Show users section
function showUsers() {
    const appsSection = document.getElementById('appsSection');
    const usersSection = document.getElementById('usersSection');
    
    if (appsSection && usersSection) {
        appsSection.style.display = 'none';
        usersSection.style.display = 'block';
        loadUsersTable();
    }
}

// Load users table
function loadUsersTable() {
    const users = getUsers().filter(u => u.role === 'user');
    const tableBody = document.getElementById('usersTableBody');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.points || 0}</td>
            <td>${user.tasksCompleted || 0}</td>
            <td>
                <button onclick="viewUserTasks('${user.email}')" class="btn btn-secondary">View Tasks</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Edit app function
function editApp(appName) {
    alert(`Edit functionality for ${appName} would be implemented here.`);
    // In a real application, this would open an edit form
}

// Delete app function
function deleteApp(appName) {
    if (confirm(`Are you sure you want to delete the app "${appName}"?`)) {
        const apps = getApps();
        const filteredApps = apps.filter(app => app.name !== appName);
        saveApps(filteredApps);
        loadAppsGrid();
        loadDashboardStats();
    }
}

// View user tasks
function viewUserTasks(userEmail) {
    const users = getUsers();
    const user = users.find(u => u.email === userEmail);
    
    if (user && user.completedTasks) {
        let taskList = 'Completed Tasks:\n\n';
        user.completedTasks.forEach((task, index) => {
            taskList += `${index + 1}. ${task.appName} - ${task.points} points\n`;
            taskList += `   Completed: ${new Date(task.completedAt).toLocaleDateString()}\n\n`;
        });
        
        if (user.completedTasks.length === 0) {
            taskList = 'No tasks completed yet.';
        }
        
        alert(taskList);
    } else {
        alert('No tasks found for this user.');
    }
}