// MyApp.js
import React, { Component } from 'react';
// import logger from 'logging-library';
import FileViewer from 'react-file-viewer';
// import { CustomErrorComponent } from 'custom-error';

const file = 'http://localhost:3000/api/v1/files/test2/Sai%20Luxuria%20Commercial%20Brochure_compressed%20(1).pdf'
const type = 'pdf'

const ErrorComponent = () => (
    <React.Fragment>
        <div>
            Error
        </div>
    </React.Fragment>
);

const onError = (e) => console.log(e);

const LoaderComponent = () => <img src="http://localhost:3000/loading.svg" className="loading" />;

class PreviewDocument extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log('file111111', this.props.file);
        console.log('file222222', this.props.type);
        return (
            <FileViewer
                fileType={this.props.type}
                filePath={this.props.file}
                errorComponent={<ErrorComponent />}
                onError={e => onError(e)}
                loaderComponent={<LoaderComponent />} />
        )
    }
}
export default PreviewDocument;