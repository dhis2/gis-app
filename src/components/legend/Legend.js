import React from 'react';
import LegendItem from './LegendItem';

const styles = {
    padding: '0 15px 20px'
};

export default function Legend() {
    return (
        <div style={styles}>
            <p>Precipitation collected from satellite and weather stations on the ground.</p>

            <dl>
                <LegendItem color="#eff3ff" name="0-20" />
                <LegendItem color="#c6dbef" name="20-40" />
                <LegendItem color="#9ecae1" name="40-60" />
                <LegendItem color="#6baed6" name="60-80" />
                <LegendItem color="#3182bd" name="80-100" />
                <LegendItem color="#08519c" name="> 100" />
            </dl>
        </div>
    );
}
