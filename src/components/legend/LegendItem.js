import React, { PropTypes } from 'react';

const LegendItem = ({ image, color, name, range }) => {
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

    styles.symbol.backgroundImage = image ? `url(${image})` : 'none';
    styles.symbol.backgroundColor = color ? color : 'transparent';

    // Components must return a single root element
    return (
        <div style={styles.container}>
            <dt style={styles.symbol}></dt>
            <dd style={styles.name}>{name} {range}</dd>
        </div>
    );
};

LegendItem.propTypes = {
    image: PropTypes.string,
    color: PropTypes.string,
    name: PropTypes.string,
    range: PropTypes.string,
};

export default LegendItem;