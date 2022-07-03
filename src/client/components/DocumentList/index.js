import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useSelector } from 'react-redux'
import PreviewDocument from "../PreviewDocument";
import ReactHover, { Trigger, Hover } from "react-hover";

const optionsCursorTrueWithMargin = {
  followCursor: true,
  shiftX: 20,
  shiftY: 0
};
const renderPreview = (props) => (
  <PreviewDocument type={props.type} file={props.file} />
);

function LinkComponent(props) {
  const type = props.value.split(".")[1];
  const filechunks = props.value.split("/");
  
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={props.value}
    >
      {filechunks[filechunks.length-1]}  
    </a>

  );
}


const DashboardList = () => {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [ type, setType] = React.useState();
  const [ file, setFile] = React.useState();
  const count = useSelector((state) => state.documentList)

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    { field: 'Document', filter: true, cellRenderer: "LinkComponent" },
    { field: 'UploadedBy', filter: true },
    { field: 'CreatedAt', filter: true },
    { field: 'Notes', filter: true },
    { field: 'Size', filter: true },
  ]);

  function setpreview (type, file) {
    console.log('type=', type);
    console.log('file=', encodeURI(file));
    setType(type);
    setFile(encodeURI(file));
  }


  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true
  }));

  // Example of consuming Grid Event
  const cellClickedListener = useCallback(event => {
    console.log('cellClicked', event);
    setpreview(event.data.Document.split(".")[1], event.data.Document)
    
  }, []);

  // Example load data from sever
  useEffect(() => {
    fetch('/api/v1/files')
      .then(result => result.json())
      .then(rowData => { console.log('rowdata', rowData); setRowData(rowData); })
  }, []);

  // Example using Grid's API
  const buttonListener = useCallback(e => {
    gridRef.current.api.deselectAll();
  }, []);

  return (
    <div>

      {/* Example using Grid's API */}

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      Note: Click on the row to preview, click on Name to download the file.
      <div className="ag-theme-alpine" style={{ width: 700, height: 300 }}>

        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API

          rowData={rowData} // Row Data for Rows

          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties

          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection='multiple' // Options - allows click selection of rows
          frameworkComponents={{
            LinkComponent
          }}
          onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        />
      </div>
      <div>
        <br/>
        <br/>
            <div>See Preview below:</div> 

            <PreviewDocument type={type} file={file}/>
        </div>
    </div>
  );
};

export default DashboardList;
