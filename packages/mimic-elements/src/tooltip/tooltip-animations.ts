import { setDefaultAnimation } from '@roenlie/mimic-core/animation';


export const registerAnimations = () => {
	setDefaultAnimation('tooltip.show', {
		keyframes: [
			{ opacity: 0 },
			{ opacity: 1 },
		],
		options: { duration: 300, easing: 'ease' },
	});

	setDefaultAnimation('tooltip.hide', {
		keyframes: [
			{ opacity: 1 },
			{ opacity: 0 },
		],
		options: { duration: 0, easing: 'ease' },
	});
};
