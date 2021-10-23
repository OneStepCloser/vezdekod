import { OctaveNumber } from './components/octave/types';
import {NOTE} from './components/key/types';

export const keyboardKeyMap: Record<OctaveNumber, Partial<Record<NOTE, string>>> = {
    3: {
        [NOTE.C]: 'q',
        [NOTE.D]: 'w',
        [NOTE.E]: 'e',
        [NOTE.F]: 'r',
        [NOTE.G]: 't',
        [NOTE.A]: 'y',
        [NOTE.B]: 'u',
        [NOTE.D_B]: '2',
        [NOTE.E_B]: '3',
        [NOTE.G_B]: '5',
        [NOTE.B_B]: '6',
        [NOTE.A_B]: '7',
    },
    4: {
        [NOTE.C]: 'i',
        [NOTE.D]: 'o',
        [NOTE.E]: 'p',
        [NOTE.F]: '[',
        [NOTE.G]: ']',
        [NOTE.A]: 'y',
        [NOTE.B]: 'u',
        [NOTE.D_B]: '9',
        [NOTE.E_B]: '0',
        [NOTE.G_B]: '=',
    }
}
