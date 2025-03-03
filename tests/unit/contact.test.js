
const { addContact, updateContact, deleteContact, validateContact } = require('./contact');

// Tests pour validateContact
test('Refuser l\'ajout du contact si le nom, le prenom, le telephone et le courriel sont vides', () => {
    expect(validateContact('')).toBe('Erreur');
});

test('Refuser l\'ajout du contact si le nom est vide', () => {
    expect(validateContact("''", "Marc", "0123456789", "jeanmarc@gmail.com")).toBe('Erreur');
});

test('Refuser l\'ajout du contact si le nom a moins de trois caracteres', () => {
    expect(validateContact("Je", "Marc", "0123456789", "jeanmarc@gmail.com")).toBe('Erreur');
});

test('Refuser l\'ajout du contact si le prenom est vide', () => {
    expect(validateContact("Jean", "''", "0123456789", "jeanmarc@gmail.com")).toBe('Erreur');
});

test('Refuser l\'ajout du contact si le prenom a moins de 3 caracteres', () => {
    expect(validateContact("Jean", "Ma", "0123456789", "jeanmarc@gmail.com")).toBe('Erreur');
});

test('Refuser l\'ajout du contact si le numero de telephone est vide', () => {
    expect(validateContact("Jean", "Marc", "", "jeanmarc@gmail.com")).toBe('Erreur');
});

test('Refuser l\'ajout du contact si le numero de telephone a moins que 10 caracteres', () => {
    expect(validateContact("Jean", "Marc", "123456", "jeanmarc@gmail.com")).toBe('Erreur');
});

test('Refuser l\'ajout du contact si le courriel est vide', () => {
    expect(validateContact("Jean", "Marc", "0123456789", "")).toBe('Erreur');
});

test('Refuser l\'ajout du contact si le format du courriel n\'est pas respecte', () => {
    expect(validateContact("Jean", "Marc", "0123456789", "jeanmarcgmail.com")).toBe('Erreur');
});

test('Refuser l\'ajout du contact si le format du courriel n\'est pas respecte', () => {
    expect(validateContact("Jean", "Marc", "0123456789", "jeanmarc@gmailcom")).toBe('Erreur');
});

test('Accepter l\'ajout du contact si tout est correct', () => {
    expect(validateContact("Jean", "Marc", "0123456789", "jeanmarc@gmail.com")).toBe('Contact validé');
});

// Tests pour addContact
test('Ajout échoué si le contact n\'est pas validable', () => {
    expect(addContact("Jean", "Marc", "0123456789", "jeanmarc@gmailcom")).toBe('Erreur');
});

test('Ajout réussi si le contact est validable', () => {
    expect(addContact("Jacques", "Pierre", "5555555555", "jacquespierre@gmail.com")).toBe('Erreur'); // Déjà existant
    expect(addContact("Nouveau", "Contact", "1234567890", "nouveau@gmail.com")).toBe('Update réussi');
});

// Tests pour updateContact
test('Update échoué si les informations ne sont pas validables', () => {
    expect(updateContact("Jean", "Marc", "0123456789", "jeanmarc@gmailcom")).toBe('Erreur');
});

test('Update réussi si les informations sont validables et le contact existe', () => {
    expect(updateContact("Jacques", "Pierre", "5555555555", "jacquespierre@gmail.com")).toBe('Update réussi');
});

// Tests pour deleteContact
test('Suppression échouée si le contact n\'existe pas', () => {
    expect(deleteContact("Toto", "Tao", "2222222222", "tototao@gmail.com")).toBe('Erreur');
});

test('Suppression réussie si le contact existe', () => {
    expect(deleteContact("Jacques", "Pierre", "5555555555", "jacquespierre@gmail.com")).toBe('Update réussi');
});