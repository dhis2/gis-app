import React, { Component } from 'react';
import { connect } from 'react-redux'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import AddLayerDialog from '../layer/AddLayerDialog';
import { addLayer } from '../actions';


class AddLayer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onLayerSelect = this.onLayerSelect.bind(this);
    }

    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }

    onLayerSelect(layer) {
        this.handleClose();
        this.props.dispatch(addLayer(layer));
    }

    render() {
        return (
            <div>
                <FloatingActionButton onTouchTap={this.handleOpen} style={this.props.style}>
                    <ContentAddIcon />
                </FloatingActionButton>
                <AddLayerDialog
                    open={this.state.open}
                    handleClose={this.handleClose}
                    onLayerSelect={this.onLayerSelect}
                />
            </div>
        );
    }
}

AddLayer = connect()(AddLayer);

export default AddLayer;





/*
let AddLayer = ({ dispatch, style }) => {

    let onTouchTap = () => {
        console.log('show dialog');
        dispatch(addLayer({title: 'Layer'}));
    };

    return (
        <div>
            <FloatingActionButton onTouchTap={onTouchTap} style={style}>
                <ContentAddIcon />
            </FloatingActionButton>
            <AddLayerDialog open={false} />
        </div>
    )
};

AddLayer = connect()(AddLayer);

export default AddLayer;
*/