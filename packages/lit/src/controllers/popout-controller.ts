import { autoUpdate, computePosition, flip, shift } from '@floating-ui/dom';
import { type ReactiveController } from 'lit';

import type { LitHost } from '../types/lit.js';


export class PopoutController implements ReactiveController {

	constructor(protected options: {
		host: LitHost,
		reference: () => HTMLElement | undefined | null,
		floating: () => HTMLElement | undefined | null,
	}) {
		options.host.addController(this);
	}

	//#region lifecycle
	public hostConnected() {
		this.options.host.updateComplete.then(() => {
			requestAnimationFrame(() => this.startPositioner());
		});
	}

	public hostDisconnected() {
		this.stopPositioner();
	}
	//#endregion


	//#region logic
	protected positionerCleanup: ReturnType<typeof autoUpdate> | undefined;

	public startPositioner() {
		this.stopPositioner();

		const reference = this.options.reference();
		const floating = this.options.floating();

		if (!reference || !floating)
			return;

		this.positionerCleanup = autoUpdate(
			reference,
			floating,
			this.updatePositioner.bind(this),
		);
	}

	public stopPositioner() {
		this.positionerCleanup?.();
		this.positionerCleanup &&= undefined;
	}

	protected async updatePositioner() {
		const reference = this.options.reference();
		const floating = this.options.floating();

		if (!reference || !floating)
			return;

		await computePosition(
			reference,
			floating,
			{
				placement:  'bottom-start',
				middleware: [
					flip(),
					shift(),
				],
				strategy: 'fixed',
			},
		).then(({ x, y, strategy }) => {
			const style = {
				position: strategy,
				left:     `${ x }px`,
				top:      `${ y }px`,
			};

			Object.assign(floating.style, style);
		});
	}
	//#endregion

}
