/* eslint-disable */

import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Selection,
  Inject,
  Edit,
  Toolbar,
  Sort,
  Filter,
} from "@syncfusion/ej2-react-grids";
// import { customers } from '../data/dummy';
import { Header } from "../components";
import ModalDialog from "../components/ModalDialog";
import { useStateContext } from "../contexts/ContextProvider";
import { useCustomerContext } from "../hooks/useCustomerContext";

import "../index.css";

const Customers = () => {
  const { currentColor, deleteFlag, setDeleteFlag } = useStateContext();
  const { customersData, dispatch } = useCustomerContext();
  const [openModal, setOpenModal] = useState(false);
  const [messageText, setMessageText] = useState("");

  // const [customersData, setCustomersData] = useState(null);
  const [customername, setCustomerName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [state, setState] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState(new Date());
  const [comment, setComment] = useState("");
  const [selectedRecord, setSelectedRecord] = useState("");
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const apiUrl = process.env.REACT_APP_MONGO_URI;

  const settings = { mode: "Row" };
  let grid = null;

  useEffect(() => {
    const fetchCustomers = async () => {
      // Set Wait Cursor
      document.getElementById("root").style.cursor = "wait";
      // const response = await fetch(`${apiUrl}/api/customer`);
						const response = await fetch("/api/customer");
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "GET_CUSTOMER", payload: json });
        // setCustomersData(json);
      }
      // Set Default Cursor
      document.getElementById("root").style.cursor = "default";
    };
    fetchCustomers();
  }, [dispatch]);

  const ResetUseStates = () => {
    setCustomerName("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setZipCode("");
    setState("");
    setStatus("");
    setDate(new Date());
    setComment("");
    setError(null);
  };

  const SetFormData = (index) => {
    setCustomerName(customersData[index].customername);
    setAddress1(customersData[index].address1);
    setAddress2(customersData[index].address2);
    setCity(customersData[index].city);
    setZipCode(customersData[index].zipCode);
    setState(customersData[index].state);
    setStatus(customersData[index].status);
    setDate(customersData[index].statusdate);
    setComment(customersData[index].comment);
    setError(null);
  };

  const rowSelected = () => {
    if (grid) {
      /** Get the selected row indexes */
      const selectedrowindex = grid.getSelectedRowIndexes();
      /** Get the selected records. */
      // const selectedrecords = grid.getSelectedRecords();
      setSelectedRecord(customersData[selectedrowindex]._id);
      // eslint-disable-next-line prefer-template
						setMessageText(
							`Delete: ${customersData[selectedrowindex].customername}`,
						);
      setShowDeleteButton(true);
      SetFormData(selectedrowindex);
      setEmptyFields([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const customer = {
      customername,
      address1,
      address2,
      city,
      zipCode,
      state,
      status,
      date,
      comment,
    };
    // Set Wait Cursor
    document.getElementById("root").style.cursor = "wait";
    // const response = await fetch(`${apiUrl}/api/customer`, {
				const response = await fetch("/api/customer", {
					method: "POST",
					body: JSON.stringify(customer),
					headers: {
						"Content-Type": "application/json",
					},
				});
    const json = await response.json();
    // Set Default Cursor
    document.getElementById("root").style.cursor = "default";

    if (!response.ok) {
      setOpenModal(true);
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      // Clear form useStates
      ResetUseStates();
      setEmptyFields([]);
      setSelectedRecord(null);
      dispatch({ type: "CREATE_CUSTOMER", payload: json });
      setShowDeleteButton(false);
      // console.log('New Customer Added');
    }
  };

  const handleDelete = async () => {
    // const fetchString = `${apiUrl}/api/customer/${selectedRecord}`;
				const fetchString = `/api/customer/${selectedRecord}`;
    const response = await fetch(fetchString, {
      method: "DELETE",
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      // Clear form useStates
      ResetUseStates();
      dispatch({ type: "DELETE_CUSTOMER", payload: json });
    }
    setDeleteFlag(false);
    setShowDeleteButton(false);
    setEmptyFields([]);
  };

  const handleModal = () => {
    setOpenModal(true);
  };

  const DeleteRecord = () => {
    setOpenModal(false);
    handleDelete();
  };

  return (
			<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
				<div className="absolute top-[50px] left-[5px] w-[140px] flex flex-row items-center justify-start">
					<GridComponent
						dataSource={customersData}
						allowSelection={true}
						selectionSettings={settings}
						rowSelected={rowSelected}
						ref={(g) => {
							grid = g;
						}}
					>
						<ColumnsDirective>
							<ColumnDirective
								field="customername"
								headerText="Select Customer"
								textAlign="Center"
								width="125"
							/>
						</ColumnsDirective>
						<Inject services={[Selection]} />
					</GridComponent>
				</div>
				<Header category="Workside" title="Customers" />
				{/* Company Name Frame */}
				<div className="absolute top-[50px] left-[175px] flex flex-row items-center justify-start gap-[25px]">
					<b className="relative inline-block w-[120px] shrink-0">
						Company Name
					</b>
					<input
						className={
							emptyFields.includes("customername") === true
								? "bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[400px] h-7 border-[4px] border-solid border-red-500"
								: "bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[400px] h-7 border-[2px] border-solid border-gray-100"
						}
						type="text"
						placeholder="Company Name Required"
						onChange={(e) => setCustomerName(e.target.value)}
						value={customername}
					/>
				</div>
				{/* Address Frame */}
				<div className="absolute top-[80px] left-[175px] flex flex-row items-center justify-start gap-[25px]">
					<b className="relative inline-block w-[120px] shrink-0">Address</b>
					<input
						className="bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[400px] h-6 border-[2px] border-solid border-gray-100"
						type="text"
						onChange={(e) => setAddress1(e.target.value)}
						value={address1}
					/>
				</div>
				{/* Address Frame */}
				<div className="absolute top-[110px] left-[175px] flex flex-row items-center justify-start gap-[25px]">
					<b className="relative inline-block w-[120px] shrink-0">Address</b>
					<input
						className="bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[400px] h-6 border-[2px] border-solid border-gray-100"
						type="text"
						onChange={(e) => setAddress2(e.target.value)}
						value={address2}
					/>
				</div>
				{/* City and State */}
				<div className="absolute top-[140px] left-[175px] flex flex-row items-center justify-start gap-[35px]">
					<b className="relative inline-block w-[110px] shrink-0">City</b>
					<input
						className={
							emptyFields.includes("city")
								? "bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[210px] h-7 border-[4px] border-solid border-red-500"
								: "bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[210px] h-7 border-[2px] border-solid border-gray-100"
						}
						type="text"
						onChange={(e) => setCity(e.target.value)}
						value={city}
					/>
					<b className="relative inline-block w-[40px] shrink-0">State</b>
					<input
						className={
							emptyFields.includes("state") === true
								? "bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[80px] h-6 border-[2px] border-solid border-red-500"
								: "bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[80px] h-6 border-[2px] border-solid border-gray-100"
						}
						type="text"
						onChange={(e) => setState(e.target.value)}
						value={state}
					/>
				</div>
				{/* Status and Date */}
				<div className="absolute top-[170px] left-[175px] flex flex-row items-center justify-start gap-[35px]">
					<b className="relative inline-block w-[110px] shrink-0">Status</b>
					<input
						className={
							emptyFields.includes("status") === true
								? "bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[210px] h-6 border-[2px] border-solid border-red-500"
								: "bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[210px] h-6 border-[2px] border-solid border-gray-100"
						}
						type="text"
						onChange={(e) => setStatus(e.target.value)}
						value={status}
					/>
					<b className="relative inline-block w-[40px] shrink-0">Date</b>
					<DatePickerComponent
						id="statusdate"
						width="105px"
						placeholder="Enter Date"
						className={
							emptyFields.includes("date")
								? "errorDatefieldStyle"
								: "datefieldStyle"
						}
						onChange={(e) => setDate(e.target.value)}
					/>
				</div>
				{/* Comment */}
				<div className="absolute top-[200px] left-[175px] flex flex-row items-center justify-start gap-[25px]">
					<b className="relative inline-block w-[120px] shrink-0">Comment</b>
					<input
						className="bg-lightsteelblue relative rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-[400px] h-7 border-[2px] border-solid border-gray-100"
						type="text"
						onChange={(e) => setComment(e.target.value)}
						value={comment}
					/>
				</div>
				<div
					className="fixed right-10 top-[280px] gap-[10px]"
					style={{ zIndex: "1000" }}
				>
					<button
						type="button"
						onClick={handleSubmit}
						style={{ background: currentColor, borderRadius: "5%" }}
						className="text-base text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
					>
						Save
					</button>
					{showDeleteButton && (
						<button
							type="button"
							onClick={handleModal}
							// onClick={handleDelete}
							style={{ background: currentColor, borderRadius: "5%" }}
							className="text-base text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
						>
							Delete
						</button>
					)}
					{openModal && (
						<ModalDialog
							textMsg={messageText}
							open={openModal}
							onOK={() => DeleteRecord()}
							onClose={() => setOpenModal(false)}
						/>
					)}
				</div>
				{error && (
					<div className="relative bg-gainsboro-100 w-full h-[768px]">
						<ModalDialog
							textMsg={error}
							open={openModal}
							onOK={() => setOpenModal(false)}
							onClose={() => setOpenModal(false)}
						/>
					</div>
				)}
			</div>
		);
};

export default Customers;
