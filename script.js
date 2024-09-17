const $ = (element) => document.querySelector(element);
// const $$ = (element) => document.querySelectorAll(element);

let contactCount = 0;
let isEditing = false;
let currentEditingContact = null;
let contactData = JSON.parse(localStorage.getItem("contacts")) || [];

const contactNameInput = $("#contact-name");
const saveContactBtn = $("#save-contact");
const contactList = $("#contact-list");
const contactCounter = $("#contact-counter");

function updateContactCount() {
  contactCounter.textContent = contactData.length;
}

function createContactElement(name) {
  const li = document.createElement("li");
  li.classList.add("contact-element");

  const p = document.createElement("p");
  p.classList.add("contact-item");
  p.textContent = name;
  contactCount++;
  p.id = `contact-${contactCount}`;

  const btnEdit = document.createElement("button");
  btnEdit.classList.add("edit-contact");
  btnEdit.textContent = "✎";
  btnEdit.id = `edit-${contactCount}`;

  const btnDelete = document.createElement("button");
  btnDelete.classList.add("delete-contact");
  btnDelete.textContent = "x";
  btnDelete.id = `delete-${contactCount}`;

  li.appendChild(p);
  li.appendChild(btnEdit);
  li.appendChild(btnDelete);

  return li;
}

function addContact() {
  const contactName = contactNameInput.value.trim();

  const contactElement = createContactElement(contactName);
  contactList.appendChild(contactElement);
  contactCounter.textContent = contactCount;
  contactNameInput.value = "";
}

function editContact() {
  $(`#contact-${currentEditingContact}`).textContent = contactNameInput.value;
  contactNameInput.value = "";
  saveContactBtn.textContent = "Agregar Contacto";
}

document.body.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("edit-contact")) {
    const editingId = e.target.id.split("-")[1];
    contactNameInput.value = $(`#contact-${editingId}`).textContent;
    saveContactBtn.textContent = "Editar Contacto";
    isEditing = true;
    currentEditingContact = editingId;
  }

  if (e.target && e.target.classList.contains("delete-contact")) {
    e.target.parentElement.remove();
    contactCounter.textContent = --contactCount;
  }
});

saveContactBtn.addEventListener("click", function (e) {
  if (isEditing) {
    editContact();
  } else {
    addContact(e.target.id);
  }
});
