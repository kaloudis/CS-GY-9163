import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';

export default class ImagePane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayImage: false
        }
    }

    toggleImage = () => {
        this.setState({
            displayImage: !this.state.displayImage
        });
    }

    render() {
        const { image, deleteDocument } = this.props;
        const { displayImage } = this.state;
        return(
            <div className="document-pane">
                <Row>
                    <div className="document-name" onClick={() => this.toggleImage()}>{image.fileName}</div>
                </Row>
                <Row className="document-controls">
                    <Col xs={12} md={4}>
                        {image.stat.size / 1000000.0} MB
                    </Col>
                    <Col xs={12} md={4}>
                        {}
                    </Col>
                    <Col xs={12} md={4}>
                        <div className="document-button" onClick={() => deleteDocument(image.fileName)}>
                            Delete
                        </div>
                    </Col>
                </Row>
                {displayImage && <Row>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: `<img alt="${image.fileName}" src="/uploaded/${image.fileName}" />`
                        }}
                    />
                </Row>}
            </div>
        )
    }
}

ImagePane.propTypes = {
    image: PropTypes.any.isRequired,
    deleteDocument: PropTypes.func.isRequired
};