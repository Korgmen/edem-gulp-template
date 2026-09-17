import { doc } from 'prettier';
import { parsers as htmlParsers, printers as htmlPrinters } from 'prettier/plugins/html';

const MARK = 'file-include:';

// Директива на отдельной строке: @@include(...), @@if (...) {, @@for (...) { и закрывающая } открытого блока
const DIRECTIVE = /^(\s*)(@@\w+\s*\(.*\)\s*\{?)\s*$/;
const BLOCK_END = /^(\s*)\}\s*$/;

// Prettier считает директиву текстом и склеивает соседние директивы в одну строку.
// Комментарий он оставляет на своей строке, поэтому до разбора директива прячется в комментарий, а при печати возвращается как есть
const hideDirectives = (text) => {
	let openBlocks = 0;
	let rawTag = null;

	return text
		.split('\n')
		.map((line) => {
			// Скобки внутри <script> и <style> к директивам отношения не имеют
			if (rawTag) {
				if (new RegExp(`</${rawTag}>`, 'i').test(line)) rawTag = null;
				return line;
			}
			const opened = line.match(/<(script|style)\b[^>]*>/i);
			if (opened && !new RegExp(`</${opened[1]}>`, 'i').test(line)) {
				rawTag = opened[1];
				return line;
			}

			const directive = line.match(DIRECTIVE);
			if (directive) {
				if (directive[2].endsWith('{')) openBlocks++;
				return `${directive[1]}<!--${MARK}${directive[2]}-->`;
			}
			if (openBlocks && BLOCK_END.test(line)) {
				openBlocks--;
				return line.replace('}', `<!--${MARK}}-->`);
			}
			return line;
		})
		.join('\n');
};

const unwrap = (value) =>
	typeof value === 'string' ? value.replace(new RegExp(`<!--${MARK}([\\s\\S]*?)-->`, 'g'), '$1') : value;

export const parsers = {
	'file-include-html': {
		...htmlParsers.html,
		astFormat: 'file-include-html',
		preprocess: (text, options) =>
			hideDirectives(htmlParsers.html.preprocess ? htmlParsers.html.preprocess(text, options) : text),
	},
};

export const printers = {
	'file-include-html': {
		...htmlPrinters.html,
		print(path, options, print) {
			const printed = htmlPrinters.html.print(path, options, print);
			const { node } = path;
			return node.kind === 'comment' && node.value.startsWith(MARK) ? doc.utils.mapDoc(printed, unwrap) : printed;
		},
	},
};
