# Green Reuse Exchange Platform - Frontend

A modern React.js frontend for the Green Reuse Exchange Platform, built with Vite, Tailwind CSS, and React Router.

## Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **User Authentication**: Login/signup with JWT token management
- **Item Browsing**: Search and filter items by category and location
- **Item Management**: Post new items and claim existing ones
- **Admin Dashboard**: Admin-only features for platform management
- **Real-time Updates**: Automatic refresh after item claims
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **React 18** with hooks and functional components
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **Lucide React** for icons
- **React Hot Toast** for notifications

## Prerequisites

- Node.js 16 or higher
- npm or yarn package manager

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   ├── ItemCard.jsx    # Item display card
│   ├── SearchBar.jsx   # Search and filter component
│   └── ProtectedRoute.jsx # Authentication guard
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── BrowseItems.jsx # Item browsing page
│   ├── PostItem.jsx    # Item creation page
│   ├── Login.jsx       # Login page
│   ├── Signup.jsx      # Registration page
│   └── Dashboard.jsx   # Admin dashboard
├── services/           # API services
│   └── api.js          # HTTP client and API functions
├── App.jsx             # Main app component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## Key Components

### Authentication
- **AuthContext**: Manages user authentication state and JWT tokens
- **ProtectedRoute**: Guards routes that require authentication
- **Login/Signup**: User authentication forms with validation

### Item Management
- **ItemCard**: Displays individual items with claim functionality
- **SearchBar**: Advanced search and filtering capabilities
- **PostItem**: Form for creating new item listings

### Navigation
- **Navbar**: Responsive navigation with authentication-aware menu items
- **Routing**: Client-side routing with React Router

## API Integration

The frontend communicates with the Spring Boot backend through:

- **Base URL**: `/api` (proxied to `http://localhost:8080` in development)
- **Authentication**: JWT tokens stored in localStorage
- **Error Handling**: Automatic token refresh and error notifications

### API Endpoints Used

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/items` - Get all items
- `GET /api/items/available` - Get available items
- `GET /api/items/search` - Search items
- `POST /api/items` - Create new item
- `PUT /api/items/{id}/claim` - Claim an item
- `DELETE /api/items/{id}` - Delete item
- `GET /api/admin/items` - Admin: get all items
- `DELETE /api/admin/items/{id}` - Admin: delete any item

## Styling

The application uses Tailwind CSS with custom components:

- **Custom Colors**: Primary green color scheme
- **Component Classes**: Predefined button, card, and input styles
- **Responsive Design**: Mobile-first approach with breakpoints

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_URL=http://localhost:8080/api
```

## Features in Detail

### User Authentication
- JWT token-based authentication
- Automatic token refresh
- Protected routes
- User role-based access control

### Item Browsing
- Grid and list view modes
- Advanced search with filters
- Category and location filtering
- Real-time item status updates

### Item Management
- Create new item listings
- Claim available items
- View item details and history
- Admin item deletion

### Admin Features
- Dashboard with statistics
- Item management interface
- Analytics and reporting
- User management (future)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
