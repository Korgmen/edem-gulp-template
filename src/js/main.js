import { initModules } from './modules/index.js';
import './modules/custom.js';

// Скрипт подключён как type="module", поэтому выполняется после разбора разметки
initModules();
