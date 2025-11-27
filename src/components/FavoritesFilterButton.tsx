"use client";
import { Button, Badge } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface FavoritesFilterButtonProps {
  showOnlyFavorites: boolean;
  onClick: () => void;
  favoritesCount?: number;
}

export function FavoritesFilterButton({
  showOnlyFavorites,
  onClick,
  favoritesCount = 0,
}: FavoritesFilterButtonProps) {
  return (
    <Badge
      badgeContent={favoritesCount}
      color="warning"
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: '#ffd700',
          color: '#1F1D2B',
          fontWeight: 700,
        },
      }}
    >
      <Button
        onClick={onClick}
        variant={showOnlyFavorites ? 'contained' : 'outlined'}
        startIcon={showOnlyFavorites ? <StarIcon /> : <StarBorderIcon />}
        sx={{
          borderRadius: '0.5rem',
          textTransform: 'none',
          fontFamily: 'Nunito',
          fontWeight: 600,
          fontSize: '0.875rem',
          ...(showOnlyFavorites
            ? {
                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                color: '#1F1D2B',
                border: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ffed4e 0%, #ffd700 100%)',
                },
              }
            : {
                borderColor: '#69EAE2',
                color: '#69EAE2',
                '&:hover': {
                  borderColor: '#ffd700',
                  color: '#ffd700',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                },
              }),
        }}
      >
        {showOnlyFavorites ? 'Mostrando Favoritos' : 'Ver Favoritos'}
      </Button>
    </Badge>
  );
}
