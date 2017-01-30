import React from 'react';

const styles = {
    padding: '0 15px 20px'
};

export default function LegendItem(props) {
    const styles = {
        container: {
            clear: 'both'
        },
        symbol: {
            backgroundColor: props.color,
            width: 30,
            height: 30,
            float: 'left',
        },
        name: {
            lineHeight: '30px'
        }
    };

    return (
        <div style={styles.container}>
            <dt style={styles.symbol}></dt>
            <dd style={styles.name}>{props.name}</dd>
        </div>
    );
}
