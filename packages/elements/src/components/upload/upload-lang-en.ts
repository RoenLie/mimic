import type { TermTupleArray } from '@roenlie/mimic-localize/core';

import type { UploadTranslation } from './upload.types.js';


export const uploadTerms: TermTupleArray<UploadTranslation> = [
	[ 'dropFiles.one',                         'Drop file here' ],
	[ 'dropFiles.many',                        'Drop files here' ],
	[ 'addFiles.one',                          'Upload File...' ],
	[ 'addFiles.many',                         'Upload Files...' ],
	[ 'error.tooManyFiles',                    'Too Many Files.' ],
	[ 'error.fileIsTooBig',                    'File is Too Big' ],
	[ 'error.incorrectFileType',               'Incorrect File Type.' ],
	[ 'uploading.status.connecting',           'Connecting...' ],
	[ 'uploading.status.stalled',              'Stalled' ],
	[ 'uploading.status.processing',           'Processing File...' ],
	[ 'uploading.status.held',                 'Queued' ],
	[ 'uploading.remainingTime.prefix',        'remaining time: ' ],
	[ 'uploading.remainingTime.unknown',       'unknown remaining time' ],
	[ 'uploading.error.serverUnavailable',     'Upload failed, please try again later' ],
	[ 'uploading.error.unexpectedServerError', 'Upload failed due to server errors' ],
	[ 'uploading.error.forbidden',             'Upload forbidden' ],
	[ 'file.retry',                            'Retry' ],
	[ 'file.start',                            'Start' ],
	[ 'file.remove',                           'Remove' ],
	[ 'units.size.0',                          'B' ],
	[ 'units.size.1',                          'kB' ],
	[ 'units.size.2',                          'MB' ],
	[ 'units.size.3',                          'GB' ],
	[ 'units.size.4',                          'TB' ],
	[ 'units.size.5',                          'PB' ],
	[ 'units.size.6',                          'EB' ],
	[ 'units.size.7',                          'ZB' ],
	[ 'units.size.8',                          'YB' ],
];
