# worksideHost - Web Application

**Version:** 1.0.0  
**Framework:** React 18.3  
**Target:** Desktop/Tablet Operators

---

## 📋 **Overview**

React web application for operators (clients) to manage projects, create requests, review bids, and track deliveries. Desktop-optimized interface with rich data visualization.

---

## 🚀 **Quick Start**

### **Install Dependencies**
```bash
yarn install
```

### **Start Development**
```bash
yarn start  # Runs on http://localhost:3000
```

### **Build for Production**
```bash
yarn build  # Creates /build directory
```

### **Deploy to Netlify**
```bash
netlify deploy --prod --dir=build
```

---

## 📁 **Structure**

```
worksideHost/
├── public/               # Static assets
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── api/              # API integration
│   │   └── worksideAPI.jsx
│   ├── components/       # Reusable components (100+ files)
│   │   ├── RequestForm.jsx
│   │   ├── BidTable.jsx
│   │   ├── ProjectMap.jsx
│   │   └── Sidebar.jsx
│   ├── contexts/         # React Context
│   │   └── ContextProvider.jsx
│   ├── pages/            # Route pages
│   │   ├── Projects.jsx
│   │   ├── Requests.jsx
│   │   ├── Bids.jsx
│   │   └── Dashboard.jsx
│   ├── styles/           # SCSS stylesheets
│   │   └── App.scss
│   ├── utils/            # Helper functions
│   ├── App.js            # Root component
│   └── index.js          # Entry point
├── package.json
├── craco.config.js       # Create React App override
├── tailwind.config.js    # TailwindCSS config
├── netlify.toml          # Netlify config
└── _redirects            # SPA routing config
```

---

## 🎯 **Key Features**

### **Project Management**
- Create/edit/view projects
- Filter by customer, status, area
- Map view with project locations
- Assign team members

### **Request Management**
- Create service requests
- Template support for common requests
- Bid list management
- Status workflow (OPEN → COMPLETED)
- Real-time status updates

### **Bid Management**
- View submitted bids
- Compare supplier quotes
- Award bids
- Revision workflow
- SSR (Single Source Request) support

### **Reporting**
- Syncfusion charts (bar, pie, line)
- Request metrics by status
- Supplier performance
- Cost analysis

### **Map Integration**
- Google Maps (@react-google-maps/api)
- Project location markers
- Route visualization
- Geofencing (future)

---

## 🗂️ **Routing**

```javascript
// React Router v6
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/projects" element={<Projects />} />
  <Route path="/requests" element={<Requests />} />
  <Route path="/request/:id" element={<RequestDetails />} />
  <Route path="/bids" element={<Bids />} />
  <Route path="/suppliers" element={<Suppliers />} />
  <Route path="/reports" element={<Reports />} />
</Routes>
```

**SPA Routing:** `_redirects` file handles client-side routing on Netlify

---

## 🗄️ **State Management**

### **Zustand**
```javascript
// ContextProvider.jsx
export const useStateContext = create((set) => ({
  currentProject: null,
  currentUser: null,
  setCurrentProject: (project) => set({ currentProject: project }),
  // ...
}));
```

### **React Query**
```javascript
// Data fetching with caching
const { data: projects } = useQuery({
  queryKey: ['projects'],
  queryFn: () => GetAllProjects(),
  staleTime: 60000,  // 60s
  refetchInterval: 60000
});
```

---

## 🌐 **API Integration**

### **Base Configuration**
```javascript
// package.json
{
  "proxy": "https://workside-software.wl.r.appspot.com/"
}
```

### **API Service**
```javascript
// src/api/worksideAPI.jsx
const API_BASE = process.env.REACT_APP_API_URL || 
                 'https://workside-software.wl.r.appspot.com';

// Authentication with cookies (JWT)
const GetAllProjects = async () => {
  const response = await axios.get(`${API_BASE}/api/project`, {
    withCredentials: true  // Send cookies
  });
  return response.data;
};
```

### **Cookie-Based Auth**
- JWT stored in HTTP-only cookie
- Automatically sent with requests (`withCredentials: true`)
- No manual token management
- Secure against XSS attacks

---

## 🎨 **Styling**

### **TailwindCSS + SCSS**
```javascript
// Utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
</div>

// Custom SCSS
import './styles/App.scss';
```

### **Material-UI + Syncfusion**
```javascript
// Material-UI components
import { Button, TextField, Select } from '@mui/material';

// Syncfusion charts
import { ChartComponent, SeriesCollectionDirective } from '@syncfusion/ej2-react-charts';
```

### **Theme Configuration**
```javascript
// Material-UI theme
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#22C55E' },  // Green
    secondary: { main: '#3B82F6' }  // Blue
  }
});
```

---

## 📦 **Dependencies**

### **Core**
- `react` 18.3.1 - UI library
- `react-dom` 18.2.0 - DOM rendering
- `react-router-dom` 6.22.3 - Routing
- `axios` 1.6.8 - HTTP client

### **State Management**
- `zustand` 5.0.1 - State management
- `@tanstack/react-query` 5.63.0 - Data fetching
- `react-cookie` 7.2.2 - Cookie management

### **UI Libraries**
- `@mui/material` 6.1.6 - Material Design
- `@syncfusion/ej2-react-*` 30.2.4 - Charts, grids, calendars
- `@phosphor-icons/react` 2.1.7 - Icons
- `react-icons` 5.0.1 - Additional icons

### **Maps**
- `@react-google-maps/api` 2.20.3 - Google Maps
- `@vis.gl/react-google-maps` 1.4.0 - Advanced maps

### **Utilities**
- `date-fns` 4.1.0 - Date formatting
- `lodash` 4.17.21 - Utility functions
- `react-toastify` 10.0.5 - Toast notifications
- `sweetalert2` 11.15.10 - Alert dialogs

**Full List:** See `package.json`

---

## 🛠️ **Configuration Files**

### **craco.config.js**
```javascript
// Override Create React App config
module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')]
    }
  }
};
```

### **netlify.toml**
```toml
[build]
  command = "yarn build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **_redirects**
```
/*    /index.html   200
```

---

## 🧪 **Testing**

### **Run Tests**
```bash
yarn test
```

TODO: Add comprehensive test suite
- Unit tests for components
- Integration tests for API
- E2E tests with Cypress

---

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile:** < 640px (hidden, use mobile apps)
- **Tablet:** 640px - 1024px (simplified layout)
- **Desktop:** > 1024px (full features)

### **Mobile Considerations**
- Primary mobile experience via React Native apps
- Web app optimized for desktop/tablet
- Responsive tables collapse on mobile

---

## 🚀 **Deployment**

### **Netlify (Current)**
```bash
# Manual deploy
yarn build
netlify deploy --prod --dir=build

# Automatic (on git push)
# Configured in Netlify dashboard
```

### **Environment Variables (Netlify)**
```bash
# Set in Netlify dashboard
REACT_APP_API_URL=https://workside-software.wl.r.appspot.com
REACT_APP_GOOGLE_MAPS_KEY=your-key
```

### **Build Optimization**
- Code splitting by route
- Lazy loading components
- Image optimization
- Tree shaking
- Minification

---

## 🚨 **Troubleshooting**

### **"Network Error"**
- Check `proxy` in `package.json`
- Verify backend is running
- Check CORS configuration
- Ensure cookies enabled

### **"Authentication Failed"**
- Clear browser cookies
- Re-login
- Check JWT expiry (7 days)
- Verify backend `/api/auth` endpoint

### **"Map Not Loading"**
- Verify Google Maps API key
- Check API key restrictions
- Enable Maps JavaScript API
- Check browser console for errors

---

## 📈 **Performance**

### **Current Metrics**
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size: ~2MB (gzipped)

### **Optimizations Applied**
- React.lazy() for route splitting
- useMemo/useCallback for expensive computations
- React Query caching (60s stale time)
- Debounced search inputs
- Virtualized lists (Syncfusion grids)

TODO: Add performance monitoring (Lighthouse CI)

---

## 🔗 **Related Documentation**

- [Main Documentation](../docs/README.md) - Platform overview
- [Backend API](../docs/backend/api-reference.md) - API endpoints
- [Authentication](../docs/backend/auth.md) - Cookie-based auth
- [Client Mobile App](../worksideClient/README.md) - Mobile companion
- [Deployment Guide](../docs/deployment/guide.md) - Full deployment

---

## 📞 **Support**

- Check [Troubleshooting Guide](../docs/operations/troubleshooting.md)
- Review browser console for errors
- Contact: support@workside.com

---

**Quick Links:**
- [↑ Main Documentation](../docs/README.md)
- [→ Client App](../worksideClient/README.md)
- [→ Supplier App](../worksideSupplier/README.md)
- [→ API Reference](../docs/backend/api-reference.md)
