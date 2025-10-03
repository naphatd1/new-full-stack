import React from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface ApiErrorFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
  title?: string;
  description?: string;
  showRetry?: boolean;
}

export const ApiErrorFallback: React.FC<ApiErrorFallbackProps> = ({
  error,
  onRetry,
  title = "เกิดข้อผิดพลาด",
  description,
  showRetry = true,
}) => {
  const isNetworkError = error?.message.includes('เชื่อมต่อ') || error?.message.includes('Failed to fetch');
  
  const getErrorMessage = () => {
    if (!error) return description || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
    
    if (isNetworkError) {
      return "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง";
    }
    
    return error.message || description || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
  };

  const getIcon = () => {
    if (isNetworkError) {
      return <WifiOff className="h-12 w-12 text-red-500" />;
    }
    return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>
        <CardTitle className="text-lg font-semibold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {getErrorMessage()}
        </p>
        
        {isNetworkError && (
          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Wifi className="h-4 w-4" />
              <span className="font-medium">เคล็ดลับการแก้ไข:</span>
            </div>
            <ul className="text-left space-y-1">
              <li>• ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
              <li>• ตรวจสอบว่าเซิร์ฟเวอร์ทำงานอยู่</li>
              <li>• ลองรีเฟรชหน้าเว็บ</li>
            </ul>
          </div>
        )}
        
        {showRetry && onRetry && (
          <Button 
            onClick={onRetry}
            className="w-full flex items-center space-x-2"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4" />
            <span>ลองใหม่อีกครั้ง</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    // Set client-side flag and initial online status
    setIsClient(true);
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't render anything during SSR or if online
  if (!isClient || isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 text-sm z-50">
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="h-4 w-4" />
        <span>ไม่มีการเชื่อมต่ออินเทอร์เน็ต</span>
      </div>
    </div>
  );
};

export default ApiErrorFallback;