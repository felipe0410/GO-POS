import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText,
  children,
  disabled = false,
  startIcon,
  ...props
}) => {
  const isDisabled = loading || disabled;
  const displayIcon = loading ? <CircularProgress size={16} color="inherit" /> : startIcon;
  const displayText = loading && loadingText ? loadingText : children;

  return (
    <Button
      {...props}
      disabled={isDisabled}
      startIcon={displayIcon}
    >
      {displayText}
    </Button>
  );
};