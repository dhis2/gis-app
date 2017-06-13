import React from 'react';
import PropTypes from 'prop-types';
import LegendItem from './LegendItem';
import './Legend.css';

const Legend = ({ description, unit, items, source, sourceUrl, attribution }) => (
    <dl className='Legend'>
        {description  &&
            <div className='Legend-description'>{description}</div>
        }
        {unit && items &&
            <div className='Legend-unit'>{unit}</div>
        }
        {items && items.map((item, index) => (
            <LegendItem
                {...item}
                key={`item-${index}`}
            />
        ))}
        {source && (
            <div className='Legend-source'>
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
    description: PropTypes.string,
    unit: PropTypes.string,
    items: PropTypes.array,
    source: PropTypes.string,
    sourceUrl: PropTypes.string,
};

export default Legend;
