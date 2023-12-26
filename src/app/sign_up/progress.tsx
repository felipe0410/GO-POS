import * as React from 'react';
import Box from '@mui/material/Box';
import { SidebarContext } from './context';

const steps = [1, 2, 3];

export default function StepRegister() {
    const { step } = React.useContext(SidebarContext) || {};

    return (
        <Box sx={{ display: 'flex', justifyContent: "space-around", width: { lg: "37%" }, alignSelf: "center", minWidth: '200px' }}>
            {steps.map((stepp, index) => {
                return (
                    <Box key={`${index * 123}-${stepp}`}>
                        <Box sx={{
                            width: "48px",
                            height: "15px",
                            flexShrink: 0,
                            border: "3px solid #69EAE2",
                            background: step === index ? "#69EAE2" : "#1F1D2B"
                        }} />
                    </Box>
                )
            })}
        </Box>
    );
}
