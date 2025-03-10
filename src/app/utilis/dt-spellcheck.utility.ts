import {INDIAN_NAMES, LATIN_NAMES, SPECIAL_WORDS} from '../constants';

/**
 * @author Ivan Misericordia
 */
export class DtSpellcheckUtility {
  public static getAllAllowedNames(): string[] {
    return [...LATIN_NAMES, ...INDIAN_NAMES];
  }

  public static getAllAllowedWords(): string {
    return [...this.getAllAllowedNames(), ...SPECIAL_WORDS].join(',');
  }
}
