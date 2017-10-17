import React, { Component } from 'react';
import ColorPicker from '../d2-ui/ColorPicker';

const styles = {
    label: {
        display: 'inline-block',
        height: 24,
        lineHeight: '24px',
        verticalAlign: 'top',
    }
};

const OptionStyle = ({ id, name, color, onChange }) => (
    <div>
        <ColorPicker color={color} onChange={newColor => onChange(id, newColor)} />
        <span style={styles.label}>{name}</span>
    </div>
);

export default OptionStyle;
