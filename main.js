(function () {
  'use strict';

  // Год в подвале
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Липкая шапка
  var nav = document.getElementById('nav');
  var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Мобильное меню
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      menu.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // Плейсхолдеры портфолио — замените на реальные кейсы
  var WORKS = [
    { t: 'Ледяной форт', s: 'Environment concept', c: 'concept', a: '#2a3a6b', b: '#7c5cff' },
    { t: 'Наёмница Вейр', s: 'Character design', c: 'concept', a: '#6b2a3a', b: '#ff5a3c' },
    { t: 'Страж руин', s: 'Game-ready 3D, 24k tris', c: '3d', a: '#1f4740', b: '#39d98a' },
    { t: 'Модульный кит «Порт»', s: 'Environment 3D', c: '3d', a: '#243352', b: '#5c9bff' },
    { t: 'Колода «Пепел»', s: 'CCG-иллюстрации, 60 карт', c: '2d', a: '#4a2352', b: '#c05cff' },
    { t: 'Спрайты героев', s: '2D-анимация, Spine', c: '2d', a: '#523a1f', b: '#ffb03c' },
    { t: 'HUD мобильной RPG', s: 'UI-кит и 240 иконок', c: 'ui', a: '#1c2a3a', b: '#3cc9ff' },
    { t: 'Экран прокачки', s: 'UI/UX, консоль', c: 'ui', a: '#33203f', b: '#ff5ab0' },
    { t: 'Ключевой кадр', s: 'Key art для питча', c: 'concept', a: '#3a2a1f', b: '#ff8a3c' }
  ];

  var gallery = document.getElementById('gallery');
  gallery.innerHTML = WORKS.map(function (w) {
    return '<figure class="shot" data-cat="' + w.c + '" style="background:' +
      'radial-gradient(70% 90% at 25% 15%,' + w.b + '66,transparent 65%),' +
      'linear-gradient(150deg,' + w.a + ',#0d0f18)">' +
      '<figcaption><b>' + w.t + '</b><span>' + w.s + '</span></figcaption></figure>';
  }).join('');

  // Фильтр работ
  var chips = document.querySelectorAll('.chip');
  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      Array.prototype.forEach.call(chips, function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-selected', String(on));
      });
      var f = chip.dataset.filter;
      Array.prototype.forEach.call(gallery.children, function (el) {
        el.classList.toggle('is-hidden', f !== 'all' && el.dataset.cat !== f);
      });
    });
  });

  // Появление блоков при скролле
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    Array.prototype.forEach.call(items, function (el, i) {
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      io.observe(el);
    });
  } else {
    Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
  }

  // Форма: демо-обработка, бэкенда нет
  var form = document.getElementById('form');
  var note = document.getElementById('formNote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var contact = form.email.value.trim();
    var msg = form.msg.value.trim();
    if (!name || !contact || !msg) {
      note.textContent = 'Заполните имя, контакт и описание задачи.';
      note.classList.add('is-err');
      return;
    }
    note.classList.remove('is-err');
    note.textContent = 'Спасибо! Открываем почтовый клиент — отправьте письмо, и мы ответим в течение 24 часов.';
    var body = 'Имя: ' + name + '\nКонтакт: ' + contact + '\nУслуга: ' + form.type.value + '\n\n' + msg;
    window.location.href = 'mailto:hello@artforge.studio?subject=' +
      encodeURIComponent('Бриф с сайта — ' + form.type.value) + '&body=' + encodeURIComponent(body);
    form.reset();
  });
})();
