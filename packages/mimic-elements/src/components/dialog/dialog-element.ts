import { TrackedPromise } from '@roenlie/mimic-core';
import { sharedStyles } from '@roenlie/mimic-lit';
import { css, CSSResult, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';


@customElement('mm-dialog')
export class DialogElement extends LitElement {

	@property({ type: Boolean }) public modal?: boolean;
	@query('#dialog') public innerDialog?: HTMLDivElement;
	@query('dialog') public dialog?: HTMLDialogElement;
	@query('input') public input?: HTMLInputElement;
	@state() protected config?: {
		render: () => unknown;
		style: CSSResult;
	};

	public inprogress = TrackedPromise.resolve();

	protected override updated(props: PropertyValues) {
		super.updated(props);

		if (props.has('config')) {
			if (!this.dialog?.open) {
				this.modal
					? this.dialog?.showModal()
					: this.dialog?.show();
			}
		}
	}

	public createConfig<T extends(dialog: DialogElement) => (Promise<any> | any)>(stateCreator: T) {
		this.inprogress = new TrackedPromise(() => {});

		return {
			actions: <TActions extends (dialog: DialogElement, state: Awaited<ReturnType<T>>) => any>(
				actionCreator: TActions,
			) => {
				return {
					template: async (
						templateCreator: {
							initialize?: (
								dialog: DialogElement,
								state: Awaited<ReturnType<T>>,
								actions: ReturnType<TActions>
							) => (Promise<any> | any);
							afterConnected?: (
								dialog: DialogElement,
								state: Awaited<ReturnType<T>>,
								actions: ReturnType<TActions>
							) => void;
							render: (
								dialog: DialogElement,
								state: Awaited<ReturnType<T>>,
								actions: ReturnType<TActions>
								) => unknown,
							style?: CSSResult
						},
					) => {
						const awaitedState = await stateCreator(this) ?? {};
						const state = new Proxy<Awaited<ReturnType<T>>>(
							awaitedState, {
								set: (target, p, newValue) => {
									const oldValue = target[p];
									if (oldValue !== newValue) {
										target[p] = newValue;
										this.requestUpdate();

										return true;
									}

									return true;
								},
							},
						);

						const actions = actionCreator(this, state) ?? {};

						await templateCreator.initialize?.(this, state, actions);

						const render = () => templateCreator.render(this, state, actions);
						const style = templateCreator.style;

						this.config = {
							render,
							style: style ?? css``,
						};
						this.requestUpdate();

						await this.updateComplete;

						templateCreator.afterConnected?.(this, state, actions);
					},
				};
			},
		};
	}

	public close(returnValue?: string | undefined) {
		this.dialog?.close(returnValue);
		this.inprogress.resolve(returnValue);
	}

	protected handleClose(ev?: CloseEvent) {
		const event = new CloseEvent('close', { ...ev });
		this.dispatchEvent(event);

		this.remove();
	}

	protected handleMousedown(ev: PointerEvent) {
		const path = ev.composedPath() as HTMLElement[];

		if (!path.some(el => el === this.innerDialog))
			return this.dialog!.close();
	}

	protected override render() {
		return html`
		<style>${ this.config?.style }</style>

		<dialog part="dialog"
			class="base"
			@close=${ (ev: CloseEvent) => this.handleClose(ev) }
			@mousedown=${ this.handleMousedown }
		>
			<div id="dialog" class="dialog host">
				${ this.config?.render() }
			</div>
		</dialog>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			display: contents;
			--mm-dialog-color: var(--on-surface);
			--mm-dialog-background-color: var(--surface);
			--mm-dialog-border-color: var(--outline-decoration-secondary-gradient);
		}
		.base {
			padding: 0px;
			overflow: hidden;
			background: transparent;
			border: none;
		}
		:where(.dialog) {
			display: grid;
			grid-auto-rows: max-content;
			height: 100%;
			gap: 8px;
			padding: 6px;
			border: 2px solid var(--mm-dialog-border-color);
			border-radius: 16px;
			color: var(--mm-dialog-color);
			background-color: var(--mm-dialog-background-color);
		}
		`,
	];

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-dialog': DialogElement;
	}
}
