import React from 'react';
import PropTypes from 'prop-types';

const styles = {
    root: {
        overflowY: 'hidden',
        marginLeft: 7,
    },
    layer: {
        float: 'left',
        width: 120,
        marginLeft: 16,
        cursor: 'pointer',
        boxSizing: 'border-box',
        height: 90,
    },
    name: {
        fontSize: 12,
        color: '#333',
        paddingTop: 4,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    imageContainer: {
        position: 'relative',
        height: 56,
        width: '100%',
        marginTop: 4,
        overflow: 'hidden',
    },
    image: {
        position: 'absolute',
        clip: 'rect(64px, 256px, 192px, 0)', // top, right, bottom, left
        width: '100%',
        top: -64,

    },
};

const BasemapList = ({ id, basemaps, selectBasemap }) => (
    <div style={styles.root}>
        {basemaps.map((basemap, index) => {

            const borderStyle = Object.assign({
                outline: (basemap.id === id ? '3px solid orange' : '1px solid #999'),
            }, styles.imageContainer);

            return (
                <div key={`basemap-${index}`} style={styles.layer} onClick={() => selectBasemap(basemap.id)}>
                    <div style={borderStyle}>
                        <img src={basemap.img} style={styles.image} />
                    </div>
                    <div style={styles.name}>{basemap.title}</div>
                </div>
            )
        })}
    </div>
);

BasemapList.propTypes = {
    id: PropTypes.string.isRequired,
    basemaps: PropTypes.array.isRequired,
    selectBasemap: PropTypes.func.isRequired,
};

export default BasemapList;
