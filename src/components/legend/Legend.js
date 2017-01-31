import React from 'react';
import LegendItem from './LegendItem';

const styles = {
    padding: '0 15px 20px'
};

export default function Legend(props) {
    // TODO: Creae unique key for each legend item
    const legendItems = (props.items || []).map((item, index) =>
        <LegendItem
            key={`item-${index}`}
            color={item.color}
            name={item.name}
        />
    );

    return (
        <dl style={styles}>
            {props.description  &&
                <p>{props.description}</p>
            }
            {legendItems}
        </dl>
    );
}
