import { invariant } from '@roenlie/mimic-core/validation';
import type { CSSResultGroup } from 'lit';

import { getCurrentRef } from '../core/component.js';


type UseStyles = (css: CSSResultGroup) => void;


export const useStyles = ((css: CSSResultGroup) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	const existing = cls.styles ?? [];

	cls.styles = [	existing, css ];
}) satisfies UseStyles;