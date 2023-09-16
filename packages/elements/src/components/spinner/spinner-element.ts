import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { tTerm } from '@roenlie/mimic-localize/directive';
import { css, html } from 'lit';


/**
 * @csspart base - The component's internal wrapper.
 *
 * @cssproperty --track-width - The width of the track.
 * @cssproperty --track-color - The color of the track.
 * @cssproperty --indicator-color - The color of the indicator.
 * @cssproperty --speed - The time it takes for the spinner to complete one animation cycle.
 */
@customElement('mm-spinner')
export class MMSpinner extends MimicElement {

	//#region properties
	//#endregion


	//#region controllers
	//#endregion


	//#region lifecycle
	//#endregion


	//#region logic
	//#endregion


	//#region template
	public override render() {
		return html`
		<svg
			part="base"
			class="spinner"
			role="progressbar"
			aria-valuetext=${ tTerm('loading') }
		>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
		`;
	}
	//#endregion


	//#region style
	public static override styles = [
		sharedStyles,
		css`
		:host {
			--track-width: 2px;
			--track-color: rgb(128 128 128 / 25%);
			--indicator-color: var(--tertiary);
			--speed: 2s;
			display: inline-flex;
			width: 1em;
			height: 1em;
		}
		.spinner {
			flex: 1 1 auto;
			height: 100%;
			width: 100%;
		}
		.spinner__track,
		.spinner__indicator {
			fill: none;
			stroke-width: var(--track-width);
			r: calc(0.5em - var(--track-width) / 2);
			cx: 0.5em;
			cy: 0.5em;
			transform-origin: 50% 50%;
		}
		.spinner__track {
			stroke: var(--track-color);
			transform-origin: 0% 0%;
			mix-blend-mode: multiply;
		}
		.spinner__indicator {
			stroke: var(--indicator-color);
			stroke-linecap: round;
			stroke-dasharray: 150% 75%;
			animation: spin var(--speed) linear infinite;
		}
		@keyframes spin {
			0% {
				transform: rotate(0deg);
				stroke-dasharray: 0.01em, 2.75em;
			}
			50% {
				transform: rotate(450deg);
				stroke-dasharray: 1.375em, 1.375em;
			}
			100% {
				transform: rotate(1080deg);
				stroke-dasharray: 0.01em, 2.75em;
			}
		}
		`,
	];
	//#endregion

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-spinner': MMSpinner;
	}
}
