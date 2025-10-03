import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/types'

export interface AuthState {
  user: User | null
  token: string | null
  sessionToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  firstName: string
  lastName: string
}

const initialState: AuthState = {
  user: null,
  token: null,
  sessionToken: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to prevent flash
  error: null,
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.message || 'Login failed')
      }

      const result = await response.json()
      
      return result.data
    } catch {
      return rejectWithValue('Network error occurred')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.message || 'Registration failed')
      }

      const result = await response.json()
      
      return result.data
    } catch {
      return rejectWithValue('Network error occurred')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    try {
      const state = getState() as { auth: AuthState }
      const token = state.auth.token

      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      }
      
      return null
    } catch {
      return null
    }
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: 'include', // Include cookies
      })

      if (!response.ok) {
        return rejectWithValue('Token invalid')
      }

      const result = await response.json()
      
      return { user: result.data, token: 'from-cookie' }
    } catch {
      return rejectWithValue('Auth check failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.sessionToken = null
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.sessionToken = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.sessionToken = null
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
        // ไม่ต้อง set user และ token - ให้ user ไป login เอง
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.sessionToken = null
        state.isAuthenticated = false
        state.error = null
        state.isLoading = false
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.sessionToken = null
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.sessionToken = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { clearError, setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer