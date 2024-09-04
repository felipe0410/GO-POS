import { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { SelectedProduct } from './interface';
import styled from '@emotion/styled';
import { Badge, BadgeProps, Tooltip, TooltipProps, tooltipClasses, useTheme } from '@mui/material';

type VenderContextType = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    selectedItems: SelectedProduct[];
    setSelectedItems: any;
    StyledBadge: any;
    LightTooltip: any;
};

export const VenderContext = createContext<VenderContextType>({
    isOpen: false,
    setIsOpen: () => { },
    selectedItems: [],
    setSelectedItems: () => { },
    StyledBadge: null,
    LightTooltip: null,
});
type VenderContextProviderProps = {
    children: ReactNode;
};

export const VenderContextProvider: React.FC<VenderContextProviderProps> = ({ children }) => {
    const [selectedItems, setSelectedItems] = useState<any>([])
    const [isOpen, setIsOpen] = useState(false);

    const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: -3,
            top: 13,
            padding: '0 4px',
        },
    }));


    const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "#69EAE2",
            color: "#1F1D2B",
            // boxShadow: theme.shadows[1],
            fontSize: 11,
            maxWidth: "146px",
        },
    }));

    const venderContextValue: VenderContextType = {
        isOpen,
        setIsOpen,
        selectedItems,
        setSelectedItems,
        StyledBadge,
        LightTooltip
    };

    return (
        <VenderContext.Provider value={venderContextValue}>
            {children}
        </VenderContext.Provider>
    );
};
