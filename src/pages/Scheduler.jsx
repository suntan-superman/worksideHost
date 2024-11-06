/* eslint-disable */
import React, { useEffect, useState } from "react";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";

import { Header } from "../components";

const Scheduler = () => {
  const [statusMsg, setStatusMsg] = useState(""); 

  useEffect(() => {
    setStatusMsg("Loading...");
  }, []);

  return (
		<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
			<Header category="Workside" title="Scheduler" />
      <p>{statusMsg}</p>
			<ScheduleComponent>
         <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
     </ScheduleComponent>
		</div>
	);
};

export default Scheduler;