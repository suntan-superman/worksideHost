// npm install @mui/material @emotion/react @emotion/styled
// npm install @phosphor-icons/react

// Usage
// import React from 'react';
// import { TotalProfit } from './TotalProfit';

// function App() {
//   return (
//     <div style={{ padding: '20px' }}>
//       <TotalProfit value="$45,000" sx={{ maxWidth: 400 }} />
//     </div>
//   );
// }

// export default App;

import React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Receipt as ReceiptIcon } from "@phosphor-icons/react/dist/ssr/Receipt";

export function TotalProfit({ value, sx }) {
	return (
		<Card sx={sx}>
			<CardContent>
				<Stack
					direction="row"
					sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
					spacing={3}
				>
					{/* Left Content */}
					<Stack spacing={1}>
						<Typography color="text.secondary" variant="overline">
							Total Profit
						</Typography>
						<Typography variant="h4">{value}</Typography>
					</Stack>

					{/* Icon */}
					<Avatar
						sx={{
							backgroundColor: "var(--mui-palette-primary-main)",
							height: "56px",
							width: "56px",
						}}
					>
						<ReceiptIcon fontSize="var(--icon-fontSize-lg)" />
					</Avatar>
				</Stack>
			</CardContent>
		</Card>
	);
}
