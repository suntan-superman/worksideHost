import React, { useEffect, useState } from 'react';
import Workside from '../assets/Workside.jpg';

const RequestDetailsModal = ({ recordID, open, onOK, onClose }) => {
  if (!open || !recordID) return null;

  const [customername, setCustomerName] = useState(null);
  const [rigcompany, setRigCompany] = useState(null);
  const [requestname, setRequestName] = useState(null);
  const [datetimerequested, setDateTimeRequested] = useState(null);

  // Utilize useEffect to get Request Details
  useEffect(() => {
    const fetchRequest = async () => {
      const fetchString = (`/api/request/${recordID}`);
      // Set Wait Cursor
      document.getElementById('root').style.cursor = 'wait';
      const response = await fetch(fetchString);
      const json = await response.json();
      setCustomerName(JSON.stringify(json.companyname));
      setRigCompany(JSON.stringify(json.rigcompany));
      setRequestName(JSON.stringify(json.requestname));
      setDateTimeRequested(JSON.stringify(json.datetimerequested));
      // Set Default Cursor
      document.getElementById('root').style.cursor = 'default';
    };
    fetchRequest();
  }, []);

  return (
    // <div onClick={onClose} className="overlay">
    <div onClick={onClose} fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="reqModalContainer"
      >
        <img src={Workside} alt="/" className="reqImg" />
        <div className="reqModalRight">
          {/* <div className="content"> */}
          <div className="text-red font-bold text-xl text-center mb-20">
            {/* <p>Important:</p> */}
            <p>{customername}</p>
            <p>{rigcompany}</p>
            <p>{requestname}</p>
            <p>{datetimerequested}</p>
          </div>
          {/* <div className="btnContainer"> */}
          {/* <div className="container mx-auto px-4 flex flex-row h-32 w-32 "> */}
          <div className="container mx-auto px-4 flex flex-row h-32 w-32">
            <button className="inset-x-0 bottom-0 text-white bg-green-500 hover: bg-green-800 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5 text-center mr-5 h-14" type="button" onClick={onOK}>
              <span className="bold">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
