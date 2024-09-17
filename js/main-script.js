const ready = callback => {
  if (document.readyState !== "loading") callback();else document.addEventListener("DOMContentLoaded", callback);
};
class Site {
  /**
   * Функция инициализации слайдера Splide
   * @param {String|Object} slider Селектор или объект слайдера 
   * @param {*} options Опции для слайдера
   * @param {*} syncSlider Слайдер для синхронизации
   * @returns {Object} Splide слайдер
   */
  static initSplide(slider, options, syncSlider = null) {
    if (typeof slider === "string") slider = document.querySelector(slider);
    if (!slider) return;
    slider = new Splide(slider, options);
    if (syncSlider) slider.sync(syncSlider);
    return slider;
  }
  static initAccordeon() {
    let parents = document.querySelectorAll("*[data-accordion-parent]");
    if (parents) {
      parents.forEach(parent => {
        let togglers = parent.querySelectorAll("*[data-accordion-toggler]");
        togglers.forEach(toggler => {
          let card = toggler.closest(`${toggler.dataset.accordionToggler}`);
          let body = card.querySelector("*[data-accordion-body]");
          if (toggler.classList.contains("--is_initialized")) return;
          toggler.classList.add("--is_initialized");
          toggler.addEventListener("click", e => {
            e.preventDefault();
            if (!card.classList.contains("--is_active")) {
              card.classList.add("--is_active");
              toggler.classList.add("--is_active");
              body.style.maxHeight = `${body.scrollHeight}px`;
            } else {
              card.classList.remove("--is_active");
              toggler.classList.remove("--is_active");
              body.style.maxHeight = `${body.scrollHeight}px`;
              setTimeout(() => {
                body.style.maxHeight = '0px';
              }, 1);
            }
          });
          body.addEventListener("transitionend", e => {
            if (card.classList.contains("--is_active")) {
              body.style.maxHeight = 'none';
            }
          });
        });
      });
    }
  }
  static initCounter() {
    let buttons = document.querySelectorAll('*[data-counter="plus"],*[data-counter="minus"]');
    let result = document.querySelector('*[data-counter="result"]');
    if (!buttons) return;
    buttons.forEach(button => {
      let input = button.parentElement.querySelector('input[data-counter="field"');
      let currency = input.dataset.counterCurrency;
      let step = +input.dataset.counterStep * 1 ? +input.dataset.counterStep : 1000;
      button.addEventListener("click", e => {
        if (!input) return;
        let action = button.dataset.counter;
        input.value = isNaN(+input.value * 1) ? 0 : input.value;
        switch (action) {
          case "minus":
            input.value = `${+input.value - step <= 0 ? step : +input.value - step}`;
            break;
          case "plus":
            input.value = `${+input.value + step}`;
            break;
        }
        if (result) {
          result.textContent = `${input.value} ${currency}`;
        }
        if ("createEvent" in document) {
          let inputEvent = document.createEvent("HTMLEvents");
          inputEvent.initEvent("input", false, true);
          input.dispatchEvent(inputEvent);
        } else {
          input.fireEvent("input");
        }
      });
    });
  }
  static initCredit(noUiMonth) {
    let limit = {
      20000: 10,
      28000: 8,
      30000: 6,
      40000: 4
    };
    let counterCredit = document.querySelector('.counter__input');
    if (!counterCredit) return;
    if (!noUiMonth) return;
    counterCredit.addEventListener('input', e => {
      let limitAtValue = limit[+counterCredit.value] ? limit[+counterCredit.value] : noUiMonth.noUiSlider.get();
      noUiMonth.noUiSlider.set([limitAtValue, null]);
    });
  }
  static initMobileNav() {
    let navBtn = document.querySelector('.nav__toggler');
    if (!navBtn) return;
    let controls = document.querySelector(`#${navBtn.getAttribute('aria-controls')}`);
    if (!controls) return;
    navBtn.addEventListener('click', e => {
      let expanded = navBtn.getAttribute('aria-expanded') === 'true' || false;
      navBtn.setAttribute('aria-expanded', !expanded);
      navBtn.classList.toggle('nav__toggler--open');
      controls.classList.toggle('nav--open');
      document.documentElement.classList.toggle('nav--open');
    });
  }
}
ready(() => {
  Site.initAccordeon();
  Site.initCounter();
  Site.initMobileNav();

  // NoUiSlider
  let noUiContribution = document.getElementById('noui_credit');
  if (noUiContribution) {
    let contributionInput = document.getElementById('noui_credit_input');
    contributionInput.readOnly = true;
    noUiSlider.create(noUiContribution, {
      start: 4000000,
      connect: [true, false],
      range: {
        min: 0,
        max: 6363000
      },
      format: {
        from: function (formattedValue) {
          return Number(formattedValue);
        },
        to: function (numericValue) {
          return Math.round(numericValue);
        }
      }
    });
    noUiContribution.noUiSlider.on('update', function (values, handle) {
      contributionInput.value = `${(+values[handle]).toLocaleString()} ₽`;
    });
  }
  let noUiMonth = document.getElementById('noui_month');
  if (noUiMonth) {
    let monthInput = document.getElementById('noui_month_input');
    monthInput.readOnly = true;
    noUiSlider.create(noUiMonth, {
      start: 6,
      connect: [true, false],
      range: {
        min: 0,
        max: 96
      },
      format: {
        from: function (formattedValue) {
          return Number(formattedValue);
        },
        to: function (numericValue) {
          return Math.round(numericValue);
        }
      }
    });
    noUiMonth.noUiSlider.on('update', function (values, handle) {
      monthInput.value = `${(+values[handle]).toLocaleString()} мес.`;
    });
  }
  Site.initCredit(noUiMonth);

  // Sliders

  let comparisonSlider = Site.initSplide('.comparison__splide', {
    rewind: true,
    pagination: false,
    gap: 12,
    perPage: 4,
    perMove: 1,
    drag: false,
    breakpoints: {
      1279: {
        perPage: 3
      },
      1023: {
        perPage: 2
      },
      767: {
        fixedWidth: '300px',
        drag: true,
        arrows: false
      }
    }
  }, null);
  if (comparisonSlider) {
    comparisonSlider.mount();
  }
  let comparisonParamSliders = document.querySelectorAll('.comparison__param-splide');
  if (comparisonParamSliders) {
    comparisonParamSliders.forEach(slider => {
      slider = Site.initSplide(`#${slider.getAttribute('id')}`, {
        rewind: true,
        pagination: false,
        arrows: false,
        drag: false,
        gap: 12,
        perPage: 4,
        perMove: 1,
        breakpoints: {
          1279: {
            perPage: 3
          },
          1023: {
            perPage: 2
          },
          767: {
            fixedWidth: '300px'
          }
        }
      }, null);
      if (slider) {
        slider.mount();
        comparisonSlider.on('active', function (slide) {
          let index = comparisonSlider.isClone ? comparisonSlider.slideIndex : comparisonSlider.index;
          slider.go(index);
        });
      }
    });
  }
});