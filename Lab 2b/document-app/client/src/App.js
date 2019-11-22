import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
import FileUpload from './components/FileUpload';
import StatsBar from './components/StatsBar';
import Panes from './components/Panes';
import AppHeader from './components/AppHeader';

class App extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            documents: [],
            totalSize: 0,
            showUpload: false,
            message: null,
            success: false
        }
    }

    fileUploadResponseHandler = (response) => {
        this.setState({ message: response.data.message, success: true });
        return this.fetchDocuments();
    }

    fileUploadErrorHandler = (err) => {
        const response = err.response;
        this.setState({ message: response.data.message, success: false });
    }

    fetchDocuments = () => {
        this.setState({
            loading: true
        });

        axios.get('/documents')
            .then(response => {
                this.setState({
                    documents: response.data.files,
                    totalSize: response.data.totalSize,
                    loading: false
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    searchDocuments = (searchterm) => {
        if (!searchterm) {
            return this.fetchDocuments();
        }

        this.setState({
            loading: true
        });

        axios.get(`/search/${searchterm}`)
            .then(response => {
                this.setState({
                    documents: response.data.files,
                    totalSize: response.data.totalSize,
                    loading: false
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    deleteDocument = (filename) => {
        this.setState({
            loading: true
        });

        axios.get(`/delete/${filename}`)
            .then(response => {
                this.fetchDocuments();
            })
            .catch(error => {
                console.log(error);
            });
    }

    componentDidMount = () => {
        this.fetchDocuments();
    }

    toggleUploadSection = () => {
        this.setState({
            showUpload: !this.state.showUpload
        });
    }

    render() {
        const { documents, totalSize, loading, showUpload, success, message } = this.state;

        return (
            <div className="App">
                <AppHeader searchDocuments={this.searchDocuments} toggleUploadSection={this.toggleUploadSection} showUpload={showUpload} />
                {loading && <LinearProgress />}
                {showUpload && <div className="container">
                    <p style={{color: success ? 'green' : 'red'}}>{message}</p>
                    <FileUpload responseHandler={(response) => this.fileUploadResponseHandler(response)} errorHandler={(err) => this.fileUploadErrorHandler(err)} />
                </div>}
                <StatsBar totalSize={totalSize} documentsCount={documents ? documents.length : 0} />
                <Panes documents={documents} deleteDocument={this.deleteDocument} />
            </div>
        );
    }
}

export default App;