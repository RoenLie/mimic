import { invariant } from '@roenlie/mimic-core/validation';
import type { CSSResultGroup, CSSResultOrNative } from 'lit';

import { getCurrentRef } from '../core/component.js';


type UseStyles = (css: CSSResultOrNative | CSSResultOrNative[]) => void;


export const useStyles = ((css: CSSResultGroup) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get component instance.');

	//@ts-ignore
	cls.constructor.elementStyles = cls.constructor.finalizeStyles(css);
}) satisfies UseStyles;
