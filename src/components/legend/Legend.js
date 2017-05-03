import React from 'react';
import PropTypes from 'prop-types';
import LegendItem from './LegendItem';

const styles = {
    description: {
        paddingBottom: 16,
    },
    unit: {
        marginLeft: 32,
        lineHeight: '24px',
    },
    source: {
        paddingTop: 16,
        fontSize: 12,
    },
}

const Legend = ({ style, description, unit, items, source, sourceUrl }) => (
    <dl style={style}>
        {description  &&
            <div style={styles.description}>{description}</div>
        }
        {unit &&
            <div style={styles.unit}>{unit}</div>
        }
        {items && items.map((item, index) => (
            <LegendItem
                {...item}
                key={`item-${index}`}
            />
        ))}
        {source && (
            <div style={styles.source}>
                Source:&nbsp;
                {sourceUrl ? (
                    <a href={sourceUrl}>{source}</a>
                ) : (
                    <span>{source}</span>
                )}
            </div>
        )}
    </dl>
);

Legend.propTypes = {
    style: PropTypes.object,
    description: PropTypes.string,
    unit: PropTypes.string,
    items: PropTypes.array,
    source: PropTypes.string,
    sourceUrl: PropTypes.string,
};

export default Legend;
