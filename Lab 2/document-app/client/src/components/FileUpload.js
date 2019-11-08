import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default class FileUpload extends PureComponent {
    constructor(props) {
        super(props);
        this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload(ev) {
        ev.preventDefault();

        const { responseHandler, errorHandler } = this.props;
        const data = new FormData();
        data.append('image', this.uploadInput ? this.uploadInput.files[0] : null);
        data.append('filename', this.fileName ? this.fileName.value : null);

        axios.post('/upload', data)
            .then(response => responseHandler(response))
            .catch(error => errorHandler(error));
    }

    render() {
        return(
            <form onSubmit={this.handleUpload}>
                <div className="form-group">
                    <input className="form-control" name="image" ref={(ref) => { this.uploadInput = ref; }} type="file" />
                </div>

                <div className="form-group">
                    <input className="form-control" ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Optional name for the file" />
                </div>

                <button className="document-button">Upload</button>
            </form>
        )
    }
}

FileUpload.propTypes = {
    responseHandler: PropTypes.func.isRequired,
    errorHandler: PropTypes.func.isRequired
};