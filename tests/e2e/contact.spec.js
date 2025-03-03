
const { test, expect } = require('@playwright/test');

test.describe('Gestionnaire de contacts', () => {
  test.beforeEach(async ({ page }) => {
    // Accéder à l'application
    await page.goto('http://localhost:3000');
    
    // S'assurer que la page est chargée
    await expect(page.locator('#contacts-section')).toBeVisible();
  });

  test('doit afficher la page d\'accueil avec les boutons principaux', async ({ page }) => {
    await expect(page.locator('#all-contacts-btn')).toBeVisible();
    await expect(page.locator('#add-contacts-btn')).toBeVisible();
  });

  test('doit ouvrir le formulaire quand on clique sur Ajouter un contact', async ({ page }) => {
    await page.click('#add-contacts-btn');
    await expect(page.locator('#contact-form-container')).toBeVisible();
    await expect(page.locator('#contact-form')).toBeVisible();
  });

  test('doit ajouter un contact avec succès', async ({ page }) => {
    // Ouvrir le formulaire
    await page.click('#add-contacts-btn');
    
    // Remplir le formulaire correctement
    await page.fill('#contact-last-name', 'Dupont');
    await page.fill('#contact-first-name', 'Jean');
    await page.fill('#contact-phone', '0123456789');
    await page.fill('#contact-email', 'jean.dupont@example.com');
    
    // Soumission du formulaire
    await page.click('#contact-form button[type="submit"]');
    
    // Attendre que le contact soit ajouté à la liste, en vérifiant les éléments par leur texte
    const contactLastName = page.locator('.contact-last-name:has-text("Dupont")');
    await expect(contactLastName).toBeVisible({ timeout: 5000 });
  
    const contactFirstName = page.locator('.contact-first-name:has-text("Jean")');
    await expect(contactFirstName).toBeVisible({ timeout: 5000 });
  });
  
  test('doit permettre de modifier un contact', async ({ page }) => {
    // D'abord, ajouter un contact pour le modifier ensuite
    await page.click('#add-contacts-btn');
    await page.fill('#contact-last-name', 'Martin');
    await page.fill('#contact-first-name', 'Sophie');
    await page.fill('#contact-phone', '0987654321');
    await page.fill('#contact-email', 'sophie.martin@example.com');
    await page.click('#contact-form button[type="submit"]');
    
    // Attendre que le contact apparaisse dans la liste
    const contactLastName = page.locator('.contact-last-name:has-text("Martin")');
    await expect(contactLastName).toBeVisible({ timeout: 5000 });
    
    // Cliquer sur modifier
    await page.locator('li:has-text("Martin") .edit-btn').click();
    
    // Modifier le nom
    await page.fill('#contact-last-name', 'Martins');
    
    // Soumettre les modifications
    await page.click('#contact-form button[type="submit"]');
    
    // Attendre que le contact soit mis à jour
    const contactLastNameUpdated = page.locator('.contact-last-name:has-text("Martins")');
    await expect(contactLastNameUpdated).toBeVisible({ timeout: 5000 });
  });
  

  test('doit permettre de supprimer un contact', async ({ page }) => {
    // Ajouter un contact
    const mockContact = {
      lastName: 'Petit',
      firstName: 'Robert',
      phone: '0123456789',
      email: 'robert.petit@example.com'
    };

    // Simuler l'ajout du contact
    await page.evaluate((contact) => {
      const event = new CustomEvent('add-contact', {
        detail: contact
      });
      window.dispatchEvent(event);  
    }, mockContact);

    // Simuler la suppression du contact
    await page.evaluate((contact) => {
      const event = new CustomEvent('delete-contact', {
        detail: contact
      });
      window.dispatchEvent(event);  
    }, mockContact);

    // Vérifier que le contact est supprimé
    await expect(page.locator('.contact-last-name:has-text("Petit")')).not.toBeVisible();
  });
});
