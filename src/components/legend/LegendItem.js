import React from 'react';

const styles = {
    container: {
        clear: 'both',
        marginLeft: 25,
    },
    symbol: {
        width: 20,
        height: 20,
        float: 'left',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
    },
    name: {
        marginLeft: 30,
        lineHeight: '20px',
    }
};

export default function LegendItem(props) {
    console.log(props.image, props.color);

    if (props.image) {
        styles.symbol.backgroundImage = `url(${props.image})`;
    }

    if (props.color) {
        styles.symbol.backgroundColor = props.color;
    }

    // Components must return a single root element
    return (
        <div style={styles.container}>
            <dt style={styles.symbol}></dt>
            <dd style={styles.name}>{props.name}</dd>
        </div>
    );
}
