import IMask from 'imask';

// Для MODX
import Iodine from '@caneara/iodine';

// Временный полифил для scroll-timeline анимаций.
// У npm лежит старая версия пакета с багом, новый пакет только на гитхабе, но там нет билда, поэтому он лежит тут локально.
// Свои задачи он выполняет, ждем полной поддержки в браузерах.
import { ScrollTimeline } from './scroll-timeline.js';