
GitHub Copilot: This project appears to be a React-based web application with a backend API. It uses several libraries and frameworks to provide functionality for managing requests, mapping, and user interactions. Here's a breakdown of the key components:

### Frontend
1. **React Framework**: The frontend is built using React, a popular JavaScript library for building user interfaces.
2. **Material-UI (MUI)**: The project uses Material-UI components for styling and layout, such as `Dialog`, `Button`, and `Stack`.
3. **React Query**: The `@tanstack/react-query` library is used for managing server state and performing API calls.
4. **Google Maps Integration**: The project integrates Google Maps using the `@vis.gl/react-google-maps` library to display maps, markers, and routes.
5. **Draggable Dialogs**: The `react-draggable` library is used to make dialogs draggable within the UI.
6. **Dynamic Sidebar**: The `Sidebar` component dynamically renders navigation links based on user permissions and application state.
7. **State Management**: Context API and custom hooks (e.g., `UseStateContext`) are used for managing global state, such as the active menu and user login status.

### Backend
1. **Node.js and Express**: The backend is likely built using Node.js and Express, as indicated by the `contactController.js` file.
2. **MongoDB**: The backend interacts with a MongoDB database, as seen in the use of `process.env.REACT_APP_MONGO_URI` for API calls.
3. **REST API**: The backend exposes RESTful endpoints for managing requests, contacts, and mapping data.
4. **Axios**: The frontend uses Axios for making HTTP requests to the backend.

### Features
1. **Request Management**: The `RequestInfoModal` component displays detailed information about a request, including project details, request status, and supplier information.
2. **Mapping and Tracking**: The application displays a map with markers for locations and tracks routes in real-time.
3. **Delivery Associate Assignment**: Users can assign delivery associates to requests and update their statuses.
4. **Sidebar Navigation**: The `Sidebar` component provides a dynamic navigation menu based on user roles and permissions.
5. **Responsive Design**: The application adapts to different screen sizes, with features like collapsible sidebars for smaller screens.

### Libraries and Tools
- **React Icons**: Used for rendering icons in the UI.
- **Syncfusion Tooltip**: Provides tooltips for better user experience.
- **Date-fns**: Used for formatting dates.
- **Environment Variables**: Sensitive data like API keys and database URIs are stored in environment variables.

### Purpose
The project seems to be a logistics or operations management platform, possibly for managing supply chain requests, tracking deliveries, and assigning tasks to delivery associates. It combines real-time data visualization (maps and routes) with robust request management features.

### DEPENDENCIES
Here are the dependencies required to run this project based on the provided files and context:

### Frontend Dependencies
1. **React**: Core library for building the user interface.
   - `react`
   - `react-dom`
   - `react-router-dom` (for routing)

2. **Material-UI (MUI)**: For UI components and styling.
   - `@mui/material`
   - `@mui/icons-material`

3. **React Query**: For managing server state and API calls.
   - `@tanstack/react-query`

4. **Google Maps Integration**: For embedding and interacting with Google Maps.
   - `@vis.gl/react-google-maps`

5. **Draggable Dialogs**: For making dialogs draggable.
   - `react-draggable`

6. **Date Formatting**: For formatting dates.
   - `date-fns`

7. **Icons**: For rendering icons in the UI.
   - `react-icons`

8. **Syncfusion Tooltip**: For tooltips in the sidebar.
   - `@syncfusion/ej2-react-popups`

9. **Axios**: For making HTTP requests.
   - `axios`

10. **Environment Variables**: To manage sensitive data like API keys.
   - `dotenv` (for local development)

### Backend Dependencies
1. **Node.js and Express**: For building the backend API.
   - `express`

2. **MongoDB**: For database interactions.
   - `mongoose`

3. **CORS**: To handle cross-origin requests.
   - `cors`

4. **Body Parser**: For parsing incoming request bodies.
   - `body-parser`

5. **Dotenv**: For managing environment variables.
   - `dotenv`

### Development Dependencies
1. **ESLint**: For linting and maintaining code quality.
   - `eslint`

2. **Prettier**: For code formatting.
   - `prettier`

3. **React Scripts**: For running and building the React app.
   - `react-scripts`

### Notes
- Ensure you have a `.env` file with the required environment variables, such as `REACT_APP_GOOGLE_MAPS_API_KEY` and `REACT_APP_MONGO_URI`.
- Install dependencies using `npm install` or `yarn` in both the frontend and backend directories if they are separated.
