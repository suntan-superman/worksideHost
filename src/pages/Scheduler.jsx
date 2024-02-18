import React, { useState } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

import { scheduleData } from '../data/dummy';
import { Header } from '../components';

// eslint-disable-next-line react/destructuring-assignment
// const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Scheduler = () => {
  return (
    <div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden">
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header category="Workside" title="Scheduler" />
        <ScheduleComponent>
          <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
        </ScheduleComponent>
      </div>  
    </div>
  );
};

export default Scheduler;
