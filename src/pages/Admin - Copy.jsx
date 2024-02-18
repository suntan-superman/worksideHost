import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Edit, Filter, Inject, Page, Toolbar, Resize, Freeze } from '@syncfusion/ej2-react-grids';
import { TabComponent } from '@syncfusion/ej2-react-navigations';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import { useContactContext } from '../hooks/useContactContext';
import { useFirmContext } from '../hooks/useFirmContext';
import { useRigContext } from '../hooks/useRigContext';
import { useProductContext } from '../hooks/useProductContext';
import { Header } from '../components';
import '../index.css';
import '../App.css';

const gridPageSize = 8;

const Admin = () => {
  // const { currentColor, deleteFlag, setDeleteFlag } = useStateContext();
  const [productList, setProductList] = useState(null);
  const [contactList, setContactList] = useState(null);
  const [firmList, setFirmList] = useState(null);
  const [rigList, setRigList] = useState(null);
  const [insertFlag, setInsertFlag] = useState(false);
  const editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  const toolbarOptions = ['Add', 'Edit', 'Delete'];
  const { contactsData, dispatch: contactDispatch } = useContactContext();
  const { firmData, dispatch: firmDispatch } = useFirmContext();
  const { rigData, dispatch: rigDispatch } = useRigContext();
  const { productData, dispatch: productDispatch } = useProductContext();

  const [selectedRecord, setSelectedRecord] = useState(null);
  const settings = { mode: 'Row' };
  let firmsGrid = null;
  let contactsGrid = null;
  let rigsGrid = null;
  let productsGrid = null;

  useEffect(() => {
    const fetchContacts = async () => {
      // Set Wait Cursor
      document.getElementById('root').style.cursor = 'wait';
      const response = await fetch('/api/contact');
      const json = await response.json();

      if (response.ok) {
        contactDispatch({ type: 'GET_CONTACTS', payload: json });
        setContactList(json);
      }
      // Set Default Cursor
      document.getElementById('root').style.cursor = 'default';
    };
    fetchContacts();
  }, [contactDispatch]);

  useEffect(() => {
    const fetchFirms = async () => {
      // Set Wait Cursor
      document.getElementById('root').style.cursor = 'wait';
      const response = await fetch('/api/firm');
      const json = await response.json();
      setFirmList(json);

      // if (response.ok) {
      //   firmDispatch({ type: 'GET_FIRM', payload: json });
      // }
      // Set Default Cursor
      document.getElementById('root').style.cursor = 'default';
    };
    fetchFirms();
  }, [firmDispatch]);

  useEffect(() => {
    const fetchRigs = async () => {
      // Set Wait Cursor
      document.getElementById('root').style.cursor = 'wait';
      const response = await fetch('/api/rig');
      const json = await response.json();

      if (response.ok) {
        rigDispatch({ type: 'GET_RIG', payload: json });
        setRigList(json);
      }
      // Set Default Cursor
      document.getElementById('root').style.cursor = 'default';
    };
    fetchRigs();
  }, [rigDispatch]);

  useEffect(() => {
    const fetchProducts = async () => {
      // Set Wait Cursor
      document.getElementById('root').style.cursor = 'wait';
      const response = await fetch('/api/product');
      const json = await response.json();

      if (response.ok) {
        productDispatch({ type: 'GET_PRODUCTS', payload: json });
        setProductList(json);
      }
      // Set Default Cursor
      document.getElementById('root').style.cursor = 'default';
    };
    fetchProducts();
  }, [productDispatch]);

  const handleFirmDelete = async () => {
    const fetchString = (`/api/firm/${selectedRecord}`);
    // const fetchString = ('/api/firm/' + selectedRecord);
    alert(fetchString);
    const response = await fetch(fetchString, {
      method: 'DELETE',
    });
    const json = await response.json();

    // if (!response.ok) {
    //   setError(json.error);
    // }
    if (response.ok) {
      // Clear form useStates
      // ResetUseStates();
      alert('Record Successfully Deleted ');
      // dispatch({ type: 'DELETE_PRODUCT', payload: json });
    }
    // setDeleteFlag(false);
    // setEmptyFields([]);
  };

  const handleContactDelete = async () => {
    const fetchString = (`/api/contact/${selectedRecord}`);
    alert(fetchString);
    const response = await fetch(fetchString, {
      method: 'DELETE',
    });
    const json = await response.json();

    // if (!response.ok) {
    //   setError(json.error);
    // }
    if (response.ok) {
      // Clear form useStates
      // ResetUseStates();
      alert('Record Successfully Deleted ');
      // dispatch({ type: 'DELETE_PRODUCT', payload: json });
    }
    // setDeleteFlag(false);
    // setEmptyFields([]);
  };

  const handleRigDelete = async () => {
    const fetchString = (`/api/rig/${selectedRecord}`);
    // const fetchString = ('/api/rig/' + selectedRecord);
    alert(fetchString);
    const response = await fetch(fetchString, {
      method: 'DELETE',
    });
    const json = await response.json();

    // if (!response.ok) {
    //   setError(json.error);
    // }
    if (response.ok) {
      // Clear form useStates
      // ResetUseStates();
      alert('Record Successfully Deleted ');
      // dispatch({ type: 'DELETE_PRODUCT', payload: json });
    }
    // setDeleteFlag(false);
    // setEmptyFields([]);
  };

  const handleProductDelete = async () => {
    const fetchString = (`/api/product/${selectedRecord}`);
    // const fetchString = ('/api/product/' + selectedRecord);
    alert(fetchString);
    const response = await fetch(fetchString, {
      method: 'DELETE',
    });
    const json = await response.json();

    // if (!response.ok) {
    //   setError(json.error);
    // }
    if (response.ok) {
      // Clear form useStates
      // ResetUseStates();
      alert('Record Successfully Deleted ');
      // dispatch({ type: 'DELETE_PRODUCT', payload: json });
    }
    // setDeleteFlag(false);
    // setEmptyFields([]);
  };

  const firmsActionComplete = async (args) => {
    if (!firmsGrid) return;

    if ((args.requestType === 'beginEdit'
     || args.requestType === 'add'
     || args.requestType === 'update'
     || args.requestType === 'save'
     || args.requestType === 'delete')) {
      if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
        const { dialog } = args;
        dialog.header = 'Workside Firms';
      }
      if (args.requestType === 'add') {
        // set insert flag
        setInsertFlag(true);
      }
      if (args.requestType === 'update') {
        // set insert flag
        setInsertFlag(false);
      }
      if (args.requestType === 'save') {
        // Save or Update Data
        const { data } = args;

        if (insertFlag === true) {
          const response = await fetch('/api/firm/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const json = await response.json();

          if (response.ok) {
            // console.log('Insert: ' + JSON.stringify(args.data));
            // dispatch({ type: 'CREATE_PRODUCT', payload: json });
          }
        } else {
          // dispatch({ type: 'CREATE_PRODUCT', payload: args.data });
          // console.log('Update: ' + JSON.stringify(args.data));
        }
        setInsertFlag(false);
      }
      if (args.requestType === 'delete') {
        // Delete Data
        handleFirmDelete();
        setInsertFlag(false);
      }
    }
  };

  const contactsActionComplete = async (args) => {
    if (!contactsGrid) return;

    if ((args.requestType === 'beginEdit'
     || args.requestType === 'add'
     || args.requestType === 'update'
     || args.requestType === 'save'
     || args.requestType === 'delete')) {
      if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
        const { dialog } = args;
        dialog.header = 'Workside Contacts';
      }
      if (args.requestType === 'add') {
        // set insert flag
        setInsertFlag(true);
      }
      if (args.requestType === 'update') {
        // set insert flag
        setInsertFlag(false);
      }
      if (args.requestType === 'save') {
        // Save or Update Data
        const { data } = args;

        if (insertFlag === true) {
          const response = await fetch('/api/contact/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const json = await response.json();

          if (response.ok) {
            // console.log('Insert: ' + JSON.stringify(args.data));
            // dispatch({ type: 'CREATE_PRODUCT', payload: json });
          }
        } else {
          // dispatch({ type: 'CREATE_PRODUCT', payload: args.data });
          // console.log('Update: ' + JSON.stringify(args.data));
        }
        setInsertFlag(false);
      }
      if (args.requestType === 'delete') {
        // Delete Data
        handleContactDelete();
        setInsertFlag(false);
      }
    }
  };

  const rigsActionComplete = async (args) => {
    if (!rigsGrid) return;

    if ((args.requestType === 'beginEdit'
     || args.requestType === 'add'
     || args.requestType === 'update'
     || args.requestType === 'save'
     || args.requestType === 'delete')) {
      if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
        const { dialog } = args;
        dialog.header = 'Workside Rigs';
      }
      if (args.requestType === 'add') {
        // set insert flag
        setInsertFlag(true);
      }
      if (args.requestType === 'update') {
        // set insert flag
        setInsertFlag(false);
      }
      if (args.requestType === 'save') {
        // Save or Update Data
        const { data } = args;

        if (insertFlag === true) {
          const response = await fetch('/api/rig/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const json = await response.json();

          if (response.ok) {
            // console.log('Insert: ' + JSON.stringify(args.data));
            // dispatch({ type: 'CREATE_PRODUCT', payload: json });
          }
        } else {
          // dispatch({ type: 'CREATE_PRODUCT', payload: args.data });
          // console.log('Update: ' + JSON.stringify(args.data));
        }
        setInsertFlag(false);
      }
      if (args.requestType === 'delete') {
        // Delete Data
        handleRigDelete();
        setInsertFlag(false);
      }
    }
  };

  const productsActionComplete = async (args) => {
    if (!productsGrid) return;

    if ((args.requestType === 'beginEdit'
     || args.requestType === 'add'
     || args.requestType === 'update'
     || args.requestType === 'save'
     || args.requestType === 'delete')) {
      if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
        const { dialog } = args;
        dialog.header = 'Workside Products/Services';
      }
      if (args.requestType === 'add') {
        // set insert flag
        setInsertFlag(true);
      }
      if (args.requestType === 'update') {
        // set insert flag
        setInsertFlag(false);
      }
      if (args.requestType === 'save') {
        // Save or Update Data
        const { data } = args;

        if (insertFlag === true) {
          const response = await fetch('/api/product/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const json = await response.json();

          if (response.ok) {
            // console.log('Insert: ' + JSON.stringify(args.data));
            // dispatch({ type: 'CREATE_PRODUCT', payload: json });
          }
        } else {
          // dispatch({ type: 'CREATE_PRODUCT', payload: args.data });
          // console.log('Update: ' + JSON.stringify(args.data));
        }
        setInsertFlag(false);
      }
      if (args.requestType === 'delete') {
        // Delete Data
        handleProductDelete();
        setInsertFlag(false);
      }
    }
  };

  const rowSelectedFirm = () => {
    if (firmsGrid) {
      /** Get the selected row indexes */
      const selectedrowindex = contactsGrid.getSelectedRowIndexes();
      /** Get the selected records. */
      setSelectedRecord(firmList[selectedrowindex]._id);
      // eslint-disable-next-line prefer-template
      // setEmptyFields([]);
    }
  };

  const rowSelectedContact = () => {
    if (contactsGrid) {
      /** Get the selected row indexes */
      const selectedrowindex = contactsGrid.getSelectedRowIndexes();
      /** Get the selected records. */
      setSelectedRecord(contactList[selectedrowindex]._id);
      // eslint-disable-next-line prefer-template
      // setEmptyFields([]);
    }
  };

  const rowSelectedRig = () => {
    if (rigsGrid) {
      /** Get the selected row indexes */
      const selectedrowindex = rigsGrid.getSelectedRowIndexes();
      /** Get the selected records. */
      setSelectedRecord(rigList[selectedrowindex]._id);
      // eslint-disable-next-line prefer-template
      // setEmptyFields([]);
    }
  };

  const rowSelectedProduct = () => {
    if (productsGrid) {
      /** Get the selected row indexes */
      const selectedrowindex = productsGrid.getSelectedRowIndexes();
      /** Get the selected records. */
      setSelectedRecord(productList[selectedrowindex]._id);
      // eslint-disable-next-line prefer-template
      // setEmptyFields([]);
    }
  };

  const FilterOptions = {
    type: 'Menu',
  };

  // *******************************************************
  // This is for custom phone and email editing in dialog
  // *******************************************************
  let phElem;
  let phObject;
  const createcusphonemaskinputn = () => {
    phElem = document.createElement('input');
    return phElem;
  };
  const destroycusphonemaskinputFn = () => {
    phObject.destroy();
  };
  const readcusphonemaskinputFn = () => phObject.value;
  const writecusphonemaskinputFn = (args) => {
    phObject = new MaskedTextBox({
      value: args.rowData[args.column.field].toString(),
      mask: '000-000-0000',
      placeholder: 'Phone',
      floatLabelType: 'Always',
    });
    phObject.appendTo(phElem);
  };

  const custphonemaskinput = {
    create: createcusphonemaskinputn,
    destroy: destroycusphonemaskinputFn,
    read: readcusphonemaskinputFn,
    write: writecusphonemaskinputFn,
  };

  const mailidRules = { email: [true, 'Enter valid Email'] };
  // *******************************************************
  // End of custom code
  // *******************************************************

  return (
    <div>
      <Header category="Workside" title="Admin" />
      <TabComponent cssClass="e-fill" headerPlacement="Top">
        {/* <TabItemsDirective> */}
        <div className="e-tab-header">
          <div>Companies</div>
          <div>Contacts</div>
          <div>Rigs</div>
          <div>Products/Services</div>
        </div>
        <div className="e-content">
          {/* Companies Tab */}
          <div className="absolute top-[50px] left-[20px] w-[140px] flex flex-row items-center justify-start">
            <GridComponent
              dataSource={firmList}
              actionComplete={firmsActionComplete}
              allowSelection
              allowFiltering
              allowPaging
              allowResizing
              filterSettings={FilterOptions}
              selectionSettings={settings}
              toolbar={toolbarOptions}
              rowSelected={rowSelectedFirm}
              editSettings={editOptions}
              enablePersistence
              pageSize={gridPageSize}
              frozenColumns={2}
              width="1000px"
              // width="auto"
              // eslint-disable-next-line no-return-assign, no-const-assign
              ref={(g) => firmsGrid = g}
            >
              <ColumnsDirective>
                <ColumnDirective field="_id" headerText="Id" textAlign="Left" width="10" isPrimaryKey allowEditing={false} visible={false} />
                <ColumnDirective field="firm_id" headerText="Id" textAlign="Left" width="10" allowEditing={false} visible={false} />
                <ColumnDirective field="name" headerText="Name" textAlign="Left" width="125" />
                <ColumnDirective field="type" headerText="Type" editType="dropdownedit" textAlign="Left" width="125" />
                <ColumnDirective field="area" headerText="Area" editType="dropdownedit" textAlign="Left" width="100" />
                <ColumnDirective field="address1" headerText="Address 1" textAlign="Left" width="25" />
                <ColumnDirective field="address2" headerText="Address 2" textAlign="Left" width="100" />
                <ColumnDirective field="city" headerText="City" editType="dropdownedit" textAlign="Left" width="100" />
                <ColumnDirective field="state" headerText="State" textAlign="Left" width="100" />
                <ColumnDirective field="zipcode" headerText="Zip" textAlign="Left" width="100" />
                <ColumnDirective field="status" headerText="Status" editType="dropdownedit" textAlign="Left" width="100" />
                <ColumnDirective field="statusdate" headerText="Date" type="date" editType="datepickeredit" format="MM/dd/yyy" textAlign="Right" width="140" />
                <ColumnDirective field="comment" headerText="Comment" textAlign="Left" width="200" />
              </ColumnsDirective>
              <Inject services={[Selection, Edit, Filter, Page, Toolbar, Resize, Freeze]} />
            </GridComponent>
          </div>
          {/* End of Companies Tab */}
          {/* Contacts Tab */}
          <div className="absolute top-[50px] left-[20px] w-[140px] flex flex-row items-center justify-start">
            <GridComponent
              dataSource={contactList}
              actionComplete={contactsActionComplete}
              allowSelection
              allowFiltering
              allowPaging
              allowResizing
              filterSettings={FilterOptions}
              selectionSettings={settings}
              toolbar={toolbarOptions}
              rowSelected={rowSelectedContact}
              editSettings={editOptions}
              enablePersistence
              pageSize={gridPageSize}
              frozenColumns={2}
              width="1000px"
              // width="auto"
              // eslint-disable-next-line no-return-assign, no-const-assign
              ref={(g) => contactsGrid = g}
            >
              <ColumnsDirective>
                <ColumnDirective field="_id" headerText="Id" textAlign="Left" width="50" isPrimaryKey allowEditing={false} visible={false} />
                <ColumnDirective field="contact_id" headerText="ID" textAlign="Left" width="25" allowEditing={false} visible={false} />
                <ColumnDirective field="firstname" headerText="First" textAlign="Left" width="125" />
                <ColumnDirective field="lastname" headerText="Last" textAlign="Left" width="125" />
                <ColumnDirective field="nickname" headerText="Nickname" textAlign="Left" width="100" />
                <ColumnDirective field="contactclass" headerText="Class" editType="dropdownedit" textAlign="Left" width="100" />
                <ColumnDirective field="accesslevel" headerText="Access" editType="dropdownedit" textAlign="Left" width="100" />
                <ColumnDirective field="username" headerText="User Name" textAlign="Left" width="100" />
                <ColumnDirective field="userpassword" headerText="Password" textAlign="Left" width="100" />
                <ColumnDirective field="primaryphone" headerText="Phone 1" textAlign="Left" width="100" edit={custphonemaskinput} />
                <ColumnDirective field="secondaryphone" headerText="Phone 2" textAlign="Left" width="100" edit={custphonemaskinput} />
                <ColumnDirective field="primaryemail" headerText="Email 1" textAlign="Left" width="150" validationRules={mailidRules} />
                <ColumnDirective field="secondaryemail" headerText="Email 2" textAlign="Left" width="150" validationRules={mailidRules} />
                <ColumnDirective field="status" headerText="Status" editType="dropdownedit" textAlign="Left" width="100" />
                <ColumnDirective field="statusdate" headerText="Date" type="date" editType="datepickeredit" format="MM/dd/yyy" textAlign="Right" width="140" />
                <ColumnDirective field="comment" headerText="Comment" textAlign="Left" width="200" />
              </ColumnsDirective>
              <Inject services={[Selection, Edit, Filter, Page, Toolbar, Resize, Freeze]} />
            </GridComponent>
          </div>
          {/* End of Contacts Tab */}
          {/* Rigs Tab */}
          <div className="absolute top-[50px] left-[20px] w-[140px] flex flex-row items-center justify-start">
            <GridComponent
              dataSource={rigList}
              actionComplete={rigsActionComplete}
              allowSelection
              allowFiltering
              allowPaging
              allowResizing
              filterSettings={FilterOptions}
              selectionSettings={settings}
              toolbar={toolbarOptions}
              rowSelected={rowSelectedRig}
              editSettings={editOptions}
              enablePersistence
              pageSize={gridPageSize}
              frozenColumns={2}
              width="1000px"
              // eslint-disable-next-line no-return-assign
              ref={(g) => rigsGrid = g}
            >
              <ColumnsDirective>
                <ColumnDirective field="_id" headerText="Id" textAlign="Left" width="50" isPrimaryKey allowEditing={false} visible={false} />
                <ColumnDirective field="rigname" headerText="Name" textAlign="Left" width="100" />
                <ColumnDirective field="rignumber" headerText="Number" textAlign="Left" width="75" />
                <ColumnDirective field="rigclassification" headerText="Class" textAlign="Left" width="100" />
                <ColumnDirective field="description" headerText="Description" textAlign="Left" width="75" />
                <ColumnDirective field="status" headerText="Status" editType="dropdownedit" textAlign="Left" width="100" />
                <ColumnDirective field="statusdate" headerText="Date" type="date" editType="datepickeredit" format="MM/dd/yyy" textAlign="Right" width="140" />
                <ColumnDirective field="comment" headerText="Comment" textAlign="Left" width="200" />
              </ColumnsDirective>
              <Inject services={[Selection, Edit, Filter, Page, Toolbar, Resize, Freeze]} />
            </GridComponent>
          </div>
          {/* End of Rigs */}
          {/* Products/Services Tab */}
          <div className="absolute top-[50px] left-[20px] w-[140px] flex flex-row items-center justify-start">
            <GridComponent
              dataSource={productList}
              actionComplete={productsActionComplete}
              allowSelection
              allowFiltering
              allowResizing
              allowPaging
              filterSettings={FilterOptions}
              selectionSettings={settings}
              toolbar={toolbarOptions}
              rowSelected={rowSelectedProduct}
              enablePersistence
              editSettings={editOptions}
              pageSize={gridPageSize}
              frozenColumns={2}
              width="1000px"
              // eslint-disable-next-line no-return-assign
              ref={(g) => productsGrid = g}
            >
              <ColumnsDirective>
                <ColumnDirective field="projectId" headerText="Id" textAlign="Left" width="50" isPrimaryKey="true" allowEditing="false" visible={false} />
                <ColumnDirective field="categoryname" headerText="Category" editType="dropdownedit" textAlign="Left" width="200" />
                <ColumnDirective field="productname" headerText="Service/Projects" textAlign="Left" width="100" />
                <ColumnDirective field="description" headerText="Description" textAlign="Left" width="100" />
                <ColumnDirective field="status" headerText="Status" editType="dropdownedit" textAlign="Left" width="100" />
                <ColumnDirective field="statusdate" headerText="Date" type="date" editType="datepickeredit" format="MM/dd/yyy" textAlign="Right" width="140" />
              </ColumnsDirective>
              <Inject services={[Selection, Edit, Filter, Page, Toolbar, Resize, Freeze]} />
            </GridComponent>
          </div>
        </div>
      </TabComponent>
    </div>
  );
};

export default Admin;
