document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector(".contact-form");
  const inputs = document.querySelectorAll(".contact-from-input");
  const hubspotForm = "";
  const hubspotPortalId = "";
  const hubspotFormId = "";
  const generalErrorText = "";
  const model = {
    name: "",
    email: "",
    jobtitle: "",
    message: ""
  };
  const errors = {
    name: "",
    email: "",
    jobtitle: "",
    message: ""
  }

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('input', updateInputValue); 
  }

  contactForm.addEventListener("submit", formSubmit);

  function updateInputValue(e) {
    const input = e.target;
    model[input.name] = input.value
  }

  function validation() {
    let flag = true;

    if(model.name === "") {
      flag = false;
      errors.name = "Field is required."
    }

    return flag;
  }

  function displayErrorMsg() {
    for (let i = 0; i < inputs.length; i++) {
      const inputName = inputs[i].name;
      const formControl = inputs[i].parentElement;
      const errorEl = formControl.querySelector(".form-control-error");
      formControl.classList.add("is-error");
      errorEl.textContent = errors[inputName];
    }  
  }

  function setHSFieldsData() {
    const data = model;
    const result = [];
    Object.entries(data).forEach(([name, value]) => {
      result.push({ name, value });
    });
    return result;
  }

  function getRequestData() {
    return {
      context: {
        pageUri: window.location.href,
        pageName: document.title,
      },
      fields: setHSFieldsData(),
    };
  }

  async function formSubmit(e) {
    e.preventDefault();
    
    if (!validation()) {
      displayErrorMsg();
      return;
    };

    try {
      const response = await fetch(`${hubspotForm}/${hubspotPortalId}/${hubspotFormId}`, {
        method: e.target.method,
        body: JSON.stringify(getRequestData()),
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      });
      if (response.ok) {
        console.log("success");
      }
      if (response.status === 400) {
        generalErrorText = "Something went wrong. Please try again later.";
      }
    } catch (error) {
      console.log(error);
    }
  }
});