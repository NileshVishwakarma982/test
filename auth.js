// Simple authentication system using localStorage
// In a real application, this would be handled by a server

// Initialize default users
function initializeUsers() {
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            {
                name: 'Admin User',
                email: 'admin@taskreward.com',
                password: 'admin123',
                role: 'admin'
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'user123',
                role: 'user',
                points: 0,
                tasksCompleted: 0,
                completedTasks: []
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
}

// Initialize users when the script loads
initializeUsers();

// Get all users
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Save users
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Check if user exists
function userExists(email) {
    const users = getUsers();
    return users.some(user => user.email === email);
}

// Create new user
function createUser(name, email, password, role) {
    try {
        const users = getUsers();
        const newUser = {
            name,
            email,
            password,
            role,
            points: role === 'user' ? 0 : undefined,
            tasksCompleted: role === 'user' ? 0 : undefined,
            completedTasks: role === 'user' ? [] : undefined
        };
        users.push(newUser);
        saveUsers(users);
        return true;
    } catch (error) {
        console.error('Error creating user:', error);
        return false;
    }
}

// Authenticate user
function authenticateUser(email, password, role) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    
    if (user) {
        // Store user data in session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

// Get current user
function getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Update user data
function updateUser(updatedUser) {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === updatedUser.email);
    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        saveUsers(users);
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return true;
    }
    return false;
}

// Check if user is logged in
function isLoggedIn() {
    return sessionStorage.getItem('loggedIn') === 'true';
}

// Logout user
function logout() {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Protect pages - redirect if not logged in
function protectPage(requiredRole) {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    
    const userRole = sessionStorage.getItem('userRole');
    if (requiredRole && userRole !== requiredRole) {
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}