export function numRomanToArabic(genName) {
    const romanValues = { "": 0, " ": 0, "i": 1, "v": 5, "x": 10, "L": 50, "c": 100, "d": 500, "m": 1000 };

    let arabicNumber = 0;
    for (let i = 0; i < genName.length; i++) {
        const currentValue = romanValues[genName[i]];
        if (i < genName.length - 1 && romanValues[genName[i + 1]] > currentValue) {
            arabicNumber -= currentValue;
        } else {
            arabicNumber += currentValue;
        }
    }
    return arabicNumber;
}