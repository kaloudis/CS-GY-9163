import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SearchForm from './SearchForm';
import { Grid, Row, Col } from 'react-flexbox-grid';

export default class AppHeader extends PureComponent {
    render() {
        const { searchDocuments, toggleUploadSection, showUpload } = this.props;
        return(
            <header className="App-header">
                <Grid fluid>
                    <Row>
                        <Col xs={12} md={8}>
                            <SearchForm searchDocuments={(searchterm) => searchDocuments(searchterm)} />
                        </Col>
                        <Col xs={12} md={2}>
                            {}
                        </Col>
                        <Col xs={12} md={2}>
                            <div className="upload-button" onClick={() => toggleUploadSection()}>
                                {showUpload ? 'Hide Form' : 'Upload'}
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </header>
        )
    }
}

AppHeader.propTypes = {
    searchDocuments: PropTypes.func.isRequired,
    toggleUploadSection: PropTypes.func.isRequired,
    showUpload: PropTypes.bool
};