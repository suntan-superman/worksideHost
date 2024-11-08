/* eslint-disable */
import React, { useEffect, useState } from "react";
import { DataManager, Query } from "@syncfusion/ej2-data";
import { closest } from "@syncfusion/ej2-base";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Selection,
  Edit,
  Filter,
  Inject,
  Page,
  Toolbar,
  Resize,
  Freeze,
} from "@syncfusion/ej2-react-grids";

import RequestInfoModal from "../components/RequestInfoModal";
import { useStateContext } from "../contexts/ContextProvider";
// import RequestDetailsModal from "../components/RequestDetailsModal";

import { Header } from "../components";

const gridPageSize = 8;
let requestGrid = null;

// TODO: All Primary Supplier Contact to add others to the list 

const Requests = () => {
 	const [isLoading, setIsLoading] = useState(false);
  const { currentColor } = useStateContext();
  const [requestList, setRequestList] = useState(null);
  const editOptions = {
    allowEditing: true,
    allowAdding: true,
    allowEditOnDblClick: false,
    allowDeleting: true,
    mode: "Dialog",
  };
  const toolbarOptions = ["Add", "Edit", "Delete"];
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const settings = { mode: "Row" };
  const position = { X: "center", Y: "center" };
  const dialogAnimationSettings = {
    effect: "FlipX",
    duration: 3000,
    delay: 1000,
  };

  useEffect(() => {
    const fetchRequests = async () => {
			setIsLoading(true);
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/request`,
			);
			const json = await response.json();

			setRequestList(json);
			setIsLoading(false);
    };
    fetchRequests();
  }, []);

  const FilterOptions = {
    type: "Menu",
  };

  const dialogClose = () => {
    setShowDialog(false);
  };

  const dialogOpen = () => {
    setShowDialog(true);
  };

	// TODO Get Company Options from DB
		// Set Location Type Selection Options
		const companyOptions = [
			{ name: "Aera Energy", nameId: "1" },
			{ name: "Berry", nameId: "2" },
			{ name: "Chevron", nameId: "3" },
			{ name: "CRC", nameId: "4" },
		];

  const companySelections = {
    params: {
      actionComplete: () => false,
      allowFiltering: true,
      dataSource: new DataManager(companyOptions),
      fields: { text: "name", value: "name" },
      query: new Query(),
    },
  };

  const onRequestLoad = () => {
    const gridElement = document.getElementById("requestGridElement");
				if (gridElement?.ej2_instances[0]) {
					const gridInstance = gridElement.ej2_instances[0];
					gridInstance.pageSettings.pageSize = gridPageSize;
				}
  };

  const rowSelectedRequest = () => {
    if (requestGrid) {
      /** Get the selected row indexes */
      const selectedrowindex = requestGrid.getSelectedRowIndexes();
      /** Get the selected records. */
      setSelectedRecord(requestList[selectedrowindex]._id);
      // setEmptyFields([]);
    }
  };

  const gridTemplate = (props) => (
    <div>
      <button
        type="button"
        style={{
          background: currentColor,
          color: "white",
          padding: "5px",
          borderRadius: "5%",
        }}
        className="requestData"
      >
        Details
      </button>
    </div>
  );

  const recordClick = (args) => {
    if (args.target.classList.contains("requestData")) {
      const rowObj = requestGrid.getRowObjectFromUID(
        closest(args.target, ".e-row").getAttribute("data-uid")
      );
      setSelectedRecord(rowObj._id);
      setShowDialog(true);
    }
  };

  return (
			<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
				<Header category="Workside" title="Requests" />
				{isLoading && (
					<div className="absolute top-[50%] left-[50%]">
						<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-900" />
					</div>
				)}
				<div className="absolute top-[75px] left-[20px] w-[100%] flex flex-row items-center justify-start">
					<GridComponent
						id="requestGridElement"
						dataSource={requestList}
						allowSelection
						allowFiltering
						allowPaging
						allowResizing
						frozenColumns={2}
						filterSettings={FilterOptions}
						selectionSettings={settings}
						toolbar={toolbarOptions}
						rowSelected={rowSelectedRequest}
						recordClick={recordClick}
						editSettings={editOptions}
						enablePersistence
						load={onRequestLoad}
						// width="auto"
						width="95%"
						// eslint-disable-next-line no-return-assign
						ref={(g) => {
							requestGrid = g;
						}}
					>
						<ColumnsDirective>
							<ColumnDirective
								field="_id"
								headerText="Id"
								textAlign="Left"
								width="50"
								isPrimaryKey="true"
								allowEditing="false"
								visible={false}
							/>
							<ColumnDirective
								field="request_id"
								headerText="Id"
								textAlign="Left"
								width="50"
								allowEditing="false"
								visible={false}
							/>
							<ColumnDirective
								headerText="Details"
								textAlign="Center"
								width="80"
								template={gridTemplate}
								allowEditing="false"
							/>
							<ColumnDirective
								field="requestname"
								headerText="Request"
								textAlign="Left"
								width="100"
							/>
							<ColumnDirective
								field="customername"
								headerText="Customer"
								editType="dropdownedit"
								textAlign="Left"
								width="100"
								edit={companySelections}
							/>
							<ColumnDirective
								field="customercontact"
								headerText="Cust Contact"
								textAlign="Left"
								width="100"
							/>
							<ColumnDirective
								field="projectname"
								headerText="Project"
								textAlign="Left"
								width="200"
							/>
							<ColumnDirective
								field="rigcompany"
								headerText="Rig Company"
								textAlign="left"
								width="50"
							/>
							<ColumnDirective
								field="rigcompanycontact"
								headerText="RC Contact"
								textAlign="left"
								width="50"
							/>
							<ColumnDirective
								field="creationdate"
								headerText="Date Created"
								type="date"
								editType="datepickeredit"
								format="MM/dd/yyy"
								textAlign="Right"
								width="140"
							/>
							<ColumnDirective
								field="quantity"
								headerText="Quantity"
								textAlign="Right"
								width="100"
							/>
							<ColumnDirective
								field="vendortype"
								headerText="Vendor Type"
								editType="dropdownedit"
								textAlign="Left"
								width="100"
							/>
							<ColumnDirective
								field="datetimerequested"
								headerText="Date Requested"
								type="date"
								editType="datepickeredit"
								format="MM/dd/yyyy-hh:mm"
								textAlign="Right"
								width="140"
							/>
							<ColumnDirective
								field="comments"
								headerText="Comments"
								textAlign="left"
								width="100"
							/>
							<ColumnDirective
								field="status"
								headerText="Status"
								editType="dropdownedit"
								width="100"
							/>
							<ColumnDirective
								field="statusdate"
								headerText="Status Date"
								type="date"
								editType="datepickeredit"
								format="MM/dd/yyy"
								textAlign="Right"
								width="140"
							/>
						</ColumnsDirective>
						<Inject
							services={[
								Selection,
								Edit,
								Filter,
								Page,
								Toolbar,
								Resize,
								Freeze,
							]}
						/>
					</GridComponent>
				</div>
				<div>
					{showDialog && (
						<RequestInfoModal
						recordID={selectedRecord}
						open={dialogOpen}
						onClose={dialogClose}
					/>
					)}
				</div>
			</div>
		);
};

export default Requests;
