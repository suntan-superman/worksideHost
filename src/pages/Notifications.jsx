import React from 'react';
import { Header } from '../components';

const Notifications = () => {
  return (
    <div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
      {/* <b className="absolute top-[10px] left-[10px] text-xl">Notifications</b> */}
      <Header category="Workside" title="Notifications" />
    </div>
  )
};

export default Notifications;
