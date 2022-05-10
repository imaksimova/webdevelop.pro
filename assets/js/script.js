document.addEventListener("DOMContentLoaded", () => {
  // Fixed header on scroll
  window.addEventListener("scroll", setScrollPosition);
  
  function setScrollPosition() {
    const scrollPosition = window.scrollTop || window.pageYOffset;
    const header = document.querySelector(".header");

    if (scrollPosition > 0) {
      header.classList.add("fixed")
    } else {
      header.classList.remove("fixed");
    }
  }

  // Main tabs
  const tabLinks = document.querySelectorAll(".v-tabs__div");
  const tabContent = document.querySelectorAll(".v-window-item");

  if (tabLinks.length && tabContent.length) {
    tabLinks[0].classList.add("v-tabs__item--active");
    tabLinks.forEach(function(el) {
      el.addEventListener("click", openTabs);
    });
  }

  function openTabs(el) {
    const btnTarget = el.currentTarget;
    const tabId = btnTarget.dataset.tabs;
    const contentItem = document.querySelector("#" + tabId);

    tabContent.forEach(function(el) {
      el.style.display = "none";
      el.classList.remove("custom-transition-enter-active");
    });

    tabLinks.forEach(function(el) {
      el.classList.remove("v-tabs__item--active");
    });

    contentItem.style.display = "block";
    contentItem.classList.add("custom-transition-enter-active")
    
    btnTarget.classList.add("v-tabs__item--active");
  }

  // Accordion
  const accordion = document.getElementsByClassName("accordion");

  if (accordion.length) {
    accordion[0].parentElement.classList.add("v-expansion-panel__container--active");
    accordion[0].nextElementSibling.style.maxHeight = accordion[0].nextElementSibling.scrollHeight + "px";
    for (let i = 0; i < accordion.length; i++) {
      accordion[i].addEventListener("click", function(el) {
        const panelHeader = el.currentTarget;
        const accordionItem = panelHeader.parentElement;
        const contentPanel = panelHeader.nextElementSibling;
        
        if (accordionItem.classList.contains("v-expansion-panel__container--active")) {
          accordionItem.classList.remove("v-expansion-panel__container--active");
        } else {
          accordionItem.classList.add("v-expansion-panel__container--active");
        }

        if (contentPanel.style.maxHeight) {
          contentPanel.style.maxHeight = null;
        } else {
          contentPanel.style.maxHeight = contentPanel.scrollHeight + "px";
        }
      });
    }
  }

  // Mobile menu
  const burgerBtn = document.querySelector(".humburger");

  burgerBtn.addEventListener("click", menuHundler);

  function menuHundler() {
    const burger = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mob-menu");
    if (burger.classList.contains("open")) {
      burger.classList.remove("open");  
      mobileMenu.classList.remove("is-active");
    } else {
      burger.classList.add("open");
      mobileMenu.classList.add("is-active");
    }
  }

  const buttons = document.querySelectorAll(".v-btn");
  const selectItemAnim = document.querySelectorAll(".v-list__tile");

  rippleAnimation(buttons);
  rippleAnimation(selectItemAnim);

  function rippleAnimation(el) {
    for (let i = 0; i < el.length; i++) {
      el[i].addEventListener("click", function(e) {
        let x = e.clientX - e.target.getBoundingClientRect().x;
        let y = e.clientY - e.target.getBoundingClientRect().y;
  
        let ripples = document.createElement('span');
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        el[i].appendChild(ripples);
  
        setTimeout(() => {
          ripples.remove();
        }, 1000);
      });
    }
  }

  const select = document.querySelectorAll(".site-select");
  const selectDropdownItem = document.querySelectorAll(".select-dropdown-item");

  for (let i = 0; i < select.length; i++) {
    select[i].addEventListener("click", function(e) {
      select[i].parentElement.classList.add("site-select-active");
      select[i].querySelector(".v-label").classList.add("active");
    });
  }

  for (let i = 0; i < selectDropdownItem.length; i++) {
    selectDropdownItem[i].addEventListener("click", function(e) {
      const selectActive = document.querySelector(".site-select-active");
      const selectedEl = selectActive.querySelector(".v-select__selection");
      const selectInput = selectActive.querySelector(".select-input");
      selectDropdownItem[i].classList.add("selected");
      selectedEl.innerHTML = selectDropdownItem[i].dataset.text;
      selectInput.value = selectDropdownItem[i].dataset.text;
      selectActive.classList.remove("site-select-active");
    });
  }

  document.addEventListener("click", function(e) {
    for (let i = 0; i < select.length; i++) {
      const selectInput = select[i].querySelector(".select-input");
      if(!select[i].parentElement.contains(e.target)) {
        select[i].parentElement.classList.remove("site-select-active");
        if (!selectInput.value) {
          select[i].querySelector(".v-label").classList.remove("active");
        }
      }
    }
  });

});