document.addEventListener("DOMContentLoaded", () => {
  const btnSend = document.querySelector(".recognition-btn");
  const loadingEl = document.querySelector(".v-progress-circular");
  let file = "";
  let selectedFileItem = "";
  let lang = "";
  let type = "";
  let documentText = "";

  document.querySelector(".recognition-file").addEventListener("change", function(e) {
    file = e.target.files[0];
    imagePreview(file);
  });

  const selectItem = document.querySelectorAll(".select-dropdown-item");

  for (let i = 0; i < selectItem.length; i++) {
    selectItem[i].addEventListener("click", function(e) {
      if(selectItem[i].classList.contains("dropdown-item-file")) {
        const selectionAlgorithm = document.getElementById("selection-algorithm");
        const labelAlgorithm = document.getElementById("label-algorithm");
        const selectionLang = document.getElementById("selection-lang");
        const labelLang = document.getElementById("label-lang");
        selectedFileItem = selectItem[i].dataset.value;
        selectedFile();
        if(selectedFileItem === "example-0" || selectedFileItem === "example-1") {
          type = "doc";
          selectionAlgorithm.innerHTML = "Algorithm 2";
          selectionAlgorithm.parentElement.querySelector(".select-input").value = "doc";
          labelAlgorithm.classList.add("active");
          lang = "en";
          selectionLang.innerHTML = "English";
          selectionLang.parentElement.querySelector(".select-input").value = "en";
          labelLang.classList.add("active");
        } else if(selectedFileItem === "example-2") {
          type = "text";
          selectionAlgorithm.innerHTML = "Algorithm 1";
          selectionAlgorithm.parentElement.querySelector(".select-input").value = "text";
          labelAlgorithm.classList.add("active");
          lang = "es";
          selectionLang.innerHTML = "Spanish";
          selectionLang.parentElement.querySelector(".select-input").value = "es";
          labelLang.classList.add("active");
        }
      } else if(selectItem[i].classList.contains("dropdown-item-doc")) {
        type = selectItem[i].dataset.value;
      } else if(selectItem[i].classList.contains("dropdown-item-lang")) {
        lang = selectItem[i].dataset.value;
      }
    });
  }

  function imagePreview(file) {
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("imagePreview").src = reader.result;
      selectedFile();
    };
    if (!selectedFileItem.startsWith("example") && file) reader.readAsDataURL(file);
  }

  function selectedFile() {
    const imgSelection = document.querySelectorAll(".img-selection-default");
    const imgPreview = document.querySelector(".img-preview");
    const imgPreviewItems = document.querySelector(".img-preview-items");
    if(file || selectedFileItem != "uploaded") {
      for (let i = 0; i < imgSelection.length; i++) {
        imgSelection[i].classList.add("d-none");
      }
      imgPreview.classList.add("d-none");
      imgPreviewItems.classList.add("active");
    }
    if (selectedFileItem === 'example-0') {
      imgSelection[0].classList.remove("d-none");
      file = imgSelection[0].src.replace(/^.*\/\/[^\/]+/, "").replace("images", "img");
    }
    if (selectedFileItem === 'example-1') {
      imgSelection[1].classList.remove("d-none");
      file = imgSelection[1].src.replace(/^.*\/\/[^\/]+/, "").replace("images", "img");
    }
    if (selectedFileItem === 'example-2') {
      imgSelection[2].classList.remove("d-none");
      file = imgSelection[2].src.replace(/^.*\/\/[^\/]+/, "").replace("images", "img");
    }
    if (selectedFileItem === "uploaded" && file) {
      imgSelection[3].classList.remove("d-none");
    }
  }

  btnSend.addEventListener("click", function(e) {
    if(!file) return;
    sendFile();
  });

  function sendFile() {
    const formData = new FormData();
    formData.append("uploadfile", file);
    if (selectedFileItem.startsWith("example")) formData.append("examplefile", selectedFileItem);
    else imagePreview(file);
    formData.append("type", type);
    formData.append("lang", lang);

    const request = new XMLHttpRequest();
    loadingEl.classList.add("active");
    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        const jsonData = JSON.parse(request.responseText);
        const textEl = document.querySelector(".text-response");
        documentText = jsonData.text;
        document.querySelector(".default-text-preview").classList.add("d-none");
        textEl.classList.remove("d-none");
        textEl.innerHTML = documentText.replace(/\n/ig, '<br>');
        loadingEl.classList.remove("active");
      }
    };
    request.open("POST", "https://text-recognition.webdevelop.pro/upload");
    request.send(formData);
    return false;
  }

});