import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import DistributionCenterDialog from '../distribution-centers/DistributionCenterDialog';
import DestinationDialog from '../destinations/DestinationDialog';

const Navigation = () => {
    const [dcDialogOpen, setDcDialogOpen] = useState(false);
    const [destinationDialogOpen, setDestinationDialogOpen] = useState(false);

    return (
        <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            p: 2, 
            alignItems: 'center',
            backgroundColor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider'
        }}>
            <Button
                variant="contained"
                onClick={() => setDestinationDialogOpen(true)}
                sx={{ mr: 2 }}
            >
                Manage Destinations
            </Button>

            <Button
                variant="contained"
                onClick={() => setDcDialogOpen(true)}
            >
                Manage Distribution Centers
            </Button>

            <DestinationDialog 
                open={destinationDialogOpen}
                onClose={() => setDestinationDialogOpen(false)}
            />

            <DistributionCenterDialog 
                open={dcDialogOpen}
                onClose={() => setDcDialogOpen(false)}
            />
        </Box>
    );
};

export default Navigation; 