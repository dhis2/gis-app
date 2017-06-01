import React from 'react';
import {hcl} from 'd3-color';
import './ColorCell.css';

const ColorCell = ({ cellData }) => {
    const style = {
        backgroundColor: cellData,
        color: hcl(cellData).l < 70 ? '#fff' : '#000',
    };

    return (
        <div className='ColorCell' style={style}>
            {cellData.toLowerCase()}
        </div>
    )
};

export default ColorCell;
