// User-specific JavaScript functionality

// Current app being worked on
let currentApp = null;
let uploadedFile = null;

// Load user name
function loadUserName() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const nameElement = document.getElementById('userName');
        if (nameElement) {
            nameElement.textContent = `Welcome, ${currentUser.name}`;
        }
    }
}

// Load user dashboard
function loadUserDashboard() {
    loadUserName();
    loadUserStats();
    loadUserAppsGrid();
    setupModal();
}

// Load user statistics
function loadUserStats() {
    const currentUser = getCurrentUser();
    const apps = getApps();
    
    if (currentUser) {
        const userPoints = currentUser.points || 0;
        const userTasks = currentUser.tasksCompleted || 0;
        const availableApps = apps.length;
        const completedAppNames = currentUser.completedTasks ? currentUser.completedTasks.map(task => task.appName) : [];
        const pendingTasks = apps.filter(app => !completedAppNames.includes(app.name)).length;
        
        document.getElementById('userPoints').textContent = userPoints;
        document.getElementById('userTasks').textContent = userTasks;
        document.getElementById('availableApps').textContent = availableApps;
        document.getElementById('pendingTasks').textContent = pendingTasks;
    }
}

// Load apps grid for user
function loadUserAppsGrid() {
    const apps = getApps();
    const appsGrid = document.getElementById('appsGrid');
    const currentUser = getCurrentUser();
    
    if (!appsGrid) return;
    
    appsGrid.innerHTML = '';
    
    // Get completed app names
    const completedAppNames = currentUser && currentUser.completedTasks ? 
        currentUser.completedTasks.map(task => task.appName) : [];
    
    apps.forEach(app => {
        const isCompleted = completedAppNames.includes(app.name);
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
            <div class="app-status">
                ${isCompleted ? 
                    '<span class="status-completed">✓ Completed</span>' : 
                    '<button onclick="openAppModal(\'' + app.name + '\')" class="btn btn-primary">Start Task</button>'
                }
            </div>
        `;
        appsGrid.appendChild(appCard);
    });
    
    // Add CSS for app status
    if (!document.querySelector('#userAppStyles')) {
        const style = document.createElement('style');
        style.id = 'userAppStyles';
        style.textContent = `
            .app-status {
                margin-top: 1rem;
                text-align: center;
            }
            .status-completed {
                color: #28a745;
                font-weight: bold;
                background: #d4edda;
                padding: 8px 16px;
                border-radius: 20px;
                display: inline-block;
            }
            .modal {
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-content {
                background: white;
                padding: 2rem;
                border-radius: 10px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
            }
            .close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            }
            .close:hover {
                color: #333;
            }
            .modal-actions {
                margin-top: 2rem;
            }
            .upload-section {
                margin-top: 2rem;
            }
            .upload-section h4 {
                margin-bottom: 1rem;
                color: #333;
            }
            .file-preview {
                margin-top: 1rem;
                text-align: center;
            }
            .file-preview img {
                max-width: 100%;
                max-height: 200px;
                border-radius: 8px;
                border: 2px solid #ddd;
            }
        `;
        document.head.appendChild(style);
    }
}

// Setup modal functionality
function setupModal() {
    const modal = document.getElementById('appModal');
    const closeBtn = document.querySelector('.close');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    
    // Close modal when clicking X
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
            resetModal();
        };
    }
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetModal();
        }
    };
    
    // Setup drag and drop
    if (dropZone) {
        dropZone.addEventListener('click', () => fileInput.click());
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });
    }
    
    // Handle file input change
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });
    }
    
    // Handle screenshot submission
    const submitBtn = document.getElementById('submitScreenshot');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitTask);
    }
}

// Open app modal
function openAppModal(appName) {
    const apps = getApps();
    const app = apps.find(a => a.name === appName);
    
    if (!app) return;
    
    currentApp = app;
    
    // Update modal content
    document.getElementById('modalAppName').textContent = app.name;
    document.getElementById('modalAppDescription').textContent = app.description;
    document.getElementById('modalAppPoints').textContent = `${app.points} POINTS`;
    document.getElementById('downloadAppBtn').href = app.url;
    
    // Show modal
    document.getElementById('appModal').style.display = 'flex';
}

// Handle file upload
function handleFileUpload(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB.');
        return;
    }
    
    uploadedFile = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
        const dropZone = document.getElementById('dropZone');
        dropZone.innerHTML = `
            <div class="file-preview">
                <img src="${e.target.result}" alt="Screenshot preview">
                <p>Screenshot uploaded successfully!</p>
            </div>
        `;
        
        // Show submit button
        document.getElementById('submitScreenshot').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Submit task
function submitTask() {
    if (!currentApp || !uploadedFile) {
        alert('Please upload a screenshot first.');
        return;
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Please log in to submit tasks.');
        return;
    }
    
    // Add task to user's completed tasks
    if (!currentUser.completedTasks) {
        currentUser.completedTasks = [];
    }
    
    const task = {
        appName: currentApp.name,
        points: currentApp.points,
        screenshot: uploadedFile.name, // In a real app, this would be stored properly
        completedAt: new Date().toISOString()
    };
    
    currentUser.completedTasks.push(task);
    currentUser.points = (currentUser.points || 0) + currentApp.points;
    currentUser.tasksCompleted = (currentUser.tasksCompleted || 0) + 1;
    
    // Update user data
    if (updateUser(currentUser)) {
        alert(`Congratulations! You've earned ${currentApp.points} points for completing the ${currentApp.name} task!`);
        document.getElementById('appModal').style.display = 'none';
        resetModal();
        loadUserDashboard();
    } else {
        alert('Error submitting task. Please try again.');
    }
}

// Reset modal
function resetModal() {
    currentApp = null;
    uploadedFile = null;
    
    const dropZone = document.getElementById('dropZone');
    dropZone.innerHTML = `
        <h3>📱 Drop your screenshot here</h3>
        <p>or click to browse files</p>
        <input type="file" id="fileInput" accept="image/*" style="display: none;">
    `;
    
    document.getElementById('submitScreenshot').style.display = 'none';
    
    // Re-setup file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });
    }
}

// Get apps function (from admin.js)
function getApps() {
    return JSON.parse(localStorage.getItem('apps') || '[]');
}