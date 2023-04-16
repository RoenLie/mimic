
import { Fn } from '../types/function.types.js';
import { StringLiteral } from '../types/strings.types.js';
import {
	DefaultTranslation, FunctionParams, localizeData,
	LocalizeDirection, Translation,
} from './localize.js';


export class Localize<UserTranslation extends Translation = DefaultTranslation> {

	constructor() {
		if (!localizeData.documentElementObserver.hasObservers) {
			// Watch for changes on <html lang>
			localizeData.documentElementObserver.observe(document.documentElement, {
				attributes:      true,
				attributeFilter: [ 'dir', 'lang' ],
			});
		}
	}

	public dir() {
		return localizeData.documentDirection.toLowerCase() as LocalizeDirection;
	}

	public lang() {
		return localizeData.documentLanguage.toLowerCase();
	}

	public term<K extends Extract<keyof UserTranslation, string>>(
		key: K | StringLiteral,
		options?: {
			args?: FunctionParams<UserTranslation[K]>,
			silent?: boolean,
		},
	): string {
		const code = this.lang().toLowerCase().slice(0, 2); // e.g. en
		const regionCode = this.lang().length > 2 ? this.lang().toLowerCase() : ''; // e.g. en-gb
		const primary = localizeData.translations.get(regionCode);
		const secondary = localizeData.translations.get(code);
		let term: string | Fn;

		// Look for a matching term using regionCode, code, then the fallback
		if (primary?.[key]) {
			term = primary[key]!;
		}
		else if (secondary?.[key]) {
			term = secondary[key]!;
		}
		else if (localizeData?.fallback?.[key]) {
			term = localizeData.fallback[key]!;
		}
		else {
			term = key;

			if (!options?.silent)
				console.error(`No translation found for: ${ String(key) }`);
		}

		if (typeof term === 'function')
			return term(...(options?.args ?? []));

		return term;
	}

	/** Outputs a localized date in the specified format. */
	public date(dateToFormat: Date | string, options?: Intl.DateTimeFormatOptions) {
		dateToFormat = new Date(dateToFormat);

		return new Intl.DateTimeFormat(this.lang(), options).format(dateToFormat);
	}

	/** Outputs a localized number in the specified format. */
	public number(numberToFormat: number | string, options?: Intl.NumberFormatOptions) {
		numberToFormat = Number(numberToFormat);

		return isNaN(numberToFormat) ? '' : new Intl.NumberFormat(this.lang(), options).format(numberToFormat);
	}

	public money(_numberToFormat: number | string, _options?: Intl.NumberFormatOptions) {
		throw ('Not yet implemented');
	}

	/** Outputs a localized time in relative format. */
	public relativeTime(value: number, unit: Intl.RelativeTimeFormatUnit, options?: Intl.RelativeTimeFormatOptions) {
		return new Intl.RelativeTimeFormat(this.lang(), options).format(value, unit);
	}

}
