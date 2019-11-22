import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';

export default class StatsBar extends PureComponent {
    render() {
        const { documentsCount, totalSize } = this.props;
        return(
            <Row>
                <Col xs={12} md={4}>
                    <h1>{documentsCount} documents</h1>
                </Col>
                <Col xs={12} md={5}>
                    {}
                </Col>
                <Col xs={12} md={3}>
                    <h3>Total size: {totalSize / 1000000.0} MB</h3>
                </Col>
            </Row>
        )
    }
}

StatsBar.propTypes = {
    documentsCount: PropTypes.number.isRequired,
    totalSize: PropTypes.number.isRequired
};