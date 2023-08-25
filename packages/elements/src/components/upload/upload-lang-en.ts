import { type UploadTranslation } from './upload-element.js';


export const uploadLang: UploadTranslation = {
	$code: 'en',
	$name: 'English',
	$dir:  'ltr',

	'dropFiles.one':                         'Drop file here',
	'dropFiles.many':                        'Drop files here',
	'addFiles.one':                          'Upload File...',
	'addFiles.many':                         'Upload Files...',
	'error.tooManyFiles':                    'Too Many Files.',
	'error.fileIsTooBig':                    'File is Too Big',
	'error.incorrectFileType':               'Incorrect File Type.',
	'uploading.status.connecting':           'Connecting...',
	'uploading.status.stalled':              'Stalled',
	'uploading.status.processing':           'Processing File...',
	'uploading.status.held':                 'Queued',
	'uploading.remainingTime.prefix':        'remaining time: ',
	'uploading.remainingTime.unknown':       'unknown remaining time',
	'uploading.error.serverUnavailable':     'Upload failed, please try again later',
	'uploading.error.unexpectedServerError': 'Upload failed due to server errors',
	'uploading.error.forbidden':             'Upload forbidden',
	'file.retry':                            'Retry',
	'file.start':                            'Start',
	'file.remove':                           'Remove',
	'units.size':                            (size) => ({
		0: 'B',
		1: 'kB',
		2: 'MB',
		3: 'GB',
		4: 'TB',
		5: 'PB',
		6: 'EB',
		7: 'ZB',
		8: 'YB',
	}[size] ?? 'err...'),
};


export default (async () => {
	registerTranslation(uploadLang);
})();
