//l'oggetto exports permette di trasmettere ed esportare 
//ad un altro script dei dati attraverso la proprietà 
//fraseDelGiorno che viene impostata con una frase scelta 
//in modo casuale all'interno di un vettore di frasi
//Per utilizzare il modulo che ho creato devo impostare nello script che lo utilizza
//il suo riferimento ad una variabile: const miomodulo=require('./fraseDelGiorno.js')
//se la frase invece di essere random fosse fissa il modulo sarebbe fatto in questo modo:
//exports.fraseDelGiorno='Che cosa hanno in comune un televisore e una formica? Le antenne!';
//tutte le funzioni non esportate nello script del modulo rimarranno private
//possono pertanto essere utilizzate da altre funzioni
//del modulo
exports.api=function (lat, lon) {
	const frase= [
	'Che cosa hanno in comune un televisore e una formica? Le antenne!',
	'Qual è la città preferita dai ragni? Mosca!',
	'Qual è la pianta più puzzolente? Quella dei piedi!',
	'Che cosa è una zebra? Un cavallo evaso dal carcere!',
	'Sapete perché il pomodoro non riesce a dormire? Perché l’insalata… russa!'];
	const indice=Math.floor(Math.random()*5);
	return {
		messaggio:frase[indice]
	};
}