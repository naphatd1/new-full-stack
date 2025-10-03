import { useEffect, useCallback, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCredentials } from '@/store/slices/authSlice';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before logout

export const useActivityTracker = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const logout = useCallback(() => {
    Cookies.remove('token');
    Cookies.remove('sessionToken');
    dispatch(clearCredentials());
    toast.error('คุณถูกออกจากระบบเนื่องจากไม่ได้ใช้งานเป็นเวลานาน');
    
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, [dispatch]);

  const showWarning = useCallback(() => {
    toast.error('คุณจะถูกออกจากระบบใน 5 นาที เนื่องจากไม่ได้ใช้งาน', {
      duration: 5000,
    });
  }, []);

  const resetTimer = useCallback(() => {
    if (!isAuthenticated) return;

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    lastActivityRef.current = Date.now();

    // Set warning timer (25 minutes)
    warningTimeoutRef.current = setTimeout(showWarning, INACTIVITY_TIMEOUT - WARNING_TIME);

    // Set logout timer (30 minutes)
    timeoutRef.current = setTimeout(logout, INACTIVITY_TIMEOUT);
  }, [isAuthenticated, logout, showWarning]);

  const handleActivity = useCallback(() => {
    if (!isAuthenticated) return;
    
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    
    // Only reset timer if it's been more than 1 minute since last activity
    // This prevents excessive timer resets
    if (timeSinceLastActivity > 60 * 1000) {
      resetTimer();
    }
  }, [isAuthenticated, resetTimer]);

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear timers when not authenticated
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      return;
    }

    // Start tracking activity
    resetTimer();

    // Activity events to track
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup function
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [isAuthenticated, handleActivity, resetTimer]);

  // Check for session expiry on page focus
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivityRef.current;
        
        // If more than 30 minutes have passed, logout
        if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
          logout();
        } else {
          // Reset timer for remaining time
          resetTimer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [isAuthenticated, logout, resetTimer]);
};