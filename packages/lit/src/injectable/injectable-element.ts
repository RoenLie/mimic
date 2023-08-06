import { createPromiseResolver } from '@roenlie/mimic-core/async';
import { lazyWeakmap } from '@roenlie/mimic-core/structs';
import { type RecordOf } from '@roenlie/mimic-core/types';
import { LitElement } from 'lit';

import { $ElementScope, $InjectProps } from './constants.js';
import { getComponentModules, getComponentOptions, getContainer, isModuleLoaded, loadedModules, unloadComponentModules } from './container.js';
import { injectableShim } from './core.js';
import { type ElementScope, type PropMetadata } from './types.js';


injectableShim();


export class InjectableElement extends LitElement {

	public static tagName = '';
	public static loadingTemplate = '';

	#injectionComplete?: Promise<any>;
	protected get injectionComplete() {
		return this.#injectionComplete;
	}

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

	public override connectedCallback() {
		const [ injPromise, injResolve ] = createPromiseResolver();
		this.#injectionComplete = injPromise;

		const elementScope: ElementScope | undefined = Reflect
			.getMetadata($ElementScope, this.constructor);

		const container = getContainer(elementScope);
		const modules = getComponentModules((this.constructor as typeof InjectableElement).tagName);
		modules.forEach(module => {
			if (isModuleLoaded(container, module))
				return;

			const set = lazyWeakmap(loadedModules, container, () => new WeakSet());
			set.add(module);

			container.load(module);
		});

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
				console.error('Unable to resolve:', metadata.identifier, 'in element:', this.tagName);
			}
		});

		Promise.all(injectionPromises).then(() => {
			injectionPromises.length = 0;
			injResolve(true);
			this.injectionCallback();
		});

		super.connectedCallback();
		this.__upgradeObserver.observe(this.renderRoot, { childList: true, subtree: true });
	}

	public override disconnectedCallback() {
		super.disconnectedCallback();
		this.__upgradeObserver.disconnect();
		this.#unloadModules();
	}

	/** Called after all async injections have been resolved.
	 * Only happens once, as its triggered through the elements constructor.
	*/
	protected injectionCallback() { }

	#unloadModules() {
		const options = getComponentOptions(this.tagName);
		if (options.unload) {
			const elementScope: ElementScope | undefined = Reflect
				.getMetadata($ElementScope, this.constructor);

			unloadComponentModules(this.tagName, elementScope);
		}
	}

	protected override async scheduleUpdate() {
		/* Ensure that async bindings have been resolved before rendering. */
		if (this.injectionComplete) {
			await this.injectionComplete;
			this.#injectionComplete = undefined;
		}

		super.scheduleUpdate();
	}

}
