import React, {Component} from 'react';
import {SortableElement} from 'react-sortable-hoc';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionVisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import {grey600} from 'material-ui/styles/colors'; // http://www.material-ui.com/#/customization/colors

import SortableHandle from './SortableHandle';
import LayerToolbar from './LayerToolbar';
import Legend from '../legend/Legend';


class SortableLayer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: props.visible
        };

        this.onEdit = this.onEdit.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onOpacityChange = this.onOpacityChange.bind(this);
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
    }

    onEdit(evt) {
        console.log('edit layer');
    }

    onDelete(evt) {
        console.log('delete layer');
    }

    onFilter(evt) {
        console.log('filter layer');
    }

    onOpacityChange(evt, opacity) {
        console.log('opacity', opacity);
    }

    onSearch(evt) {
        console.log('search layer');
    }

    onVisibilityChange(evt) {
        console.log('visible', !this.state.visible);

        this.setState(prevState => ({
           visible: !prevState.visible
        }));
    }

    render() {
        const props = this.props;
        const legend = props.legend;

        const styles = {
            container: {
                paddingBottom: 0,
                clear: 'both',
            },
            header: {
                padding: '10px 10px 10px 40px',
                marginRight: -5,
            },
            visibility: {
                width: 34,
                height: 34,
                padding: 5,
                position: 'absolute',
                right: 44
            },
            body: {
                padding: 0
            }
        };

        return (
            <Card containerStyle={styles.container}>
                <CardHeader
                    title={props.title}
                    subtitle={props.subtitle}
                    // actAsExpander={true}  // Not able to stop event bubbling for visibility icon
                    showExpandableButton={true}
                    style={styles.header}>
                    <SortableHandle color={grey600} />
                    <IconButton
                        style={styles.visibility}
                        onClick={this.onVisibilityChange}
                        tooltip="Toggle visibility">
                        {this.state.visible ? (
                            <ActionVisibilityIcon color={grey600} />
                        ) : (
                            <ActionVisibilityOffIcon color={grey600} />
                        )}
                    </IconButton>
                </CardHeader>
                <CardText expandable={true} style={styles.body}>
                    {legend &&
                    <Legend
                        unit={legend.unit}
                        items={legend.items}
                        description={legend.description}
                    />
                    }
                    <LayerToolbar
                        opacity={props.opacity}
                        onOpacityChange={this.onOpacityChange}
                        onEdit={this.onEdit}
                        onSearch={this.onSearch}
                        onFilter={this.onFilter}
                        onDelete={this.onDelete}
                    />
                </CardText>
            </Card>
        )
    }
}

SortableLayer.propTypes= {
    id: React.PropTypes.string,
    title: React.PropTypes.string,
    subtitle: React.PropTypes.string,
    opacity: React.PropTypes.number,
    legend: React.PropTypes.object,
    visible: React.PropTypes.bool,
    expanded: React.PropTypes.bool,
};

SortableLayer.defaultProps = {
    opacity: 1,
    visible: true,
    expanded: false,
};

export default SortableElement(SortableLayer);
