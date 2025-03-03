Feature: Validation d'ajout, de modification et de suppression de contact

  Scenario: Ajouter un nouveau contact
    Given Je suis sur la page de gestion des contacts
    And Je remplis le formulaire des donnees valides
    When Je clique sur Ajouter
    Then Je vois le nouveau contact dans la liste

  Scenario: Modifier un contact
    Given Je suis sur la page de gestion des contacts
    And je modifie les informations d'un contact existant
    When Je clique sur Modifier
    Then Je vois le contact avec les nouvelles informations

  Scenario: Supprimer un contact
    Given Je suis sur la page de gestion des contacts
    When Je clique sur Supprimer
    Then Le contact que j'ai supprime disparait