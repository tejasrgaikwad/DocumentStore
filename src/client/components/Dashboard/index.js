import React from "react";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import DocumentList from "../DocumentList";
import FileUpload from "../FileUpload";
import UploadFiles from "../FileUpload/UploadFiles";
import PreviewDocument from '../PreviewDocument';

const Dashboard = () => {
const [value, setValue] = React.useState(0);




function setpreview (type, file) {
    console.log('type=', type);
    console.log('file=', encodeURI(file));
    // setType(type);
    // setFile(encodeURI(file));
}


function renderBody(value, setpreview)
{
    console.log('setpervie', setpreview);
    if(value===0)
    {
        return <UploadFiles />;
    }
    else if (value ===1)
    {
        return <DocumentList setpreview={setpreview}/>
    }
}
return (
	<div>
        <h3>Document store</h3>
        <Paper square>
            <Tabs
            value={value}
            textColor="primary"
            indicatorColor="primary"
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            >
            <Tab label="Upload" />
            <Tab label="Documents" />
            </Tabs>
        </Paper>
            
        <div>
            <br/>
            {renderBody(value, (type, file)=>setpreview(type, file))}
        </div>
        
	</div>
    );
};

export default Dashboard;
