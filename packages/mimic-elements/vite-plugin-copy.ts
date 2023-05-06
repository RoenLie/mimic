import rCopy, { type CopyOptions } from 'rollup-plugin-copy';
import { Plugin } from 'vite';

const rrCopy = rCopy as unknown as typeof rCopy.default;

export const copy = (options?: CopyOptions) => rrCopy(options) as Plugin;
