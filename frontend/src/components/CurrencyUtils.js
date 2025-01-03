const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    INR: "₹",
    AUD: "A$",
    CAD: "C$",
    CHF: "CHF",
};

export const getCurrencySymbol = (currencyCode) => {
    return currencySymbols[currencyCode] || currencyCode; // Devuelve el código si no hay símbolo disponible
};
