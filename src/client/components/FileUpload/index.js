import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import React, { Component } from 'react';
import { BASE_URL } from '../../constants';

class FileUpload extends Component {

    state = {

        // Initially, no file is selected
        selectedFile: null
    };

    // On file select (from the pop up)
    onFileChange = event => {

        // Update the state
        this.setState({ selectedFile: event.target.files[0] });

    };

    // On file upload (click the upload button)
    onFileUpload = () => {

        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "selectedFile",
            this.state.selectedFile);
        formData.append('user', 'tempuser');
        // Details of the uploaded file
        for (var key of formData.entries()) {
			console.log(key[0] + ', ' + key[1])
		}
        // Request made to the backend api
        // Send formData object

        fetch(
            `/api/v1/upload`,
            {
                method: 'POST',
                body: formData,
            }
        )
    };

    // File content to be displayed after
    // file upload is complete
    fileData = () => {

        if (this.state.selectedFile) {

            return (
                <div>
                    <h2>File Details:</h2>

                    <p>File Name: {this.state.selectedFile.name}</p>


                    <p>File Type: {this.state.selectedFile.type}</p>


                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>

                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Choose before Pressing the Upload button</h4>
                </div>
            );
        }
    };

    render() {

        return (
            <div>
               
                <div>
                    <input type="file" onChange={this.onFileChange} />
                    <button onClick={this.onFileUpload}>
                        Upload!
                    </button>
                </div>
                {this.fileData()}
            </div>
        );
    }
};

const mapStateToProps = state => ({
    searchSuggestions: state.posts.searchSuggestions,
    error: state.posts.error
  });
  
  const mapDispatchToProps = ({
    
  });
  

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FileUpload));
