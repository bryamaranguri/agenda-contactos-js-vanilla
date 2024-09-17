const $ = (element) => document.querySelector(element);
let isEditing = false;
let currentEditingContact = null;
let contactData = JSON.parse(localStorage.getItem("contacts")) || [];

const contactNameInput = $("#contact-name");
const saveContactBtn = $("#save-contact");
const contactList = $("#contact-list");
const contactCounter = $("#contact-counter");

// Actualizar el contador de contactos
function updateContactCount() {
  contactCounter.textContent = contactData.length;
}

// Guardar los contactos en localStorage
function saveToLocalStorage() {
  localStorage.setItem("contacts", JSON.stringify(contactData));
}

// Crear un nuevo elemento de contacto
function createContactElement(name, index) {
  const li = document.createElement("li");
  li.classList.add("contact-element");

  const p = document.createElement("p");
  p.classList.add("contact-item");
  p.textContent = name;
  p.id = `contact-${index}`;

  const btnEdit = document.createElement("button");
  btnEdit.classList.add("edit-contact");
  btnEdit.textContent = "✎";
  btnEdit.id = `edit-${index}`;

  const btnDelete = document.createElement("button");
  btnDelete.classList.add("delete-contact");
  btnDelete.textContent = "X";
  btnDelete.id = `delete-${index}`;

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("contact-buttons");
  btnContainer.appendChild(btnEdit);
  btnContainer.appendChild(btnDelete);

  li.appendChild(p);
  li.appendChild(btnContainer);

  return li;
}

// Renderizar todos los contactos desde la lista de datos
function renderContacts() {
  contactList.innerHTML = ""; // Limpiar lista actual
  contactData.forEach((contact, index) => {
    const contactElement = createContactElement(contact, index);
    contactList.appendChild(contactElement);
  });
  updateContactCount();
}

// Ordenar contactos alfabéticamente
function sortContacts() {
  contactData.sort((a, b) => a.localeCompare(b));
}

// Agregar un nuevo contacto
function addContact() {
  const contactName = contactNameInput.value.trim();

  // Validar que no esté vacío ni duplicado
  if (contactName === "" || contactData.includes(contactName)) {
    alert("Nombre inválido o contacto duplicado.");
    return;
  }

  contactData.push(contactName); // Añadir al array de datos
  sortContacts(); // Ordenar contactos alfabéticamente
  saveToLocalStorage(); // Guardar en localStorage
  renderContacts(); // Actualizar la UI

  contactNameInput.value = ""; // Limpiar el input
}

// Editar un contacto existente
function editContact() {
  contactData[currentEditingContact] = contactNameInput.value.trim();
  sortContacts(); // Ordenar contactos alfabéticamente después de la edición
  saveToLocalStorage(); // Guardar cambios en localStorage
  renderContacts(); // Volver a renderizar
  contactNameInput.value = "";
  saveContactBtn.textContent = "Agregar Contacto";
  isEditing = false;
  currentEditingContact = null;
}

// Manejar clics en elementos dinámicos (Editar y Eliminar)
document.body.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("edit-contact")) {
    const editingId = e.target.id.split("-")[1];
    contactNameInput.value = contactData[editingId];
    saveContactBtn.textContent = "Editar Contacto";
    isEditing = true;
    currentEditingContact = editingId;
  }

  if (e.target && e.target.classList.contains("delete-contact")) {
    const deleteId = e.target.id.split("-")[1];
    contactData.splice(deleteId, 1); // Eliminar del array de datos
    saveToLocalStorage(); // Guardar cambios en localStorage
    renderContacts(); // Actualizar la UI
  }
});

// Agregar o editar contacto al hacer clic en el botón
saveContactBtn.addEventListener("click", function () {
  if (isEditing) {
    editContact();
  } else {
    addContact();
  }
});

// Cargar los contactos al iniciar la página
document.addEventListener("DOMContentLoaded", renderContacts);
