import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import ImagePane from './ImagePane';

export default class Panes extends PureComponent {
    render() {
        const { documents, deleteDocument } = this.props;
        const panes = documents ? documents.map((image, index) => {
            return (
                <Col xs={12} md={4} key={index}>
                      <ImagePane image={image} deleteDocument={deleteDocument} />
                </Col>
            );
        }) : null;

        return(
            <Grid fluid>
                <Row>
                    {panes}
                </Row>
            </Grid>
        )
    }
}

Panes.propTypes = {
    documents: PropTypes.array.isRequired,
    deleteDocument: PropTypes.func.isRequired
};