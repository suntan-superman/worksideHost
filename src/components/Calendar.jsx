/* eslint-disable */
import React, { memo } from "react";
import PropTypes from "prop-types";
import {
	ScheduleComponent,
	ViewsDirective,
	ViewDirective,
	Day,
	Week,
	WorkWeek,
	Month,
	Agenda,
	Inject,
	Resize,
	DragAndDrop,
} from "@syncfusion/ej2-react-schedule";

import { scheduleData } from "../data/dummy";
import { Header } from ".";

/**
 * Calendar - Schedule/Calendar component for event management
 *
 * @component
 * @returns {React.ReactElement} Rendered Calendar component
 */
const Calendar = () => {
	return (
		<div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
			<Header category="App" title="Calendar" />
			<ScheduleComponent
				height="650px"
				eventSettings={{ dataSource: scheduleData }}
				selectedDate={new Date(2021, 0, 10)}
			>
				<ViewsDirective>
					{["Day", "Week", "WorkWeek", "Month", "Agenda"].map((item) => (
						<ViewDirective key={item} option={item} />
					))}
				</ViewsDirective>
				<Inject
					services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
				/>
			</ScheduleComponent>
		</div>
	);
};

export default memo(Calendar); 