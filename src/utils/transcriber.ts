import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const geoip = require('geoip-lite');

interface Currency {
    code: string;
    currency: {
        symbol: string,
    };
    language: {
        code: string,
    };
}

// @ts-expect-error It will assign replace_fr on string. It doesn't matter if it doesn't exist already.
String.prototype.replace_fr = function (target: string, replacement: string): string {
    const pattern = new RegExp(`\\b${target}\\b(?=(?:(?:[^"]*"){2})*[^"]*$)`, 'g');
    
    return this.replace(pattern, replacement);
}

const rightsideCurrencies = [
    "€", // Euro
    "£", // British Pound
    "CHF", // Swiss Franc
    "kr", // Danish Krone, Norwegian Krone, Swedish Krona
    "zł", // Polish Zloty
    "Ft", // Hungarian Forint
    "Kč", // Czech Koruna
    "kn", // Croatian Kuna
    "RSD", // Serbian Dinar
    "лв", // Bulgarian Lev
    "lei", // Romanian Leu
    "₽", // Russian Ruble
    "₺", // Turkish Lira
    "₴" // Ukrainian Hryvnia
];   

// @ts-expect-error It will assign replace_fr on string. It doesn't matter if it doesn't exist already.
String.prototype.replace_currency = function (currency: string): string {
    const pattern = new RegExp(`${rightsideCurrencies.includes(currency) ? "{}" + currency : currency + "{}"}`, 'g');

    return this.replace(pattern, "${}");
}

export async function get_currency(currencies: Currency[]) {
    const { country } = await get_country();
    const currency = currencies.find((el: Currency) => el.code === country)

    return currency.currency.symbol;
}

async function get_country() {
    const response = await axios.get('https://api64.ipify.org?format=json');
    const ip = response.data.ip;
    const geo = await geoip.lookup(ip);

    return geo;
}

export function transcribe(code: string, currency: string) {
    return code
        // @ts-expect-error replace_fr is assigned earlier in the code.
        //.replace_fr(";", '!')
        .replace_fr("!", '!')
        //.replace_fr("rn", ';')
        .replace_fr("end", ';')
        //.replace_fr("be", '=')
        .replace_fr("be", '=')
        //.replace_fr("lit", 'let')
        .replace_fr("let", 'let')
        .replace_fr("const", 'const')
        .replace_fr("say", 'println')
        .replace_fr("if", 'if')
        .replace_fr("fake", 'null')
        .replace_fr("else", 'else')
        .replace_fr("not", '!=')
        .replace_fr("is", '==')
        .replace_fr("and", '&&')
        .replace_fr("dont_care", '|')
        .replace_fr("bruh", 'fn')
        .replace_fr("calc", 'math')
        .replace_fr("for", 'for')
        .replace_fr("<", '<')
        .replace_fr(">", '>')
        .replace_fr("true", 'true')
        .replace_fr("false", 'false')
        .replace_fr("try", 'try')
        .replace_fr("find_out", 'catch')
        .replace_fr("clapback", 'exec')
        .replace_fr("input", 'input')
        .replace_fr("minus", "-")
        .replace_fr("plus", "+")
        .replace_fr("minusminus", "--")
        .replace_fr("plusplus", "++")
        .replace_fr("times", "*")
        .replace_fr("divided_by", "/")
        .replace_fr("bye", "exit")
        .replace_fr("wait_for", "setTimeout")
        .replace_fr("setInterval", "setInterval")
        .replace_fr("plus_equals", "+=")
        .replace_fr("minus_equals", "-=")
        .replace_fr("times_equals", "*=")
        .replace_fr("devide_equals", "/=")
        .replace_fr("then", "->")
        .replace_fr("or_not", "|")
        .replace(/: number/g, '')
        .replace(/: string/g, '')
        .replace(/: object/g, '')
        .replace(/: boolean/g, '')
        .replace_currency(currency);
}
