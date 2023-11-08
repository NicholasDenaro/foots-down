function init(){
	console.log('test');
	let gyroscope = new AbsoluteOrientationSensor({
	//let gyroscope = new Gyroscope({
		frequency: 60,
		referenceFrame: 'device',
	});
	let tilt = 0;
	gyroscope.onreading = () => {
		//console.log(gyroscope);
		//console.log('val');
		document.getElementById('gyro').innerText = Math.round(gyroscope.quaternion[1] * 100) / 100;
		//document.getElementById('gyro').innerText = `x: ${gyroscope.x}, y: ${gyroscope.y}, z: ${gyroscope.z}`;
		/*document.getElementById('gyro').innerText = Math.round(tilt * 100) / 100;
		if (playing && !debounce) {
			if (gyroscope.y > 0.3) {
				tilt += gyroscope.y;
			}
			if (gyroscope.y < -0.3) {
				tilt += gyroscope.y;
			}
			//tilt += gyroscope.y;
			if (tilt > 50) {
				setTimeout(clearDebounce, 1000);
				correct();
				debounce = true;
				tilt = 0
			}
			if (tilt < -50) {
				setTimeout(clearDebounce, 1000);
				incorrect();
				debounce = true;
				tilt = 0;
			}
		}*/
	};
	
	gyroscope.onerror = err => console.log(err);
	gyroscope.onactivate = e => {console.log('active');
console.log(e); 
				     //alert('gryo active');
				    };
	console.log(gyroscope);
	let started = gyroscope.start();
	console.log(gyroscope);
}

let debounce = false;
function clearDebounce() {
	debounce = false;
}

function addCategory(name, words) {
	let box = document.createElement('div');
	let boxText = document.createElement('div');
	boxText.style.margin = 'auto';
	box.appendChild(boxText);
	boxText.innerText = name;
	boxText.onclick = () => {
		cardList = [...words];
		startCountdown();
	}
	box.id = name;
	box.className = "category";
	box.style.backgroundColor = 'blue';
	document.getElementById('categories').appendChild(box);
}

function showCategories() {
	document.getElementById('categories').style.display = "flex";
	document.getElementById('playing').style.display = "none";
	document.getElementById('summary').style.display = "none";
}

function showCountdown() {
	document.getElementById('categories').style.display = "none";
	document.getElementById('countdown').style.display = "flex";
}

function showCards() {
	document.getElementById('categories').style.display = "none";
	document.getElementById('countdown').style.display = "none";
        document.getElementById('playing').style.display = "flex";
	document.getElementById('summary').style.display = "none";
}

function showSummary() {
	document.getElementById('categories').style.display = "none";
	document.getElementById('playing').style.display = "none";
	document.getElementById('summary').style.display = "flex";
}

let countinterval;
let countdown = 3;
function startCountdown() {
	showCountdown();
	countdown = 3;
	timeout = setTimeout(() => {
		startRound();
	}, 3 * 1000);
	document.getElementById("countdown").children[0].innerText = 
countdown;
	countinterval = setInterval(() => {
		countdown--;
		document.getElementById("countdown").children[0].innerText 
= countdown;
		if (countdown == 0) clearInterval(countinterval);
	}, 1000);
}

let playing = false;
let interval;
let timeout;
let percent = 100;
let guesses = [
{card: 'blah', correct: true},
{card: 'bla2', correct: false}
];
let cardList = [];
function startRound() {
	timeout = setTimeout(() => endRound(), 60 * 1000);
	percent = 100;
	interval = setInterval(() => {
		percent -= 100 / (60 * 1000 / 100);
		document.getElementById('timer').style.height = 
`${percent}%`;
	}, 100);

	playing = true;
		
	//guesses = [{card: cardList.splice(Math.floor(Math.random() * cardList.length), 1)[0]}];
	//document.getElementsByClassName('card')[0].children[0].innerText = guesses[0].card;
	guesses = [];	
	nextCard();
	showCards();
}

function correct() {
	guesses.at(-1).correct = true;
	nextCard();
}

function incorrect() {
	nextCard();
}

function nextCard() {
	if (cardList.length == 0) {
		endRound();
		return;
	}
	guesses.push({card: cardList.splice(Math.floor(Math.random() * 
cardList.length), 1)});
	document.getElementsByClassName('card')[0].children[0].innerText =
guesses.at(-1).card;
}

function endRound() {
	clearTimeout(timeout);
	timeout = null;
	clearInterval(interval);
	interval = null;
	console.log('round end');
	document.getElementById('summary-count').innerText = 
`${guesses.filter(g => g.correct).length}/${guesses.length}`;
	document.getElementById('summary-recap').innerHTML = '';
	guesses.forEach(guess => {
		let word = document.createElement('div');
		word.className = guess.correct ? 'correct' : 'incorrect'
		word.innerText = guess.card;
document.getElementById('summary-recap').appendChild(word);
		
	});
	playing = false;
	showSummary();
}



function loadCategories() {
showCategories();
addCategory("Animals", animalsList);
addCategory("Jobs", jobsList);
addCategory("Fast Food Chains", fastFoodList);
addCategory("Video Game Characters", videogameCharactersList);
addCategory("OG Pokemon", ogPokemonList);
}

Promise.all([
//window.navigator.permissions.query({name:'accelerometer'}),
//window.navigator.permissions.query({name:'magnetometer'}),
window.navigator.permissions.query({name:'gyroscope'})
]).then(permissions => 
{
console.log(permissions);
console.log('start');
init();

});

const ogPokemonList = [
'Bulbasaur',
'Ivysaur',
'Venusaur',
'Charmander',
'Charmeleon',
'Charizard',
'Squirtle',
'Wartortle',
'Blastoise',
'Caterpie',
'Metapod',
'Butterfree',
'Weedle',
'Kakuna',
'Beedrill',
'Pidgey',
'Pidgeotto',
'Pidgeot',
'Rattata',
'Raticate',
'Spearow',
'Fearow',
'Ekans',
'Arbok',
'Pikachu',
'Raichu',
'Sandshrew',
'Sandslash',
'Nidoran♀',
'Nidorina',
'Nidoqueen',
'Nidoran♂',
'Nidorino',
'Nidoking',
'Clefairy',
'Clefable',
'Vulpix',
'Ninetales',
'Jigglypuff',
'Wigglytuff',
'Zubat',
'Golbat',
'Oddish',
'Gloom',
'Vileplume',
'Paras',
'Parasect',
'Venonat',
'Venomoth',
'Diglett',
'Dugtrio',
'Meowth',
'Persian',
'Psyduck',
'Golduck',
'Mankey',
'Primeape',
'Growlithe',
'Arcanine',
'Poliwag',
'Poliwhirl',
'Poliwrath',
'Abra',
'Kadabra',
'Alakazam',
'Machop',
'Machoke',
'Machamp',
'Bellsprout',
'Weepinbell',
'Victreebel',
'Tentacool',
'Tentacruel',
'Geodude',
'Graveler',
'Golem',
'Ponyta',
'Rapidash',
'Slowpoke',
'Slowbro',
'Magnemite',
'Magneton',
'Farfetch\'d',
'Doduo',
'Dodrio',
'Seel',
'Dewgong',
'Grimer',
'Muk',
'Shellder',
'Cloyster',
'Gastly',
'Haunter',
'Gengar',
'Onix',
'Drowzee',
'Hypno',
'Krabby',
'Kingler',
'Voltorb',
'Electrode',
'Exeggcute',
'Exeggutor',
'Cubone',
'Marowak',
'Hitmonlee',
'Hitmonchan',
'Lickitung',
'Koffing',
'Weezing',
'Rhyhorn',
'Rhydon',
'Chansey',
'Tangela',
'Kangaskhan',
'Horsea',
'Seadra',
'Goldeen',
'Seaking',
'Staryu',
'Starmie',
'Mr. Mime',
'Scyther',
'Jynx',
'Electabuzz',
'Magmar',
'Pinsir',
'Tauros',
'Magikarp',
'Gyarados',
'Lapras',
'Ditto',
'Eevee',
'Vaporeon',
'Jolteon',
'Flareon',
'Porygon',
'Omanyte',
'Omastar',
'Kabuto',
'Kabutops',
'Aerodactyl',
'Snorlax',
'Articuno',
'Zapdos',
'Moltres',
'Dratini',
'Dragonair',
'Dragonite',
'Mewtwo',
'Mew',
];

const animalsList = [
	'alligator',
	'ant',
	'bear',
	'bee',
	'bird',
	'butterfly',
	'camel',
	'cat',
	'cheetah',
	'chicken',
	'cow',
	'crocodile',
	'deer',
	'dog',
	'dolphin',
	'duck',
	'eagle',
	'elephant',
	'fish',
	'flamingo',
	'fox',
	'frog',
	'giraffe',
	'goat',
	'hamster',
	'hippo',
	'horse',
	'kangaroo',
	'koala',
	'lion',
	'lizard',
	'monkey',
	'mouse',
	'octopus',
	'owl',
	'panda',
	'parrot',
	'penguin',
	'pig',
	'rabbit',
	'rhino',
	'seal',
	'shark',
	'sheep',
	'snake',
	'spider',
	'squirrel',
	'tiger',
	'turtle',
	'zebra',
];

const fastFoodList = [
	'Burger King',
	'McDonald\'s',
	'KFC',
	'Subway',
	'Pizza Hut',
	'Domino\'s',
	'Taco Bell',
	'Wendy\'s',
	'Starbucks',
	'Dunkin\' Donuts',
	'Chick-fil-A',
	'Popeyes',
	'Chipotle',
	'Panera Bread',
	'Five Guys',
	'Shake Shack',
	'In-N-Out',
	'Arby\'s',
	'Sonic',
	'Hardee\'s',
	'Carl\'s Jr.',
	'Jack in the Box',
	'Whataburger',
	'Quiznos',
	'Jimmy John\'s',
	'Panda Express',
	'Little Caesars',
	'Dairy Queen',
	'Cinnabon',
	'Krispy Kreme',
	'Auntie Anne\'s',
	'Tim Hortons',
	'White Castle',
	'Long John Silver\'s',
	'Del Taco',
	'Bojangles\'',
	'Church\'s Chicken',
	'Zaxby\'s',
	'Raising Cane\'s',
	'Wingstop',
	'Jamba Juice',
	'Smoothie King',
	'Cold Stone Creamery',
	'Baskin-Robbins',
	'Pinkberry',
	'Nando\'s',
	'Pret A Manger',
	'Greggs',
	'Costa Coffee',
	'Cafe Nero',
];

const jobsList = [
	'accountant',
	'actor',
	'architect',
	'artist',
	'astronaut',
	'athlete',
	'baker',
	'barber',
	'biologist',
	'builder',
	'chef',
	'chemist',
	'clerk',
	'coach',
	'dentist',
	'designer',
	'doctor',
	'driver',
	'editor',
	'engineer',
	'farmer',
	'firefighter',
	'florist',
	'gardener',
	'journalist',
	'judge',
	'lawyer',
	'librarian',
	'mechanic',
	'musician',
	'nurse',
	'painter',
	'pharmacist',
	'photographer',
	'pilot',
	'plumber',
	'poet',
	'police',
	'singer',
	'soldier',
	'teacher',
	'therapist',
	'translator',
	'veterinarian',
	'waiter',
	'writer',
	'yoga instructor',
	'zoologist',
];

const videogameCharactersList = [
	'Mario',
	'Luigi',
	'Peach',
	'Bowser',
	'Link',
	'Zelda',
	'Ganondorf',
	'Samus',
	'Kirby',
	'Donkey Kong',
	'Sonic',
	'Tails',
	'Knuckles',
	'Eggman',
	'Crash',
	'Spyro',
	'Lara Croft',
	'Nathan Drake',
	'Master Chief',
	'Cortana',
	'Solid Snake',
	'Cloud',
	'Sephiroth',
	'Aerith',
	'Kratos',
	'Geralt',
	'Triss',
	'Ciri',
	'Ezio',
	'Altair',
	'Lara Croft',
	'Joel',
	'Ellie',
	'Aloy',
	'Arthur Morgan',
	'John Marston',
	'Dutch',
	'CJ',
	'Niko',
	'Trevor',
	'Michael',
	'Franklin',
	'Gordon Freeman',
	'Alyx',
	'Chell',
	'GLaDOS',
	'Wheatley',
	'Commander Shepard',
	'Garrus',
	'Liara',
];
