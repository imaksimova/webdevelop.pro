document.addEventListener("DOMContentLoaded", () => {
  const hubspotForm = "https://api.hsforms.com/submissions/v3/integration/submit";
  const hubspotPortalId = "6876576";
  const hubspotInfo = [
    {
      id: "form-id-1",
      hubspotFormId: "fecb8029-9782-45f8-9560-cf730fc328f6",
      model: {
        firstname: "",
        email: "",
        jobtitle: "",
        message: ""
      },
      errors: {
        firstname: "",
        email: "",
        jobtitle: "",
        message: ""
      }
    },
    {
      id: "form-id-2",
      hubspotFormId: "1fba5a7b-c3d8-459b-8dae-08d67e03efce",
      model: {
        email: ""
      },
      errors: {
        email: ""
      }
    }
  ]
  const formSubmit = document.querySelectorAll(".form-submit");
  for (let i = 0; i < formSubmit.length; i++) {
    const inputs = formSubmit[i].querySelectorAll(".contact-from-input");
    const generalErrorEl = formSubmit[i].querySelector(".general-form-error");
    const formBtn = formSubmit[i].querySelector(".v-btn");
    const formId = formSubmit[i].id;
    const hubspotInfoItem = hubspotInfo.find((item) => item.id === formId); 
    const hubspotFormId = hubspotInfoItem.hubspotFormId;
    let model = hubspotInfoItem.model;
    let errors = hubspotInfoItem.errors;

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('input', updateInputValue); 
    }

    formSubmit[i].addEventListener("submit", formSubmitHundler);

    function updateInputValue(e) {
      const input = e.target;
      model[input.name] = input.value
      generalErrorEl.textContent = "";
      displayErrorMsg();
    }

    function validation() {
      let flag = true;
  
      for (let i = 0; i < inputs.length; i++) { 
        const inputName = inputs[i].name;
        if (model[inputName] === "") {
          flag = false;
          errors[inputName] = "Field is required."
        }
      }
  
      return flag;
    }
  
    function displayErrorMsg() {
      for (let i = 0; i < inputs.length; i++) {
        const inputName = inputs[i].name;
        const formControl = inputs[i].parentElement;
        const errorEl = formControl.querySelector(".form-control-error");
        if (model[inputName] != "") {
          formControl.classList.remove("is-error");
          errorEl.textContent = "";
        } else {
          formControl.classList.add("is-error");
          errorEl.textContent = errors[inputName];
        }
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
  
    function resetInputFields() {
      const keys = Object.keys(model);
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
      }
      for (let i = 0; i < keys.length; i++) {
        model[keys[i]] = "";
      }
    }
  
    async function formSubmitHundler(e) {
      e.preventDefault();
      
      if (!validation()) {
        displayErrorMsg();
        return;
      };
      
      try {
        generalErrorEl.textContent = "";
        formBtn.disabled = true;
        const response = await fetch(`${hubspotForm}/${hubspotPortalId}/${hubspotFormId}`, {
          method: e.target.method,
          body: JSON.stringify(getRequestData()),
          headers: { "Content-Type": "application/json;charset=UTF-8" },
        });
        if (response.ok) {
          console.log("success");
          formBtn.disabled = false;
          resetInputFields();
        }
        if (response.status === 400) {
          generalErrorEl.textContent = "Something went wrong. Please try again later.";
          formBtn.disabled = false;
        }
      } catch (error) {
        console.log(error);
        formBtn.disabled = false;
      }
    }
  }

});