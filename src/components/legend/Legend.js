import React from 'react';
import LegendItem from './LegendItem';

const styles = {
    padding: '0 15px 20px'
};

export default function Legend(props) {
    const items = props.items || [];

    // TODO: Creae unique key below
    return (
        <dl style={styles}>
            <p>Precipitation collected from satellite and weather stations on the ground.</p>
            {items.map((item, index) =>
                <LegendItem
                    key={`item-${index}`}
                    color={item.color}
                    name={item.name}
                />
            )}
        </dl>
    );
}
