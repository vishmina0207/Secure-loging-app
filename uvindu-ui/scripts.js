// Set base API URL
const API_URL = "http://localhost:3000/api/v1/user";

// Register a new user
document.getElementById('registerForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userName = document.getElementById('registerUserName').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, password, role })
        });
        
        const data = await response.json();
        if (response.ok) {
            alert(data.Message);
            window.location.href = "login.html"; // Redirect to login page
        } else {
            document.getElementById('registerError').textContent = data.Message;
        }
    } catch (error) {
        console.error(error);
        document.getElementById('registerError').textContent = "Error registering user";
    }
});

// Log in user
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userName = document.getElementById('userName').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            window.location.href = "profile.html"; // Redirect to profile page
        } else {
            document.getElementById('loginError').textContent = data.Message;
        }
    } catch (error) {
        console.error(error);
        document.getElementById('loginError').textContent = "Error logging in";
    }
});

// Fetch user profile
document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname === '/profile.html') {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("Please log in");
            window.location.href = 'login.html';
        } else {
            try {
                const response = await fetch(`${API_URL}/details`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const user = await response.json();
                document.getElementById('userDetails').textContent = `Username: ${user.userName}, Role: ${user.role}`;
            } catch (error) {
                console.error(error);
                alert("Error fetching user details");
            }
        }
    }
});

// Change password
document.getElementById('changePasswordForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch(`${API_URL}/changePassword`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        const data = await response.json();
        if (response.ok) {
            alert("Password changed successfully");
            window.location.href = "profile.html"; // Redirect to profile page
        } else {
            document.getElementById('changePasswordError').textContent = data.Message;
        }
    } catch (error) {
        console.error(error);
        document.getElementById('changePasswordError').textContent = "Error changing password";
    }
});
