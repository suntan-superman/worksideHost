/* eslint-disable */

import React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ArrowDown as ArrowDownIcon } from "@phosphor-icons/react/dist/ssr/ArrowDown";
import { ArrowUp as ArrowUpIcon } from "@phosphor-icons/react/dist/ssr/ArrowUp";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";

import { showSuccessDialogWithTimer } from "../../utils/useSweetAlert";

/**
 * Component to display the number of requests awarded this month along with a trend indicator.
 *
 * @param {Object} props - The props for the component.
 * @param {number} props.diff - The percentage difference compared to the previous month.
 * @param {"up" | "down"} props.trend - The trend direction, either "up" or "down".
 * @param {Object} props.sx - The custom styles to apply to the root Card component.
 * @param {number} props.value - The total number of requests awarded this month.
 * @returns {JSX.Element} The rendered component.
 */
export function RequestsAwardedThisMonth({ diff, trend, sx, value }) {
	// Determine the Trend icon and color based on 'trend' prop
	const TrendIcon = trend === "up" ? ArrowUpIcon : ArrowDownIcon;
	const trendColor =
		trend === "up"
			? "var(--mui-palette-success-main)"
			: "var(--mui-palette-error-main)";

	return (
		<Card sx={sx}>
			<CardContent>
				<Stack spacing={2}>
					{/* Card Header */}
					<Stack
						direction="row"
						sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
						spacing={3}
					>
						<Stack spacing={1}>
							<Typography color="green" variant="h6">
								Awarded This Month
							</Typography>
							<Typography variant="h4">{value}</Typography>
						</Stack>
						<Avatar
							sx={{
								backgroundColor: "var(--mui-palette-success-main)",
								height: "56px",
								width: "56px",
							}}
						>
							<UsersIcon fontSize="var(--icon-fontSize-lg)" />
						</Avatar>
					</Stack>

					{/* Trend Section */}
					{diff ? (
						<Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
							<Stack
								sx={{ alignItems: "center" }}
								direction="row"
								spacing={0.5}
							>
								<TrendIcon
									color={trendColor}
									fontSize="var(--icon-fontSize-md)"
								/>
								<Typography color={trendColor} variant="body2">
									{diff}%
								</Typography>
							</Stack>
							<Typography color="text.secondary" variant="caption">
								Since last month
							</Typography>
						</Stack>
					) : null}
					<Button
						color="inherit"
						endIcon={
							<ArrowRightIcon
								fontSize="var(--icon-fontSize-md)"
								color="black"
							/>
						}
						size="small"
						variant="text"
						onClick={() => {
							showSuccessDialogWithTimer("Requests Awarded This Month");
						}}
					>
						Details
					</Button>
				</Stack>
			</CardContent>
		</Card>
	);
}

