import { isPromise } from '@roenlie/mimic-core/async';
import type { Ctor } from '@roenlie/mimic-core/types';
import { adoptStyles, type CSSResultOrNative, nothing, type PropertyValues } from 'lit';

import type { Adapter } from '../adapter/adapter.js';
import { ContainerModule } from '../container/container.js';
import { ContainerLoader } from '../container/loader.js';
import { AegisElement } from './aegis-element.js';


type AdapterCtor = Ctor<typeof Adapter> | (abstract new(...args: any) => Adapter);
type Modules =
	| ContainerModule
	| ContainerModule[]
	| Promise<ContainerModule | ContainerModule[]>
	| (() => ContainerModule | ContainerModule[] | Promise<ContainerModule> | Promise<ContainerModule[]>);


export let currentAdapterElement: AegisComponent | undefined;


export abstract class AegisComponent extends AegisElement {

	/** Resolves after the containerConnectedCallback has been resolved. */
	public containerConnected: Promise<void> & { finished?: true; };

	protected readonly adapterId: string | symbol = this.localName;
	protected readonly adapterCtor: Ctor<typeof Adapter>;
	protected readonly modules: Modules;
	protected adapter: Adapter;

	constructor(adapterCtor: AdapterCtor, modules: Modules = []) {
		super();

		this.adapterCtor = adapterCtor as Ctor<typeof Adapter>;
		this.modules = modules;
	}

	public override connectedCallback(): void {
		super.connectedCallback();

		(this.containerConnected = this.containerConnectedCallback())
			.then(() => this.containerConnected.finished = true);
	}

	public async containerConnectedCallback() {
		const base = this.constructor as typeof AegisComponent;

		let modules: Modules = this.modules;
		if (isPromise(modules))
			modules = await modules;
		else if (typeof modules === 'function')
			modules = await modules();

		if (!Array.isArray(modules))
			modules = [ modules ];

		ContainerLoader.unload(...modules);
		ContainerLoader.load(...modules);

		// Binds current element to be picked up by adapter injector.
		currentAdapterElement = this as any;

		// If there is a supplied adapter and no adapter currently bound.
		// resolve the supplied adapter through the container.
		if (!ContainerLoader.isBound(this.adapterId) && this.adapterCtor)
			this.adapter = ContainerLoader.resolve<Adapter>(this.adapterCtor);
		else
			this.adapter = ContainerLoader.get<Adapter>(this.adapterId);

		// Unbind current element so no other adapters get this element.
		currentAdapterElement = undefined;

		const adapterBase = this.adapter.constructor as typeof Adapter;
		if (adapterBase.styles) {
			const extraStyles = (Array.isArray(adapterBase.styles)
				? adapterBase.styles : [ adapterBase.styles ]) as CSSResultOrNative[];

			adoptStyles(
				this.shadowRoot!,
				[ ...base.elementStyles, ...extraStyles ],
			);
		}
		else {
			adoptStyles(
				this.shadowRoot!,
				base.elementStyles,
			);
		}

		this.adapter?.connectedCallback?.();
	}

	protected override scheduleUpdate(): void | Promise<unknown> {
		if (!this.containerConnected.finished) {
			return this.containerConnected.then(() => {
				this.isConnected && super.scheduleUpdate();
			});
		}

		super.scheduleUpdate();
	}


	public override afterConnectedCallback(): void {
		this.adapter?.afterConnectedCallback?.();
	}

	public override disconnectedCallback(): void {
		// Called before super to allow code to run prior to element being removed.
		this.adapter?.disconnectedCallback?.();
		super.disconnectedCallback();
	}

	protected override firstUpdated(changedProps: PropertyValues): void {
		super.firstUpdated(changedProps);
		this.adapter.firstUpdated?.(changedProps);
	}

	protected override willUpdate(changedProps: PropertyValues): void {
		super.willUpdate(changedProps);
		this.adapter?.willUpdate?.(changedProps);
	}

	protected override update(changedProps: PropertyValues): void {
		super.update(changedProps);
		this.adapter?.update?.(changedProps);
	}

	protected override updated(changedProps: PropertyValues): void {
		super.updated(changedProps);
		this.adapter?.updated?.(changedProps);
	}

	protected override render(): unknown {
		return this.adapter.render?.() ?? nothing;
	}

}
