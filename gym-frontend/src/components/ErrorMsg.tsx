import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

interface ErrorMsgProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

const ErrorMsg: React.FC<ErrorMsgProps> = ({ 
  title,
  message, 
  onDismiss, 
  onRetry,
  className = '' 
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium text-red-800 mb-1">{title}</h3>
          )}
          <p className="text-sm text-red-800">{message}</p>
        </div>
        <div className="ml-auto pl-3 flex space-x-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
              title="Retry"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
              title="Dismiss"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMsg;
