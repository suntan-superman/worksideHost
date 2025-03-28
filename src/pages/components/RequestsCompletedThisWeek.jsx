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
import { CurrencyDollar as CurrencyDollarIcon } from "@phosphor-icons/react/dist/ssr/CurrencyDollar";

import { showSuccessDialogWithTimer } from "../../utils/useSweetAlert";

/**
 * Component to display the number of requests completed this week along with a trend indicator.
 *
 * @param {Object} props - The component props.
 * @param {number} props.diff - The percentage difference in completed requests compared to last week.
 * @param {"up" | "down"} props.trend - The trend direction, either "up" for an increase or "down" for a decrease.
 * @param {Object} props.sx - The custom styles to apply to the root Card component.
 * @param {number} props.value - The total number of requests completed this week.
 * @returns {JSX.Element} The rendered component.
 */
export function RequestsCompletedThisWeek({ diff, trend, sx, value }) {
	const TrendIcon = trend === "up" ? ArrowUpIcon : ArrowDownIcon;
	const trendColor =
		trend === "up"
			? "var(--mui-palette-success-main)"
			: "var(--mui-palette-error-main)";

	return (
		<Card sx={sx}>
			<CardContent>
				<Stack spacing={3}>
					{/* Budget Details */}
					<Stack
						direction="row"
						sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
						spacing={3}
					>
						<Stack spacing={1}>
							<Typography color="green" variant="h6">
								{/* <Typography color="text.secondary" variant="overline"> */}
								Completed This Week
							</Typography>
							<Typography variant="h4">{value}</Typography>
						</Stack>
						<Avatar
							sx={{
								backgroundColor: "var(--mui-palette-primary-main)",
								height: "56px",
								width: "56px",
							}}
						>
							<CurrencyDollarIcon fontSize="var(--icon-fontSize-lg)" />
						</Avatar>
					</Stack>

					{/* Trend Indicator */}
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
								From last week
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
							showSuccessDialogWithTimer("Requests Completed This Week");
						}}
					>
						Details
					</Button>
				</Stack>
			</CardContent>
		</Card>
	);
}
