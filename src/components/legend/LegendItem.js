import React from 'react';

export default function LegendItem(props) {
    const styles = {
        container: {
            clear: 'both',
        },
        symbol: {
            width: 24,
            height: 24,
            float: 'left',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
        },
        name: {
            marginLeft: 32,
            lineHeight: '24px',
        }
    };

    styles.symbol.backgroundImage = props.image ? `url(${props.image})` : 'none';
    styles.symbol.backgroundColor = props.color ? props.color : 'transparent';

    // Components must return a single root element
    return (
        <div style={styles.container}>
            <dt style={styles.symbol}></dt>
            <dd style={styles.name}>{props.name} {props.range}</dd>
        </div>
    );
}
