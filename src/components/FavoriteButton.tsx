"use client";
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface FavoriteButtonProps {
  isFavorite?: boolean;
  loading?: boolean;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export function FavoriteButton({
  isFavorite = false,
  loading = false,
  onClick,
  size = 'medium',
  disabled = false,
}: FavoriteButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se propague el click al card
    onClick();
  };

  return (
    <Tooltip title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
      <span>
        <IconButton
          onClick={handleClick}
          disabled={disabled || loading}
          size={size}
          sx={{
            color: isFavorite ? '#ffd700' : '#ABBBC2',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: isFavorite ? '#ffed4e' : '#69EAE2',
              transform: 'scale(1.1)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          {loading ? (
            <CircularProgress size={size === 'small' ? 16 : 24} sx={{ color: '#69EAE2' }} />
          ) : isFavorite ? (
            <StarIcon />
          ) : (
            <StarBorderIcon />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}
