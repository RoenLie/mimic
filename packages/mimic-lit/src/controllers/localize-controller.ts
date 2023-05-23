import { type DefaultTranslation, FunctionParams, Localize, localizeData, type LocalizeDirection, type Translation } from '@roenlie/mimic-core/localize';
import { StringLiteral } from '@roenlie/mimic-core/types';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { until } from 'lit/directives/until.js';


/**
 * Reactive controller
 *
 * To use this controller, import the class and instantiate it as a readonly property:
 *
 * protected readonly localize = new LocalizeController({host: this});
 *
 * This will add the element to the set and make it respond to changes to
 *
 * `<html dir | lang>` and its own dir|lang properties automatically.
 *
 * `@property` dir: string;
 *
 * `@property` lang: string;
 *
 * To use a translation method, call it like this:
 *
 * ${this.localize.term('term_key_here')}
 * ${this.localize.date('2021-12-03')}
 * ${this.localize.number(1000000)}
 */
export class LocalizeController<UserTranslation extends Translation = DefaultTranslation>
	extends Localize<UserTranslation> implements ReactiveController {

	protected host: ReactiveControllerHost & HTMLElement;

	constructor(options: {
		host: ReactiveControllerHost & HTMLElement;
	}) {
		super();

		this.host = options.host;
		this.host.addController(this);
	}

	public hostConnected() {
		localizeData.connectedElements.add(this.host);
	}

	public hostDisconnected() {
		localizeData.connectedElements.delete(this.host);
	}

	/**
   * Gets the host element's directionality as determined by the `dir` attribute. The return value is transformed to
   * lowercase.
   */
	public override dir(): LocalizeDirection {
		return `${ this.host.dir || localizeData.documentDirection }`.toLowerCase();
	}

	/**
   * Gets the host element's language as determined by the `lang` attribute. The return value is transformed to
   * lowercase.
   */
	public override lang() {
		return `${ this.host.lang || localizeData.documentLanguage }`.toLowerCase();
	}

	/**
	 * Translates the requested key using the language
	 * set in in the lang attribute on the closest documentElement.
	 * @returns Until directire, that will render a temporary
	 * value until the language promise is resolved.
	 */
	public translate<K extends Extract<keyof UserTranslation, string>>(
		key: StringLiteral | K,
		options?: {
			args?: FunctionParams<UserTranslation[ K ]> | undefined;
			silent?: boolean | undefined;
		} | undefined,
	): unknown {
		return until(super.term(key, options), 'loading');
	}

}
