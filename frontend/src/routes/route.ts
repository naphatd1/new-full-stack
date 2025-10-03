// Central route configuration
export const ROUTES = {
  // Authentication routes
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  // Main application routes
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',

  // House management routes
  HOUSES: {
    LIST: '/houses',
    CREATE: '/houses/create',
    EDIT: (id: string) => `/houses/${id}/edit`,
    VIEW: (id: string) => `/houses/${id}`,
    DELETE: (id: string) => `/houses/${id}/delete`,
  },

  // User management routes (if needed)
  USERS: {
    LIST: '/users',
    CREATE: '/users/create',
    EDIT: (id: string) => `/users/${id}/edit`,
    VIEW: (id: string) => `/users/${id}`,
  },

  // Settings routes
  SETTINGS: {
    GENERAL: '/settings',
    ACCOUNT: '/settings/account',
    PREFERENCES: '/settings/preferences',
  },

  // Error pages
  ERROR: {
    NOT_FOUND: '/404',
    SERVER_ERROR: '/500',
    UNAUTHORIZED: '/401',
  },
} as const;

// Helper function to generate dynamic routes
export const generateRoute = {
  houseEdit: (id: string) => ROUTES.HOUSES.EDIT(id),
  houseView: (id: string) => ROUTES.HOUSES.VIEW(id),
  houseDelete: (id: string) => ROUTES.HOUSES.DELETE(id),
  userEdit: (id: string) => ROUTES.USERS.EDIT(id),
  userView: (id: string) => ROUTES.USERS.VIEW(id),
};

// Route groups for navigation menus
export const ROUTE_GROUPS = {
  PUBLIC: [
    ROUTES.HOME,
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.REGISTER,
  ],
  PROTECTED: [
    ROUTES.DASHBOARD,
    ROUTES.PROFILE,
    ROUTES.HOUSES.LIST,
    ROUTES.SETTINGS.GENERAL,
  ],
  ADMIN: [
    ROUTES.USERS.LIST,
  ],
};

export default ROUTES;