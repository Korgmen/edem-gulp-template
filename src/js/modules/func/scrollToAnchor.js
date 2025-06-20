//Скролл до якоря [readme 2.6]==========
export default () => {
	try {
		addEventListener('load', () => {
			const scrollLinks = document.querySelectorAll('.js_scroll-to');
			scrollLinks.forEach(el => {
				el.addEventListener('click', (e) => {
					e.preventDefault();
					const href = el.getAttribute('href').substring(1);
					const scrollTarget = document.getElementById(href);
					const header = document.querySelector('header');
					const offsetPosition = scrollTarget.getBoundingClientRect().top - header.offsetHeight;

					window.scrollBy({
						top: offsetPosition,
						behavior: 'smooth',
					});
				});
			});
		});
	} catch (err) { console.log(err) }
}
////Скролл до якоря [readme 2.6]==========