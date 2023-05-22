import { range } from '@roenlie/mimic-core/array';
import { domId } from '@roenlie/mimic-core/dom';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ListTemplateConfig } from './template-list-element.js';


export interface User {
	id: string;
	username: string;
	email: string;
	firstname: string;
	middlename: string;
	lastname: string;
	title: string;
	shift: string;
	department: string;
	company: string;
}

export const newUserEntity = (): User => {
	return {
		id:         domId(),
		firstname:  domId(),
		middlename: domId(),
		lastname:   domId(),
		department: domId(),
		company:    domId(),
		username:   domId(),
		email:      domId(),
		title:      domId(),
		shift:      domId(),
	};
};


@customElement('mm-template-list-demo')
export class TemplateListDemo extends LitElement {

	protected items: User[] = range(0, 5000).map(newUserEntity);

	protected templates: ListTemplateConfig<User> = {
		header: (template: TemplateResult | unknown) => html`
		<mm-header>
			${ template }
		</mm-header>
		`,
		headerField: Object.entries(this.items[0]!).map(([ key, value ]) => () => html`
		<mm-field style="width: 100px">
			${ key }
		</mm-field>
		`),
		row: (row, template: TemplateResult | unknown) => html`
		<mm-row .item=${ row }>
			${ template }
		</mm-row>
		`,
		rowField: Object.entries(this.items[0]!).map(([ key, value ]) => (rowData) => html`
		<mm-field style="width: 100px">
			${ key }
		</mm-field>
		`),
	};

	public override connectedCallback(): void {
		super.connectedCallback();
	}

	protected rowTemplate(fieldTemplate: TemplateResult | unknown) {
		return html`
		<mm-row>
			${ fieldTemplate }
		</mm-row>
		`;
	}

	protected fieldTemplates = [
		(rowData: User) => html`
		<mm-field style="width: 100px;">${ rowData.firstname }</mm-field>
		`,
		(rowData: User) => html`
		<mm-field style="width: 100px;">${ rowData.department }</mm-field>
		`,
		(rowData: User) => html`
		<mm-field style="width: 100px;">${ rowData.company }</mm-field>
		`,
		(rowData: User) => html`
		<mm-field style="width: 100px;">${ rowData.firstname }</mm-field>
		`,
		(rowData: User) => html`
		<mm-field style="width: 100px;">${ rowData.department }</mm-field>
		`,
		(rowData: User) => html`
		<mm-field style="width: 100px;">${ rowData.company }</mm-field>
		`,
		(rowData: User) => html`
		<mm-field style="width: 100px;">${ rowData.firstname }</mm-field>
		`,
		(rowData: User) => html`
		<mm-field style="width: 100px;">${ rowData.department }</mm-field>
		`,
		(rowData: User) => html`
		<mm-field style="width: 100px;">${ rowData.company }</mm-field>
		`,
	];

	public override render() {
		return html`
		<mm-template-list
			.items=${ this.items }
			.templates=${ this.templates }
			.rowTemplate=${ this.rowTemplate }
			.fieldTemplates=${ this.fieldTemplates }
		></mm-template-list>
		`;
	}

	public static override styles = [
		css`
		:host {
			display: flex;
			height: 450px;
			border: 2px solid var(--outline-variant);
		}
	`,
	];

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-list-demo': TemplateListDemo;
	}
}
