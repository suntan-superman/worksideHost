/* eslint-disable */

import React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowDown as ArrowDownIcon } from "@phosphor-icons/react/dist/ssr/ArrowDown";
import { ArrowUp as ArrowUpIcon } from "@phosphor-icons/react/dist/ssr/ArrowUp";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { toast } from "react-toastify";

import { showSuccessDialogWithTimer } from "../../utils/useSweetAlert";

export function RequestsCompletedThisMonth({ diff, trend, sx, value }) {
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
								{/* <Typography color="text.secondary" variant="overline"> */}
								Completed This Month
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
							showSuccessDialogWithTimer("Requests Completed This Month");
						}}
					>
						Details
					</Button>
				</Stack>
			</CardContent>
		</Card>
	);
}
