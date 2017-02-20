import React, { PropTypes } from 'react';

const styles = {
    root: {
        overflowY: 'scroll',
    },
    layer: {
        float: 'left',
        width: 120,
        marginLeft: 13,
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
        width: 120,
        marginTop: 4,
    },
    image: {
        position: 'absolute',
        clip: 'rect(64px, 256px, 192px, 0)', // top, right, bottom, left
        width: 120,
        top: -64,
    },
};

const Basemaps = ({ id, basemaps, onBasemapSelect }) => (
    <div style={styles.root}>
            {basemaps.map((basemap, index) => {

                const borderStyle = Object.assign({
                    outline: (basemap.id === id ? '3px solid orange' : '1px solid #999'),
                }, styles.imageContainer);

                return (
                    <div key={`basemap-${index}`} style={styles.layer} onClick={() => onBasemapSelect(id, basemap)}>
                        <div style={borderStyle}>
                            <img src={basemap.img} style={styles.image} />
                        </div>
                        <div style={styles.name}>{basemap.title}</div>
                    </div>
                )
            })}
    </div>
);

Basemaps.propTypes = {
    id: PropTypes.string.isRequired,
    basemaps: PropTypes.array, // TODO: Use arrayOf?
    onBasemapSelect: PropTypes.func.isRequired,
};

Basemaps.defaultProps = {
    basemaps: [],
};

export default Basemaps;
