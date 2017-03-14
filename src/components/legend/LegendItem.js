import React, { PropTypes } from 'react';

const LegendItem = ({ image, color, radius, name, range }) => {
    const styles = {
        container: {
            clear: 'both',
        },
        symbolContainer: {
            width: 24,
            height: 24,
            lineHeight: '24px',
            float: 'left',
            textAlign: 'center',
        },
        symbol: {
            display: 'inline-block',
            width: '100%',
            height: '100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
        },
        name: {
            marginLeft: 32,
            lineHeight: '24px',
        }
    };

    const symbol = styles.symbol;

    symbol.backgroundImage = image ? `url(${image})` : 'none';
    symbol.backgroundColor = color ? color : 'transparent';

    if (radius) {
        symbol.width = radius * 2 + 'px';
        symbol.height = radius * 2 + 'px';
        symbol.borderRadius = radius ? '50%' : '0';
    }

    // Components must return a single root element
    return (
        <div style={styles.container}>
            <dt style={styles.symbolContainer}><span style={styles.symbol}></span></dt>
            <dd style={styles.name}>{name} {range}</dd>
        </div>
    );
};

LegendItem.propTypes = {
    image: PropTypes.string,
    color: PropTypes.string,
    radius: PropTypes.number,
    name: PropTypes.string,
    range: PropTypes.string,
};

export default LegendItem;