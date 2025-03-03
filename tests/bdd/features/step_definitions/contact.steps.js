
const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const assert = require('assert');

// On simule l'application
let contacts = [];
let currentContact = {};
let isOnContactsPage = false;
let lastDeletedContactId = null;


Before(function() {
  // Réinitialisation de l'état pour chaque scénario
  contacts = [
    { id: '1', nom: 'Smith', prenom: 'John', email: 'john.smith@example.com', telephone: '0123456789' },
    { id: '2', nom: 'Jones', prenom: 'Emma', email: 'emma.jones@example.com', telephone: '0987654321' }
  ];
  currentContact = {};
  isOnContactsPage = false;
  lastDeletedContactId = null;
});

// Given Steps
Given('Je suis sur la page de gestion des contacts', function() {
  // Simuler la navigation vers la page des contacts
  isOnContactsPage = true;
  assert.strictEqual(isOnContactsPage, true, "L'utilisateur devrait être sur la page de gestion des contacts");
});

Given('Je remplis le formulaire des donnees valides', function() {
  // Simuler le remplissage du formulaire
  currentContact = {
    id: String(contacts.length + 1),
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    telephone: '0123456789'
  };
});

Given('je modifie les informations d\'un contact existant', function() {
  // Simuler la sélection et la modification d'un contact existant
  const contactAModifier = contacts[0]; 
  
  // Sauvegarder l'ID pour vérifier plus tard
  const contactId = contactAModifier.id;
  
  // Nouvelles valeurs
  currentContact = {
    id: contactId,
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@example.com',
    telephone: '0987654321'
  };
});

// When Steps
When('Je clique sur Ajouter', function() {
  // Vérifier que nous sommes sur la bonne page
  assert.strictEqual(isOnContactsPage, true, "L'utilisateur doit être sur la page des contacts pour ajouter un contact");
  
  // Simuler l'ajout d'un contact
  contacts.push({ ...currentContact });
});

When('Je clique sur Modifier', function() {
  // Vérifier que nous sommes sur la bonne page
  assert.strictEqual(isOnContactsPage, true, "L'utilisateur doit être sur la page des contacts pour modifier un contact");
  
  // Simuler la modification d'un contact
  const index = contacts.findIndex(contact => contact.id === currentContact.id);
  if (index !== -1) {
    contacts[index] = { ...currentContact };
  } else {
    throw new Error("Contact à modifier non trouvé");
  }
});

When('Je clique sur Supprimer', function() {
  // Vérifier que nous sommes sur la bonne page
  assert.strictEqual(isOnContactsPage, true, "L'utilisateur doit être sur la page des contacts pour supprimer un contact");
  
  // Simuler la suppression d'un contact (premier contact)
  const contactASupprimer = contacts[0];
  lastDeletedContactId = contactASupprimer.id;
  
  // Supprimer le contact
  contacts = contacts.filter(contact => contact.id !== lastDeletedContactId);
});

// Then Steps
Then('Je vois le nouveau contact dans la liste', function() {
  // Vérifier que le contact ajouté est dans la liste
  const contactAjoute = contacts.find(
    contact => contact.nom === currentContact.nom && contact.prenom === currentContact.prenom
  );
  
  assert.notStrictEqual(contactAjoute, undefined, "Le nouveau contact devrait être présent dans la liste");
});

Then('Je vois le contact avec les nouvelles informations', function() {
  // Vérifier que le contact modifié est dans la liste avec les nouvelles informations
  const contactModifie = contacts.find(
    contact => contact.id === currentContact.id
  );
  
  assert.notStrictEqual(contactModifie, undefined, "Le contact modifié devrait être présent dans la liste");
  assert.strictEqual(contactModifie.nom, currentContact.nom, "Le nom du contact devrait être mis à jour");
  assert.strictEqual(contactModifie.prenom, currentContact.prenom, "Le prénom du contact devrait être mis à jour");
  assert.strictEqual(contactModifie.email, currentContact.email, "L'email du contact devrait être mis à jour");
  assert.strictEqual(contactModifie.telephone, currentContact.telephone, "Le téléphone du contact devrait être mis à jour");
});

Then('Le contact que j\'ai supprime disparait', function() {
  // Vérifier que le contact supprimé n'est plus dans la liste
  const contactToujoursPrésent = contacts.some(contact => contact.id === lastDeletedContactId);
  
  assert.strictEqual(contactToujoursPrésent, false, "Le contact supprimé ne devrait plus être dans la liste");
});