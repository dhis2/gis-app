
// TODO: Add support for counts in each class?
export const getNumericLegendItems = (bins, colors, radius) => {
    const items = [];

    for (let i = 0, item; i < bins.length - 1; i++) {
        items.push({
            name: `${bins[i]} - ${bins[i + 1]}`,
            color: colors[i],
            radius,
        });
    }

    return items;
};


// TODO: Add support for counts in each class?
export const getCategoryLegendItems = (options, radius) =>
    Object.keys(options).map(option => ({
        name: option,
        color: options[option],
        radius: radius,
    }));
