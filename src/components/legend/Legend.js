import React from 'react';
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

export default function Legend(props) {
    return (
        <dl style={props.style}>
            {props.description  &&
                <div style={styles.description}>{props.description}</div>
            }
            {props.unit  &&
                <div style={styles.unit}>{props.unit}</div>
            }
            {props.items.map((item, index) => (
                <LegendItem
                    {...item}
                    key={`item-${index}`}
                />
            ))}
            {props.source && (
                <div style={styles.source}>
                    Source:&nbsp;
                    {props.sourceUrl ? (
                        <a href={props.sourceUrl}>{props.source}</a>
                    ) : (
                        <span>{props.source}</span>
                    )}
                </div>
            )}
        </dl>
    );
}
