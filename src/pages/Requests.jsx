import React, { useEffect, useState } from 'react';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { closest } from '@syncfusion/ej2-base';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Edit, Filter, Inject, Page, Toolbar, Resize, Freeze, CommandColumn } from '@syncfusion/ej2-react-grids';
// import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Edit, Filter, Inject, Page, Toolbar, Resize, Freeze, CommandColumn } from '@syncfusion/ej2-react-grids';
// import { useRequestContext } from '../hooks/useRequestContext';
import { useStateContext } from '../contexts/ContextProvider';
import RequestDetailsModal from '../components/RequestDetailsModal';

import { Header } from '../components';

const gridPageSize = 8;
let requestGrid = null;

const Requests = () => {
  const { currentColor } = useStateContext();
  const [requestList, setRequestList] = useState(null);
  // const editing = { allowDeleting: true, allowEditing: true };
  const editOptions = { allowEditing: true, allowAdding: true, allowEditOnDblClick: false, allowDeleting: true, mode: 'Dialog' };
  const toolbarOptions = ['Add', 'Edit', 'Delete'];
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedID, setSelectedID] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const defaultDialogInstance = null;
  const PositioningInstance = null;
  const settings = { mode: 'Row' };
  const position = { X: 'left', Y: 'top' };
  const dialogAnimationSettings = { effect: 'FlipX', duration: 3000, delay: 1000 };

  useEffect(() => {
    const fetchRequests = async () => {
      // Set Wait Cursor
      document.getElementById('root').style.cursor = 'wait';
      const response = await fetch('/api/request');
      const json = await response.json();

      setRequestList(json);
      // Set Default Cursor
      document.getElementById('root').style.cursor = 'default';
    };
    fetchRequests();
  }, []);

  const FilterOptions = {
    type: 'Menu',
  };

  const dialogClose = () => {
    setShowDialog(false);
  };

  const dialogOpen = () => {
    setShowDialog(true);
  };

  // Set Location Type Selection Options
  const companyOptions = [
    { name: 'Aera Energy', nameId: '1' },
    { name: 'Chevron', nameId: '2' },
    { name: 'CRC', nameId: '3' }];

  const companySelections = {
    params: {
      actionComplete: () => false,
      allowFiltering: true,
      dataSource: new DataManager(companyOptions),
      fields: { text: 'name', value: 'name' },
      query: new Query(),
    },
  };

  const onRequestLoad = () => {
    const gridElement = document.getElementById('requestGridElement');
    if (gridElement && gridElement.ej2_instances[0]) {
      const gridInstance = gridElement.ej2_instances[0];
      gridInstance.pageSettings.pageSize = gridPageSize;
      // gridInstance.pageSettings.frozenColumns = 3;
      // gridInstance.pageSettings.freeze = true;
    }
  };

  const rowSelectedRequest = () => {
    if (requestGrid) {
      /** Get the selected row indexes */
      const selectedrowindex = requestGrid.getSelectedRowIndexes();
      /** Get the selected records. */
      setSelectedRecord(requestList[selectedrowindex]._id);
      // alert('Selected Record Id ' + selectedRecord + 'Name: ' + requestList[selectedrowindex].requestname);
      // eslint-disable-next-line prefer-template
      // setEmptyFields([]);
    }
  };

  const gridTemplate = (props) => (
    <div>
      <button
        type="button"
        style={{ background: currentColor, color: 'white', padding: '5px', borderRadius: '5%' }}
        className="requestData"
      >Details
      </button>
    </div>
  );

  function selectionDetails() {
    <>
      <text> Customer Name </text>
      <text> Rig Company </text>
      <text> Request Name </text>
      <text> Date/Time Requested </text>
    </>;
  }

  // const selectionDetails = () => (
  //   // <div>
  //   <text> {requestList[selectedRecord].customername} </text>
  //   <text> {requestList[selectedRecord].rigcompany} </text>
  //   <text> {requestList[selectedRecord].requestname} </text>
  //   <text> {requestList[selectedRecord].datetimerequested} </text>
  // </div>
  //     <div>
  //       <text> Customer Name </text>
  //       <text> Rig Company </text>
  //       <text> Request Name </text>
  //       <text> Date/Time Requested </text>
  //     </div>
  // );

  const recordClick = (args) => {
    if (args.target.classList.contains('requestData')) {
      const rowObj = requestGrid.getRowObjectFromUID(closest(args.target, '.e-row').getAttribute('data-uid'));

      const selectedrowindex = requestGrid.getSelectedRowIndexes();
      // alert('Index: ' + selectedrowindex + ' ID: ' + rowObj._id);
      setSelectedRecord(rowObj._id);
      // alert('Index: ' + selectedrowindex + ' ID: ' + selectedRecord);
      // https://ej2.syncfusion.com/react/documentation/dialog/getting-started
      // alert('Button Selected');
      // Shows Dialog in Full Screen Mode
      // if (defaultDialogInstance) defaultDialogInstance.show(true);
      setShowDialog(true);
    }
  };

  // const dialogHeader = () => {
  //   <span id="template">Workside</span>;
  // };
  // const requestCommands = [{ type: 'Edit', buttonOption: { iconCss: ' e-icons e-edit', cssClass: 'e-flat' } },
  //   { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat' } },
  //   { type: 'Save', buttonOption: { iconCss: 'e-icons e-update', cssClass: 'e-flat' } },
  //   { type: 'Cancel', buttonOption: { iconCss: 'e-icons e-cancel-icon', cssClass: 'e-flat' } }];

  return (
    <div className="App">
      <div id="requestFrame" className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
        {/* <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl"> */}
        <Header category="Workside" title="Requests" />
        <GridComponent
          id="requestGridElement"
          dataSource={requestList}
          // actionBegin={actionBegin}
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
          width="1400px"
          // eslint-disable-next-line no-return-assign
          ref={(g) => requestGrid = g}
        >
          <ColumnsDirective>
            <ColumnDirective field="_id" headerText="Id" textAlign="Left" width="50" isPrimaryKey="true" allowEditing="false" visible={false} />
            <ColumnDirective field="request_id" headerText="Id" textAlign="Left" width="50" allowEditing="false" visible={false} />
            <ColumnDirective headerText="Details" textAlign="Center" width="80" template={gridTemplate} allowEditing="false" />
            <ColumnDirective field="requestname" headerText="Request" textAlign="Left" width="100" />
            <ColumnDirective field="customername" headerText="Customer" editType="dropdownedit" textAlign="Left" width="100" edit={companySelections} />
            <ColumnDirective field="customercontact" headerText="Cust Contact" textAlign="Left" width="100" />
            <ColumnDirective field="projectname" headerText="Project" textAlign="Left" width="200" />
            <ColumnDirective field="rigcompany" headerText="Rig Company" textAlign="left" width="50" />
            <ColumnDirective field="rigcompanycontact" headerText="RC Contact" textAlign="left" width="50" />
            <ColumnDirective field="creationdate" headerText="Date Created" type="date" editType="datepickeredit" format="MM/dd/yyy" textAlign="Right" width="140" />
            <ColumnDirective field="quantity" headerText="Quantity" textAlign="Right" width="100" />
            <ColumnDirective field="vendortype" headerText="Vendor Type" editType="dropdownedit" textAlign="Left" width="100" />
            <ColumnDirective field="datetimerequested" headerText="Date Requested" type="date" editType="datepickeredit" format="MM/dd/yyyy-hh:mm" textAlign="Right" width="140" />
            <ColumnDirective field="comments" headerText="Comments" textAlign="left" width="100" />
            <ColumnDirective field="status" headerText="Status" editType="dropdownedit" width="100" />
            <ColumnDirective field="statusdate" headerText="Status Date" type="date" editType="datepickeredit" format="MM/dd/yyy" textAlign="Right" width="140" />
            {/* <ColumnDirective headerText="Manage" width="50" commands={requestCommands} /> */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            {/* {employeesGrid.map((item, index) => <ColumnDirective key={index} {...item} />)} */}
          </ColumnsDirective>
          {/* <Inject services={[Selection, Edit, Filter, CommandColumn, Page, Toolbar, Resize, Freeze]} /> */}
          <Inject services={[Selection, Edit, Filter, Page, Toolbar, Resize, Freeze]} />
        </GridComponent>
      </div>
      <div>
        { showDialog
          && (
          <DialogComponent
            id="requestDetailsDialog"
            header="Workside Request Details"
            visible={showDialog}
            showCloseIcon
            // show
            width="400px"
            height="800px"
            // eslint-disable-next-line no-return-assign, no-const-assign
            // ref={(dialog) => defaultDialogInstance = dialog}
            open={dialogOpen}
            close={dialogClose}
            position={position}
            dialogAnimationSettings={dialogAnimationSettings}
            closeOnEscape
          >
            <RequestDetailsModal
              recordID={selectedRecord}
              open={showDialog}
              onOK={dialogClose}
              onClose={dialogClose}
            />
          </DialogComponent>
          )}
      </div>
    </div>
  );
};

export default Requests;
