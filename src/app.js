document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const contactsSection = document.getElementById('contacts-section');
    const contactForm = document.getElementById('contact-form');
    const contactFormContainer = document.getElementById('contact-form-container');
    const contactsList = document.getElementById('contacts-list');
    const allContactsBtn = document.getElementById('all-contacts-btn');
    const addContactBtn = document.getElementById('add-contacts-btn');

    // Afficher la section de contacts au chargement
    contactsSection.classList.remove('hidden');
    
    let editMode = false;
    let currentContact = null;
    let contacts = []; // Tableau local des contacts

    // Gestionnaire pour le bouton d'ajout de contact
    addContactBtn.addEventListener('click', function() {
        contactFormContainer.style.display = 'block';
        // Réinitialiser le formulaire et le mode
        contactForm.reset();
        editMode = false;
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Ajouter';
    });

    // Chargement initial des contacts
    loadContacts();

    // Gestionnaire pour le formulaire de contact
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const contactLastName = document.getElementById('contact-last-name').value;
            const contactFirstName = document.getElementById('contact-first-name').value;
            const contactPhone = document.getElementById('contact-phone').value;
            const contactEmail = document.getElementById('contact-email').value;
            
            // Validation des champs 
            if (!validateInputs(contactLastName, contactFirstName, contactPhone, contactEmail)) {
                return;
            }
            
            if (editMode && currentContact) {
                // Mode édition - Mise à jour locale du contact
                const index = contacts.findIndex(contact => contact.id === currentContact);
                if (index !== -1) {
                    contacts[index] = {
                        id: currentContact,
                        lname: contactLastName,
                        fname: contactFirstName,
                        phone: contactPhone,
                        email: contactEmail
                    };
                }
            } else {
                // Mode ajout - Ajout local du contact
                contacts.push({
                    id: Date.now().toString(), // Générer un ID côté client
                    lname: contactLastName,
                    fname: contactFirstName,
                    phone: contactPhone,
                    email: contactEmail
                });
            }
            
            // Sauvegarder les contacts
            saveContacts();
            
            // Réinitialiser le formulaire et cacher le conteneur
            contactForm.reset();
            contactFormContainer.style.display = 'none';
            editMode = false;
            currentContact = null;
            
            // Rafraîchir l'affichage
            displayContacts(contacts);
        });
    }

    // Validation des champs de saisie
    function validateInputs(lastName, firstName, phone, email) {
        let isValid = true;
        let errorMessage = '';
        
        // Vérifier le nom (au moins 3 caractères)
        if (lastName.length < 3) {
            errorMessage += 'Le nom doit contenir au moins 3 caractères.\n';
            isValid = false;
        }
        
        // Vérifier le prénom (au moins 3 caractères)
        if (firstName.length < 3) {
            errorMessage += 'Le prénom doit contenir au moins 3 caractères.\n';
            isValid = false;
        }
        
        // Vérifier le numéro de téléphone (10 chiffres)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            errorMessage += 'Le numéro de téléphone doit contenir exactement 10 chiffres.\n';
            isValid = false;
        }
        
        // Vérifier l'email (doit contenir @ et .)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorMessage += 'L\'email doit être valide (contenir @ et un point).\n';
            isValid = false;
        }
        
        if (!isValid) {
            alert(errorMessage);
        }
        
        return isValid;
    }

    // Chargement des contacts depuis le fichier JSON via le serveur minimal
    function loadContacts() {
        fetch('/contacts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des contacts');
                }
                return response.json();
            })
            .then(data => {
                contacts = data;
                displayContacts(contacts);
            })
            .catch(error => {
                console.error('Erreur:', error);
                // En cas d'erreur, afficher un message à l'utilisateur
                contactsList.innerHTML = '<li class="error">Impossible de charger les contacts. Veuillez réessayer plus tard.</li>';
            });
    }

    // Sauvegarde des contacts dans le fichier JSON 
    function saveContacts() {
        fetch('/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contacts)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde des contacts');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de la sauvegarde des contacts');
        });
    }

    // Affichage des contacts
    function displayContacts(contacts) {
        if (contactsList) {
            contactsList.innerHTML = '';
            
            if (contacts.length === 0) {
                contactsList.innerHTML = '<li>Aucun contact disponible</li>';
                return;
            }
            
            contacts.forEach(contact => {
                const li = document.createElement('li');
                li.className = 'contact-item, contact-card';
                li.dataset.id = contact.id;
                
                const lnameDiv = document.createElement('div');
                lnameDiv.className = 'contact-last-name';
                lnameDiv.textContent = contact.lname;

                const fnameDiv = document.createElement('div');
                fnameDiv.className = 'contact-first-name';
                fnameDiv.textContent = contact.fname;

                const phoneDiv = document.createElement('div');
                phoneDiv.className = 'contact-phone';
                phoneDiv.textContent = contact.phone;
                
                const emailDiv = document.createElement('div');
                emailDiv.className = 'contact-email';
                emailDiv.textContent = contact.email;
                
                // Boutons de suppression et d'édition
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Supprimer';
                deleteBtn.className = 'delete-btn';
                deleteBtn.setAttribute('aria-label', 'Supprimer le contact');
                
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Modifier';
                editBtn.className = 'edit-btn';
                editBtn.setAttribute('aria-label', 'Modifier le contact');
                
                deleteBtn.onclick = () => deleteContact(contact.id);
                editBtn.onclick = () => editContact(contact);
                
                li.appendChild(lnameDiv);
                li.appendChild(fnameDiv);
                li.appendChild(phoneDiv);
                li.appendChild(emailDiv);
                li.appendChild(deleteBtn);
                li.appendChild(editBtn);
                
                contactsList.appendChild(li);
            });
        }
    }

    // Suppression d'un contact
    function deleteContact(contactId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
            contacts = contacts.filter(contact => contact.id !== contactId);
            saveContacts();
            displayContacts(contacts);
        }
    }

    // Édition d'un contact
    function editContact(contact) {
        // Remplir le formulaire avec les données du contact
        document.getElementById('contact-last-name').value = contact.lname;
        document.getElementById('contact-first-name').value = contact.fname;
        document.getElementById('contact-phone').value = contact.phone;
        document.getElementById('contact-email').value = contact.email;
        
        // Afficher le formulaire
        contactFormContainer.style.display = 'block';
        
        // Mettre à jour le bouton de soumission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Mettre à jour';
        
        // Définir le mode d'édition et l'ID du contact en cours
        editMode = true;
        currentContact = contact.id;
    }
    
    // Gestionnaire pour le bouton "Afficher les contacts"
    allContactsBtn.addEventListener('click', function() {
        loadContacts();
    });

    // Exportation des fonctions pour les tests
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            validateInputs
        };
    }
});