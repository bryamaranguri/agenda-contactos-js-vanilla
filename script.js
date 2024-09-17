// Método para acceder al DOM de forma más reducida
const $ = (element) => document.querySelector(element);

// Variables necesarias para la edición
let isEditing = false;
let currentEditingContact = null;

// Obtención de datos del localStorage
let contactData = JSON.parse(localStorage.getItem("contacts")) || [];

// Elementos del DOM
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
  // Elemento padre de cada contacto
  const li = document.createElement("li");
  li.classList.add("contact-element");

  // Un párrafo para el nombre del contacto
  const p = document.createElement("p");
  p.classList.add("contact-item");
  p.textContent = name;
  p.id = `contact-${index}`;

  // Botones de Editar y Eliminar junto con su contenedor
  const btnEdit = document.createElement("button");
  btnEdit.classList.add("edit-contact");
  btnEdit.textContent = "✎";
  // Los id se crean con esta sintaxis para luego acceder con split
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
  // Limpiar lista actual
  contactList.innerHTML = "";
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

  // Añadir al array de datos
  contactData.push(contactName);
  sortContacts();
  saveToLocalStorage();
  renderContacts();

  // Limpiar el input
  contactNameInput.value = "";
}

// Editar un contacto existente
function editContact() {
  contactData[currentEditingContact] = contactNameInput.value.trim();
  sortContacts();
  saveToLocalStorage();
  renderContacts();
  contactNameInput.value = "";
  // Devolver las variables de edición a la normalidad
  saveContactBtn.textContent = "Agregar Contacto";
  isEditing = false;
  currentEditingContact = null;
}

// Manejar clics en elementos dinámicos (Editar y Eliminar)
document.body.addEventListener("click", function (e) {
  // Depende del elemento clickeado, se ejecuta una acción
  if (e.target && e.target.classList.contains("edit-contact")) {
    // Si se va a editar, actualizar las variables de edición
    // Obetener el id del contacto a editar
    const editingId = e.target.id.split("-")[1];
    contactNameInput.value = contactData[editingId];
    saveContactBtn.textContent = "Editar Contacto";
    isEditing = true;
    currentEditingContact = editingId;
  }

  if (e.target && e.target.classList.contains("delete-contact")) {
    // Obetener el id del contacto a eliminar
    const deleteId = e.target.id.split("-")[1];
    contactData.splice(deleteId, 1);
    saveToLocalStorage();
    renderContacts();
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
