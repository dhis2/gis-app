import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionVisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import {grey600} from 'material-ui/styles/colors';

import SortableHandle from './SortableHandle';
import LayerToolbar from './LayerToolbar';
import Legend from '../legend/Legend';


export default class Layer extends Component {

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
                height: 56,
                padding: '0px 8px 0px 32px',
                marginRight: -8,
                fontSize: 10
            },
            headerText: {
                position: 'relative',
                top: '50%',
                transform: 'translateY(-50%)',
            },
            visibility: {
                width: 56,
                height: 56,
                padding: 8,
                position: 'absolute',
                right: 32
            },
            body: {
                padding: 0,
            },
            legend: {
                padding: '8px 16px 16px 32px',
                margin: 0,
            }
        };

        return (
            <Card containerStyle={styles.container} initiallyExpanded={props.expanded}>
                <CardHeader
                    title={props.title}
                    subtitle={props.subtitle}
                    // actAsExpander={true}  // Not able to stop event bubbling for visibility icon
                    showExpandableButton={true}
                    style={styles.header}
                    textStyle={styles.headerText}>
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
                            {...legend}
                            style={styles.legend}
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

Layer.propTypes= {
    id: React.PropTypes.string,
    title: React.PropTypes.string,
    subtitle: React.PropTypes.string,
    opacity: React.PropTypes.number,
    legend: React.PropTypes.object,
    visible: React.PropTypes.bool,
    expanded: React.PropTypes.bool,
};

Layer.defaultProps = {
    opacity: 1,
    visible: true,
    expanded: false,
};
