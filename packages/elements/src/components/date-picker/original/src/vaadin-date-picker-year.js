/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { css, html, LitElement } from 'lit';

/**
 * An element used internally by `<vaadin-date-picker>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @private
 */
//export class DatePickerYear extends LitElement {
export class DatePickerYear extends ThemableMixin(LitElement) {

	static is = 'vaadin-date-picker-year';
	static properties = {
		year: undefined,
		selectedDate: undefined,
	};

	update(props) {
		super.update(props);

		if (props.has('year') || props.has('selectedDate')) {
			this.toggleAttribute('selected', this.selectedDate && this.selectedDate.getFullYear() === parseInt(this.year ?? '0'));
			this.toggleAttribute('current', parseInt(this.year ?? '0') === new Date().getFullYear());
		}
	}

	render() {
		return html`
		<div part="year-number">${this.year}</div>
		<div part="year-separator" aria-hidden="true"></div>
		`;
	}


	static styles = [
		css`
		:host {
			display: block;
			height: 100%;
		}
		`,
	];

}

customElements.define(DatePickerYear.is, DatePickerYear);
