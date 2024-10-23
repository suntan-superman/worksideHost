/* eslint-disable */
import React, { useEffect, useState } from "react";
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
} from "@syncfusion/ej2-react-grids";
import { toast } from "react-toastify";
import { Header } from "../components";
import { useProductContext } from "../hooks/useProductContext";
import "../index.css";

const apiUrl = process.env.REACT_APP_MONGO_URI;

// const gridPageSize = 12;

const Products = () => {
  // const { currentColor, deleteFlag, setDeleteFlag } = useStateContext();
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [insertFlag, setInsertFlag] = useState(false);
  const editOptions = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: "Dialog",
  };
  const toolbarOptions = ["Add", "Edit", "Delete"];
  const { productsData, dispatch } = useProductContext();

  const [selectedRecord, setSelectedRecord] = useState(null);
  // const [error, setError] = useState(null);
  // const [emptyFields, setEmptyFields] = useState([]);
  const settings = { mode: "Row" };
  let grid = null;

  useEffect(() => {
    const fetchProducts = async () => {
      // Set Wait Cursor
      document.getElementById("root").style.cursor = "wait";
			const response = await fetch(
				"https://workside-software.wl.r.appspot.com/api/product",
			);
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "GET_PRODUCTS", payload: json });
        setFilteredProducts(json);
      }
      // Set Default Cursor
      document.getElementById("root").style.cursor = "default";
    };
    fetchProducts();
  }, [dispatch]);

  const handleDelete = async () => {
		const fetchString = `https://workside-software.wl.r.appspot.com/api/product/${selectedRecord}`;
    const response = await fetch(fetchString, {
      method: "DELETE",
    });
    // const json = await response.json();

    // if (!response.ok) {
    //   setError(json.error);
    // }
    if (response.ok) {
      // Clear form useStates
      // ResetUseStates();
      toast.success("Record Successfully Deleted...");
    }
    // setDeleteFlag(false);
    // setEmptyFields([]);
  };

  const actionComplete = async (args) => {
    if (!grid) return;

    if (
      args.requestType === "beginEdit" ||
      args.requestType === "add" ||
      args.requestType === "update" ||
      args.requestType === "save" ||
      args.requestType === "delete"
    ) {
      if (args.requestType === "beginEdit" || args.requestType === "add") {
        const { dialog } = args;
        dialog.header = "Workside Product/Services";
      }
      if (args.requestType === "add") {
        // set insert flag
        setInsertFlag(true);
      }
      if (args.requestType === "update") {
        // set insert flag
        setInsertFlag(false);
      }
      if (args.requestType === "save") {
        // Save or Update Data
        const { data } = args;

        if (insertFlag === true) {
					const response = await fetch(
						"https://workside-software.wl.r.appspot.com/api/product/",
						{
							method: "POST",
							body: JSON.stringify(data),
							headers: {
								"Content-Type": "application/json",
							},
						},
					);

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
      if (args.requestType === "delete") {
        // Delete Data
        handleDelete();
        setInsertFlag(false);
      }
    }
  };

  const rowSelectedProduct = () => {
    if (grid) {
      /** Get the selected row indexes */
      const selectedrowindex = grid.getSelectedRowIndexes();
      /** Get the selected records. */
      setSelectedRecord(filteredProducts[selectedrowindex]._id);
      // eslint-disable-next-line prefer-template
      // setEmptyFields([]);
    }
  };

  const FilterOptions = {
    type: "Menu",
  };

  return (
			<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
				<Header category="Workside" title="Products" />
				<div className="absolute top-[50px] left-[20px] w-[140px] flex flex-row items-center justify-start">
					<GridComponent
						dataSource={filteredProducts}
						actionComplete={actionComplete}
						allowSelection
						allowFiltering
						allowPaging
						filterSettings={FilterOptions}
						selectionSettings={settings}
						toolbar={toolbarOptions}
						rowSelected={rowSelectedProduct}
						editSettings={editOptions}
						width="auto"
						// eslint-disable-next-line no-return-assign
						ref={(g) => {
							grid = g;
						}}
					>
						<ColumnsDirective>
							<ColumnDirective
								field="projectId"
								headerText="Id"
								textAlign="Left"
								width="50"
								isPrimaryKey="true"
								allowEditing="false"
								visible={false}
							/>
							<ColumnDirective
								field="categoryname"
								headerText="Category"
								editType="dropdownedit"
								textAlign="Left"
								width="200"
							/>
							<ColumnDirective
								field="productname"
								headerText="Service/Projects"
								textAlign="Left"
								width="200"
							/>
							<ColumnDirective
								field="description"
								headerText="Description"
								textAlign="Left"
								width="200"
							/>
							<ColumnDirective
								field="status"
								headerText="Status"
								editType="dropdownedit"
								textAlign="Left"
								width="120"
							/>
							<ColumnDirective
								field="statusdate"
								headerText="Date"
								type="date"
								editType="datepickeredit"
								format="MM/dd/yyy"
								textAlign="Right"
								width="140"
							/>
						</ColumnsDirective>
						<Inject services={[Selection, Edit, Filter, Page, Toolbar]} />
					</GridComponent>
				</div>
			</div>
		);
};

export default Products;
