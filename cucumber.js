// // // module.exports = {
// // //     default: '--require features/step_definitions/**/*.js'
// // //   }


// // module.exports = {
// //     default: {
// //       language: 'fr',
// //       paths: ['./features/'],
// //       require: ['./features/step_definitions/*.js']
// //     }
// //   };



// module.exports = {
//     default: {
//       paths: ['./tests/bdd/features/'],
//       require: [
//         './tests/bdd/features/step_definitions/*.js'
//       ],
//       requireModule: [],
//       format: ['progress', 'html:cucumber-report.html'],
//       formatOptions: { snippetInterface: 'synchronous' },
//       publishQuiet: true
//     }
//   };


module.exports = {
    default: `
        --require test/features/step_definitions/*.js
        --require test/features/*.js
        test/features/**/*.feature
    `
};