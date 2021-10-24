import { KeyPressedPayload, OctaveNumber } from './components/octave/types';
import { NOTE } from './components/key/types';

export enum LETTER {
    Q = 'q',
    W = 'w',
    E = 'e',
    R = 'r',
    T = 't',
    Y = 'y',
    U = 'u',
    TWO = '2',
    THREE = '3',
    FIVE = '5',
    SIX = '6',
    SEVEN = '7',
    I = 'i',
    O = 'o',
    P = 'p',
    LEFT_BRACKET = '[',
    RIGHT_BRACKET = ']',
    NINE = '9',
    ZERO = '0',
    EQUALS = '=',
    K = 'k',
    L = 'l',
    SEMICOLON = ';',
    QUOTE = '\'',
}

export const russianToEnglishMap: Record<string, LETTER> = {
    'й': LETTER.Q,
    'ц': LETTER.W,
    'у': LETTER.E,
    'к': LETTER.R,
    'е': LETTER.T,
    'н': LETTER.Y,
    'г': LETTER.U,
    'ш': LETTER.I,
    'щ': LETTER.O,
    'з': LETTER.P,
    'х': LETTER.LEFT_BRACKET,
    'ъ': LETTER.RIGHT_BRACKET,
    'л': LETTER.K,
    'д': LETTER.L,
    'ж': LETTER.SEMICOLON,
    'э': LETTER.QUOTE,
};

export const keyToKeyboardKeyMap: Record<OctaveNumber, Partial<Record<NOTE, LETTER>>> = {
    3: {
        [NOTE.C]: LETTER.Q,
        [NOTE.D]: LETTER.W,
        [NOTE.E]: LETTER.E,
        [NOTE.F]: LETTER.R,
        [NOTE.G]: LETTER.T,
        [NOTE.A]: LETTER.Y,
        [NOTE.B]: LETTER.U,
        [NOTE.D_B]: LETTER.TWO,
        [NOTE.E_B]: LETTER.THREE,
        [NOTE.G_B]: LETTER.FIVE,
        [NOTE.A_B]: LETTER.SIX,
        [NOTE.B_B]: LETTER.SEVEN,
    },
    4: {
        [NOTE.C]: LETTER.I,
        [NOTE.D]: LETTER.O,
        [NOTE.E]: LETTER.P,
        [NOTE.F]: LETTER.LEFT_BRACKET,
        [NOTE.G]: LETTER.RIGHT_BRACKET,
        [NOTE.A]: LETTER.L,
        [NOTE.B]: LETTER.QUOTE,
        [NOTE.D_B]: LETTER.NINE,
        [NOTE.E_B]: LETTER.ZERO,
        [NOTE.G_B]: LETTER.EQUALS,
        [NOTE.A_B]: LETTER.K,
        [NOTE.B_B]: LETTER.SEMICOLON,
    }
};

export const keyboardKeyToKeyMap: Record<string, KeyPressedPayload> = Object.entries(keyToKeyboardKeyMap)
    .reduce((acc: Record<string, KeyPressedPayload>, [octaveNumber, map]) => {
        Object.entries(map).forEach(([note, letter]) => {
            acc[letter] = {
                octaveNumber: Number(octaveNumber) as OctaveNumber,
                note: note as NOTE,
            }
        });

        return acc;
    }, {});



