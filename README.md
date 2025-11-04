# Extracurricular Activities Platform

A comprehensive web application for organizing and managing student extracurricular activities such as clubs, sports, and events. The platform tracks participation, manages event registrations, and provides updates on upcoming activities.

## Features

### For Students
- **Browse Activities**: Discover and explore various extracurricular activities
- **Register for Activities**: Join clubs, sports teams, and other activities
- **Event Management**: Register for events and track attendance
- **Personal Dashboard**: View your activities, events, and achievements
- **Notifications**: Receive updates about events and activities
- **Profile Management**: Update personal information and preferences

### For Administrators
- **Activity Management**: Create, edit, and manage extracurricular activities
- **Event Management**: Schedule and manage events and competitions
- **User Management**: Manage student accounts and permissions
- **Registration Review**: Approve or reject activity registrations
- **Analytics Dashboard**: Track participation and engagement metrics
- **Attendance Tracking**: Monitor student attendance and performance

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** for cross-origin resource sharing

### Frontend
- **React** with TypeScript
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Axios** for API calls
- **date-fns** for date manipulation
- **react-toastify** for notifications

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd extracurricular-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/extracurricular-platform
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run server
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### Getting Started

1. **Register an Account**: Create a new account as a student or administrator
2. **Login**: Use your credentials to access the platform
3. **Explore Activities**: Browse available extracurricular activities
4. **Register for Activities**: Join activities that interest you
5. **Manage Events**: Register for events and track your participation

### For Administrators

1. **Access Admin Panel**: Navigate to the admin dashboard
2. **Create Activities**: Add new extracurricular activities
3. **Manage Events**: Schedule and manage events
4. **Review Registrations**: Approve or reject student registrations
5. **Track Analytics**: Monitor participation and engagement

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get single activity
- `POST /api/activities` - Create new activity (Admin only)
- `PUT /api/activities/:id` - Update activity (Admin only)
- `DELETE /api/activities/:id` - Delete activity (Admin only)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/unregister` - Unregister from event

### Registrations
- `POST /api/registrations` - Register for activity
- `GET /api/registrations/my` - Get user's registrations
- `GET /api/registrations` - Get all registrations (Admin only)
- `PUT /api/registrations/:id/approve` - Approve registration (Admin only)
- `PUT /api/registrations/:id/reject` - Reject registration (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Deactivate user (Admin only)

## Database Schema

### User Model
- Personal information (name, email, phone)
- Role (student/admin)
- Student ID and grade level
- Profile picture and preferences
- Notification settings

### Activity Model
- Activity details (name, description, category)
- Schedule and location information
- Supervisor contact information
- Requirements and prerequisites
- Participant tracking

### Event Model
- Event details (title, description, type)
- Date, time, and location
- Capacity and registration requirements
- Attendee management
- Feedback and ratings

### Registration Model
- User and activity association
- Registration status and approval
- Attendance tracking
- Performance and achievements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Future Enhancements

- Mobile application
- Advanced analytics and reporting
- Integration with school management systems
- Real-time notifications
- File upload for documents and images
- Calendar integration
- Social features and messaging
- Gamification and badges
- Multi-language support


