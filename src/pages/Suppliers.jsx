import React from 'react';
import { Header } from '../components';

const Suppliers = () => {
  return (
    <div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
      {/* <b className="absolute top-[10px] left-[10px] text-2xl">Suppliers</b> */}
      <Header category="Workside" title="Suppliers" />
      {/* Company Name Frame */}
      <div className="absolute top-[50px] left-[175px] flex flex-row items-center justify-start gap-[25px]">
        <b className="relative inline-block w-[120px] shrink-0">Company Name</b>
        <input
          className="bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[400px] h-7 border-[2px] border-solid border-gray-100"
          type="text"
        />
      </div>
      {/* Address Frame */}
      <div className="absolute top-[80px] left-[175px] flex flex-row items-center justify-start gap-[25px]">
        <b className="relative inline-block w-[120px] shrink-0">Address</b>
        <input
          className="bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[400px] h-6 border-[2px] border-solid border-gray-100"
          type="text"
        />
      </div>
      {/* Address Frame */}
      <div className="absolute top-[110px] left-[175px] flex flex-row items-center justify-start gap-[25px]">
        <b className="relative inline-block w-[120px] shrink-0">Address</b>
        <input
          className="bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[400px] h-6 border-[2px] border-solid border-gray-100"
          type="text"
        />
      </div>
      {/* City and State */}
      <div className="absolute top-[140px] left-[175px] flex flex-row items-center justify-start gap-[35px]">
        <b className="relative inline-block w-[110px] shrink-0">City</b>
        <input
          className="bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[210px] h-6 border-[2px] border-solid border-gray-100"
          type="text"
        />
        <b className="relative inline-block w-[40px] shrink-0">State</b>
        <input
          className="bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[80px] h-6 border-[2px] border-solid border-gray-100"
          type="text"
        />
      </div>
      {/* Status and Date */}
      <div className="absolute top-[170px] left-[175px] flex flex-row items-center justify-start gap-[35px]">
        <b className="relative inline-block w-[110px] shrink-0">Status</b>
        <input
          className="bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[210px] h-6 border-[2px] border-solid border-gray-100"
          type="text"
        />
        <b className="relative inline-block w-[40px] shrink-0">Date</b>
        <input
          className="bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[80px] h-6 border-[2px] border-solid border-gray-100"
          type="text"
        />
      </div>
      {/* Comment */}
      <div className="absolute top-[200px] left-[175px] flex flex-row items-center justify-start gap-[25px]">
        <b className="relative inline-block w-[120px] shrink-0">Commment</b>
        <input
          className="bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[400px] h-7 border-[2px] border-solid border-gray-100"
          type="text"
        />
      </div>

    </div>
  );
};

export default Suppliers;
