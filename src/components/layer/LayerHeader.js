import React from 'react';
import IconButton from 'material-ui/IconButton';
import ActionVisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import NavigationExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import {grey600} from 'material-ui/styles/colors'; // http://www.material-ui.com/#/customization/colors

function VerticalDragIcon(props) {
    return (
        <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
            <path fill={props.color} d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z" />
        </svg>
    );
}

const styles = {
    header: {
        backgroundColor: '#eee',
        height: 48
    },
    title: {
        display: 'inline',
        padding: 0,
        margin: 0,
        fontWeight: 500,
        fontFamily: 'Roboto, sans-serif',
        fontSize: 16,
        color: '#333',
        lineHeight: '48px',
        WebkitMarginBefore: 0,
        WebkitMarginAfter: 0,
        marginTop: -10
    },
    tools: {
        float: 'right'
    }
};

// Is visibility a prop or a state?

export default function LayerHeader(props) {
    let visibilityIcon;
    let expandIcon;

    if (props.expanded) {
        expandIcon = <NavigationExpandLessIcon color={grey600} />;
    } else {
        expandIcon = <NavigationExpandMoreIcon color={grey600} />;
    }

    if (props.visible) {
        visibilityIcon = <ActionVisibilityIcon color={grey600} />;
    } else {
        visibilityIcon = <ActionVisibilityOffIcon color={grey600} />;
    }

    return (
        <div style={styles.header}>
            <IconButton
                onClick={(event) => props.onDragClicked(event, props.value)}
                tooltip="Drag to reorder"
            >
                <VerticalDragIcon color={grey600} />
            </IconButton>

            <h2 style={styles.title}>{props.title}</h2>

            <div style={styles.tools}>
                <IconButton
                    onClick={(event) => props.onVisibilityClick(event, props.value)}
                    tooltip="Toggle visibility"
                >
                    {visibilityIcon}
                </IconButton>

                <IconButton
                    onClick={(event) => props.onExpandClick(event, props.value)}
                    tooltip="Toggle expand"
                >
                    {expandIcon}
                </IconButton>
            </div>
        </div>
    );
}
