import './core.js';

import { createPromiseResolver } from '@roenlie/mimic-core/async';
import { RecordOf } from '@roenlie/mimic-core/types';
import { LitElement } from 'lit';

import { $ElementScope, $InjectProps } from './constants.js';
import { getContainer } from './container.js';
import { ElementScope, PropMetadata } from './types.js';


export class InjectableElement extends LitElement {

	public static tagName = '';
	public static loadingTemplate = '';

	#injectionComplete?: Promise<any>;
	protected get injectionComplete() { return this.#injectionComplete; }
	protected __upgradeObserver = new MutationObserver(() => {
		const elements = [ ...this.shadowRoot?.querySelectorAll('*') ?? [] ].filter(el => el.tagName.includes('-'));
		elements.forEach(async element => {
			const tagname = element.tagName.toLowerCase();
			if (customElements.exists(tagname))
				return;

			if (!element.hasAttribute('awaiting-upgrade')) {
				element.setAttribute('awaiting-upgrade', '');

				element.innerHTML = InjectableElement.loadingTemplate;

				customElements.whenDefined(tagname).then(() => {
					element.removeAttribute('awaiting-upgrade');
				});
			}
		});
	});

	constructor() {
		super();

		const [ injPromise, injResolve ] = createPromiseResolver();
		this.#injectionComplete = injPromise;

		const elementScope: ElementScope | undefined = Reflect
			.getMetadata($ElementScope, this);

		const container = getContainer(elementScope);

		const me: RecordOf<LitElement> = this as any;
		const injectionPromises: Promise<any>[] = [];

		const propMetadata: PropMetadata | undefined = Reflect
			.getMetadata($InjectProps, this);

		propMetadata?.forEach((metadata, property) => {
			try {
				if (metadata.async) {
					me[property] = container.getAsync(metadata.identifier)
						.then(value => me[property] = value);

					injectionPromises.push(me[property]);
				}
				else {
					me[property] = container.get(metadata.identifier);
				}
			}
			catch (error) {
				throw new Error(error as string, {
					cause: this.tagName,
				});
			}
		});

		Promise.all(injectionPromises).then(() => {
			injectionPromises.length = 0;
			injResolve(true);
			this.injectionCallback();
		});
	}

	public override connectedCallback() {
		super.connectedCallback();
		this.__upgradeObserver.observe(this.renderRoot, { childList: true, subtree: true });
	}

	public override disconnectedCallback() {
		super.disconnectedCallback();
		this.__upgradeObserver.disconnect();
	}

	/** Called after all async injections have been resolved.
	 * Only happens once, as its triggered through the elements constructor.
	*/
	protected injectionCallback() { }

	protected override async scheduleUpdate() {
		/* Ensure that async bindings have been resolved before rendering. */
		if (this.injectionComplete) {
			await this.injectionComplete;
			this.#injectionComplete = undefined;
		}

		super.scheduleUpdate();
	}

}
