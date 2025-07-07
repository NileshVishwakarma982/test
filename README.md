# TaskReward - App Download Task Management System

A complete web application for managing app download tasks and point rewards, built with HTML, CSS, and JavaScript.

## 🚀 Features

### Admin Features
- **Admin Dashboard**: Overview of apps, users, and system statistics
- **Add Apps**: Create new app download tasks with points rewards
- **User Management**: View and monitor user activities
- **App Management**: Edit and delete existing apps
- **Analytics**: Track total users, completed tasks, and points distributed

### User Features
- **User Dashboard**: View available apps and personal statistics
- **Task Management**: Complete app download tasks
- **Screenshot Upload**: Drag-and-drop file upload for task verification
- **Points System**: Earn and track points for completed tasks
- **Profile Management**: Update personal information and view achievements
- **Points History**: Track earning history and redeem rewards
- **Rewards System**: Redeem points for various rewards

## 📁 File Structure

```
├── index.html          # Main landing page
├── login.html          # Login page (admin/user)
├── signup.html         # User registration page
├── logout.html         # Logout confirmation page
├── admin.html          # Admin dashboard
├── addapp.html         # Add new app page (admin)
├── user.html           # User dashboard
├── profile.html        # User profile page
├── point.html          # Points management page
├── task.html           # Task management page
├── style.css           # Main stylesheet
├── auth.js             # Authentication functions
├── admin.js            # Admin-specific functions
├── user.js             # User-specific functions
└── README.md           # This file
```

## 🔧 Setup Instructions

1. **Clone/Download**: Copy all files to your web server directory
2. **Open Website**: Navigate to `index.html` in your browser
3. **Test Login**: Use default credentials to test the system

## 🔐 Default Login Credentials

### Admin Account
- **Email**: admin@taskreward.com
- **Password**: admin123

### User Account
- **Email**: john@example.com
- **Password**: user123

## 🎯 How to Use

### For Admins
1. Login with admin credentials
2. Navigate to "Add App" to create new tasks
3. Set app details, points, and categories
4. Monitor user activities in the dashboard
5. View user statistics and task completions

### For Users
1. Sign up for a new account or login
2. Browse available apps on the dashboard
3. Click "Start Task" to begin app download
4. Download the app from the provided link
5. Take a screenshot of the app running
6. Upload the screenshot using drag-and-drop
7. Submit the task to earn points
8. Track your progress in Profile, Points, and Tasks sections

## 🏗️ Technical Implementation

### Frontend
- **HTML5**: Semantic markup and modern structure
- **CSS3**: Responsive design with modern styling
- **JavaScript**: Interactive functionality and dynamic content

### Data Storage
- **localStorage**: Client-side data persistence
- **sessionStorage**: User session management

### Key Features
- **Responsive Design**: Works on desktop and mobile devices
- **Drag-and-Drop**: Modern file upload interface
- **Role-Based Access**: Separate admin and user interfaces
- **Dynamic Content**: Real-time updates and statistics
- **Form Validation**: Client-side input validation

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🎨 Design Features

- Modern gradient backgrounds
- Card-based layouts
- Smooth animations and transitions
- Professional color scheme
- Intuitive navigation
- Clean typography

## 🛠️ Customization

### Adding New Apps
1. Login as admin
2. Go to "Add App" section
3. Fill in app details:
   - Name and description
   - App store URL
   - Category and subcategory
   - Points reward (1-1000)
   - Optional app icon

### Modifying Points
- Edit the points value when adding apps
- Points are automatically calculated and distributed
- Users can redeem points for rewards

### Styling Changes
- Modify `style.css` for visual changes
- Update color schemes in CSS variables
- Adjust responsive breakpoints as needed

## 🔒 Security Notes

**Important**: This is a demonstration application using client-side storage. For production use, implement:
- Server-side authentication
- Database storage
- File upload security
- Input sanitization
- HTTPS encryption

## 🚀 Future Enhancements

- Backend API integration
- Database connectivity
- Real file upload handling
- Email notifications
- Advanced analytics
- Mobile app integration
- Payment processing for rewards

## 📞 Support

For issues or questions about the TaskReward system:
1. Check the browser console for errors
2. Verify all files are properly uploaded
3. Test with default login credentials
4. Ensure JavaScript is enabled in the browser

## 📄 License

This project is created for demonstration purposes. Feel free to modify and use as needed.

---

**TaskReward** - Making app discovery rewarding! 🎉