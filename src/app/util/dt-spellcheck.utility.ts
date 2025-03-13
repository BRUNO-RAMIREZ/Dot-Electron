/**
 * @author Lizeth Gandarillas
 */
import {INDIAN_NAMES, LATIN_NAMES, SPECIAL_WORDS} from '../constants/dt-spellcheck-allowed-words.constant';

export class DtSpellcheckUtility {

  public static getAllAllowedNames(): string[] {
    return [...LATIN_NAMES, ...INDIAN_NAMES];
  }

  public static getAllAllowedWords(): string {
    return [...this.getAllAllowedNames(), ...SPECIAL_WORDS].join(',');
  }
}
