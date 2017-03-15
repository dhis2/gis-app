// Utils for thematic mapping

// Classify data
export function classify(features, values, options) {
    const method = options.method;
    let bounds = [];
    let colors = [];

    if (method === 1) { // predefined bounds
        bounds = options.bounds;
        colors = options.colors;

    } else if (method === 2) { // equal intervals
        for (let i = 0; i <= options.numClasses; i++) {
            bounds[i] = options.minValue + i * (options.maxValue - options.minValue) / options.numClasses;
        }
        options.bounds = bounds;

        if (!options.colors.length) { // Backward compability
            options.colors = getColorsByRgbInterpolation(options.colorLow, options.colorHigh, options.numClasses);
        }

    } else if (method === 3) { // quantiles
        const binSize = Math.round(values.length / options.numClasses);
        let binLastValPos = (binSize === 0) ? 0 : binSize;

        if (values.length > 0) {
            bounds[0] = values[0];
            for (let i = 1; i < options.numClasses; i++) {
                bounds[i] = values[binLastValPos];
                binLastValPos += binSize;

                if (binLastValPos > values.length - 1) {
                    binLastValPos = values.length - 1;
                }
            }
            bounds.push(values[values.length - 1]);
        }

        for (let j = 0; j < bounds.length; j++) {
            bounds[j] = parseFloat(bounds[j]);
        }

        options.bounds = bounds;

        if (!options.colors.length) { // Backward compability
            options.colors = getColorsByRgbInterpolation(options.colorLow, options.colorHigh, options.numClasses);
        }
    }

    if (bounds.length) {
        for (let i = 0, prop, value, classNumber; i < features.length; i++) {
            prop = features[i].properties;
            value = prop[options.indicator];
            classNumber = getClass(value, bounds);

            prop.color = options.colors[classNumber - 1];
            prop.radius = (value - options.minValue) / (options.maxValue - options.minValue) * (options.maxSize - options.minSize) + options.minSize;

            // Count features in each class
            if (!options.count[classNumber]) {
                options.count[classNumber] = 1;
            } else {
                options.count[classNumber]++;
            }
        }
    }
}

// Returns class number
export function getClass(value, bounds) {
    if (value >= bounds[0]) {
        for (let i = 1; i < bounds.length; i++) {
            if (value < bounds[i]) {
                return i;
            }
        }
        if (value === bounds[bounds.length - 1]) {
            return bounds.length - 1;
        }
    }

    return null;
};

export function getColorsByRgbInterpolation(firstColor, lastColor, nbColors) {
    const colors = [];
    const colorA = hexToRgb('#' + firstColor);
    const colorB = hexToRgb('#' + lastColor);

    if (nbColors == 1) {
        return ['#' + firstColor];
    }
    for (let i = 0; i < nbColors; i++) {
        colors.push(rgbToHex({
            r: parseInt(colorA.r + i * (colorB.r - colorA.r) / (nbColors - 1)),
            g: parseInt(colorA.g + i * (colorB.g - colorA.g) / (nbColors - 1)),
            b: parseInt(colorA.b + i * (colorB.b - colorA.b) / (nbColors - 1)),
        }));
    }
    return colors;
}

// Convert hex color to RGB
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
}

// Convert RGB color to hex
export function rgbToHex (rgb) {
    return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
}