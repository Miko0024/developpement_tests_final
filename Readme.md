Ce projet est realise dans le cadre du cours de developpement de suites de tests. Il comporte une petite application de gestion de contacts, un test unitaires (jest), un test BDD avec cucumber et un test E2E avec playwright. Pour l'executer on doit installer les ensembles de dependances requises sur son systeme tels que:
npm install
npm install --save-dev jest (pour les test unitaires)
npm install --save-dev @cucumber/cucumber (pour les tests BDD)
npm install --save-dev playwright (pour les tests E2E)
Et de lancer chacune des tests avec les commandes suivantes:
On se met d'abord dans le dossier contacts-manager/tests/unit avant de faire npm run test:jest
On se met dans le dossier contacts-manager/tests/bdd avant de faire npx cucumber-js
Et on se met dans le dossier contacts-manager/tests/e2e avant de faire npx playwright test.

Le code du projet se trouve sur github via ce lien https://github.com/Miko0024/developpement_tests_final, un rapport sur l'amellioration du lighthouse et quelques captures d'ecran montrant l'execution du projet sont disponibles dans le dossier media.