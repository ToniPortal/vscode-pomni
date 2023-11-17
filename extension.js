// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

function generateRandomWord() {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // ou 'abcdefghijklmnopqrstuvwxyz' pour inclure les minuscules
	let randomWord = '';

	// Ajouter chaque lettre une par une jusqu'à ce que le mot ait 5 caractères
	for (let i = 0; i < 1; i++) {
		const randomIndex = Math.floor(Math.random() * alphabet.length);
		randomWord += alphabet.charAt(randomIndex);
	}

	return randomWord;
}

var interval;
var nbchar = 0;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pomni" is now active!');

	let disposable = vscode.commands.registerCommand('pomni.random', function () {
		// The code you place here will be executed every time your command is executed
		const editor = vscode.window.activeTextEditor;
		interval = setInterval(function () {
			if (editor) {

				let currentPosition = editor.selection.active;

				// Générer un mot aléatoire de 5 caractères
				let randomWord = generateRandomWord();

				// Supprimer les caractères précédents (s'il y en a)
				let startPosition = currentPosition.with({ character: nbchar });
				let endPosition = currentPosition.with({ character: currentPosition.character + 5 });
				let rangeToDelete = new vscode.Range(currentPosition.with({ character: 0 }), endPosition);
				if (nbchar == 6) {
					editor.edit(editBuilder => {
						editBuilder.delete(rangeToDelete);
					});
					nbchar = 0
				} else {

					// Insérer la prochaine lettre du mot à la position du curseur
					editor.edit(editBuilder => {
						editBuilder.insert(startPosition, randomWord);
					});
					nbchar++;
				}

			} else {
				vscode.commands.executeCommand('extension.disableInterval');
				vscode.window.showInformationMessage('You need file for do this');
			}
		}, 100)

		vscode.window.showInformationMessage('RandomName', 'Disable random Name').then(value => {


			if (value === 'Disable random Name') {
				// Envoyer un message à l'extension pour désactiver l'intervalle
				vscode.commands.executeCommand('extension.disableInterval');
			}

		});


	});

	context.subscriptions.push(disposable);

	context.subscriptions.push(vscode.commands.registerCommand('extension.disableInterval', () => {
		let stopinterval = setInterval(function(){
			if(nbchar == 6){
				clearInterval(stopinterval);
				clearInterval(interval);
				console.log('Interval has been disabled.');
				
			}

		},180)
	}));
}

// This method is called when your extension is deactivated
function deactivate() {
	clearInterval(interval);
}

module.exports = {
	activate,
	deactivate
}
