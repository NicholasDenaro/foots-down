function init(){
	console.log('test');
	let gyroscope = new RelativeOrientationSensor({
	//let gyroscope = new Gyroscope({
		frequency: 60,
		referenceFrame: 'device',
	});
	const mat4 = new Float32Array(16);
	let tilt = 0;
	gyroscope.onreading = () => {
		//console.log(gyroscope);
		//console.log('val');
		gyroscope.populateMatrix(mat4);
		document.getElementById('gyro').innerText = Math.round(mat4[10] * 100) / 100;
		//document.getElementById('gyro').innerText = `x: ${gyroscope.x}, y: ${gyroscope.y}, z: ${gyroscope.z}`;
		//document.getElementById('gyro').innerText = Math.round(tilt * 100) / 100;
		//gyroscope.populateMatrix(mat4);
		
		let tiltval = mat4[10];
		if (tiltval > -0.2 && tiltval < 0.2) {
			debounce = false;
			hideAnswer();
		}
		
		if (playing && !debounce) {
			if (tiltval > 0.8) {
				//setTimeout(clearDebounce, 1000);
				incorrect();
				debounce = true;
			}
			if (tiltval < -0.8) {
				//setTimeout(clearDebounce, 1000);
				correct();
				debounce = true;
			}
		}
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

function hideAnswer() {
	const ans = document.getElementById('answer');
	ans.className = 'answer-hide';
}

function showCorrect() {
	const ans = document.getElementById('answer');
	ans.children[0].innerText = 'Correct'
	ans.className = 'answer-correct';
}

function showPass() {
	const ans = document.getElementById('answer');
	ans.children[0].innerText = 'Pass';
	ans.className = 'answer-pass';
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
	debounce = false;
	//document.getElementById('card')
	//resizeCardText();
	hideAnswer();
	//guesses = [{card: cardList.splice(Math.floor(Math.random() * cardList.length), 1)[0]}];
	//document.getElementsByClassName('card')[0].children[0].innerText = guesses[0].card;
	guesses = [];	
	nextCard();
	showCards();
}

function correct() {
	guesses.at(-1).correct = true;
	nextCard();
	showCorrect();
}

function incorrect() {
	nextCard();
	showPass();
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
	delete document.getElementById('card').children[0].style.fontSize;
	setTimeout(resizeCardText,1);
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

function resizeCardText() {
	const card = document.getElementById('card');
	const cardText = card.children[0];
	const cbounds = card.getBoundingClientRect();
	const ctbounds = cardText.getBoundingClientRect();
	if (ctbounds.height > bounds.height) {
		cardText.style.fontSize = `3vh`;
		setTimeout(resizeCardText, 1);
	}
}

function loadCategories() {
showCategories();
addCategory("Animals", animalsList);
addCategory("Jobs", jobsList);
addCategory("Fast Food Chains", fastFoodList);
addCategory("Video Game Characters", videogameCharactersList);
addCategory("OG Pokemon", ogPokemonList);
addCategory("Around the Office", officeList);
addCategory("Celebrities", celebritiesList);
addCategory("Snacks", snacksList);
addCategory("Holidays", holidaysList);
addCategory("Hobbies", hobbiesList);
addCategory("Sports", sportsList);
addCategory("Instruments", instrumentsList);
addCategory("Onomatopoeia", soundsList);
addCategory("Scrum Master", agileList);
addCategory("Sweet Tooth", candyList);
addCategory("Mother Nature", natureList);
addCategory("Minecraft", minecraftList);
addCategory("Complete the Idiom", idiomList);
addCategory("Myths", mythList);
addCategory("Attractive Actors", attractiveActorsList);
addCategory("90's Kids", kids90List);
addCategory("College Courses", collegeCoursesList);
addCategory("Historical Figures", historicalFigureList);
//addCategory("", );
//addCategory("", );
//addCategory("", );
//addCategory("", );
//addCategory("", );
//addCategory("", );
}

Promise.all([
//window.navigator.permissions.query({name:'accelerometer'}),
//window.navigator.permissions.query({name:'magnetometer'}),
window.navigator.permissions.query({name:'gyroscope'})
]).then(permissions => 
{
//document.documentElement.requestFullscreen();
// Disable screen rotation
//screen.lockOrientation("portrait-primary");;

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

const officeList = [
'Desk',
'Chair',
'Computer',
'Keyboard',
'Mouse',
'Monitor',
'Printer',
'Scanner',
'Copier',
'Fax machine',
'Phone',
'Headset',
'Webcam',
'Microphone',
'Speakers',
'Lamp',
'Clock',
'Calendar',
'Pen',
'Pencil',
'Eraser',
'Sharpener',
'Highlighter',
'Marker',
'Stapler',
'Paper clip',
'Rubber band',
'Binder clip',
'Tape',
'Glue',
'Scissors',
'Ruler',
'Calculator',
'Notebook',
'Paper',
'Envelope',
'Folder',
'File cabinet',
'Drawer',
'Trash can',
'Recycling bin',
'Shredder',
'Coffee maker',
'Mug',
'Water bottle',
'Snack',
'Plant',
'Picture frame',
'Book',
'Magazine',
];

const celebritiesList = [
  "Beyoncé",
  "Tom Cruise",
  "Oprah Winfrey",
  "Barack Obama",
  "Taylor Swift",
  "Brad Pitt",
  "Emma Watson",
  "Elon Musk",
  "Rihanna",
  "Leonardo DiCaprio",
  "Ellen DeGeneres",
  "Justin Bieber",
  "Kim Kardashian",
  "Dwayne Johnson",
  "Ariana Grande",
  "Bill Gates",
  "Angelina Jolie",
  "Johnny Depp",
  "Jennifer Lopez",
  "Will Smith",
  "Lady Gaga",
  "Robert Downey Jr.",
  "Drake",
  "Selena Gomez",
  "Keanu Reeves",
  "Meryl Streep",
  "Ed Sheeran",
  "Katy Perry",
  "Daniel Radcliffe",
  "Emma Stone",
  "BTS",
  "Madonna",
  "George Clooney",
  "Stephen Curry",
  "Serena Williams",
  "Lionel Messi",
  "Cristiano Ronaldo",
  "LeBron James",
  "Roger Federer",
  "Usain Bolt",
  "Michael Jordan",
  "Michelle Obama",
  "Malala Yousafzai",
  "Dalai Lama",
  "Nelson Mandela",
  "Albert Einstein",
  "William Shakespeare",
  "Marilyn Monroe",
  "Elvis Presley",
  "Michael Jackson"
];

const snacksList = ["Chips","Popcorn","Pretzels","Crackers","Cheese","Nuts","Trail mix","Granola bar","Energy bar","Protein bar","Cookie","Brownie","Muffin","Cake","Pie","Donut","Croissant","Scone","Bread","Butter","Jam","Peanut butter","Jelly","Nutella","Fruit","Apple","Banana","Orange","Grape","Berry","Vegetable","Carrot","Celery","Cucumber","Tomato","Dip","Hummus","Guacamole","Salsa","Yogurt","Ice cream","Popsicle","Smoothie","Milkshake","Chocolate","Candy","Gummy","Jelly bean","Marshmallow","Cereal"];

const holidaysList = ["New Year's Day","Martin Luther King Jr. Day","Valentine's Day","Presidents' Day","St. Patrick's Day","Easter","Earth Day","Mother's Day","Memorial Day","Father's Day","Independence Day","Labor Day","Columbus Day","Halloween","Veterans Day","Thanksgiving","Christmas","Hanukkah","Kwanzaa","Chinese New Year","Lunar New Year","Diwali","Holi","Eid al-Fitr","Eid al-Adha","Ramadan","Rosh Hashanah","Yom Kippur","Passover","Purim","Mardi Gras","Carnival","Cinco de Mayo","Bastille Day","Canada Day","Australia Day","Anzac Day","Boxing Day","Black Friday","Cyber Monday","Groundhog Day","April Fools' Day","Arbor Day","Flag Day","Juneteenth","Patriot Day","Indigenous Peoples' Day","Election Day","Pearl Harbor Day","Human Rights Day"];

const hobbiesList = ["Reading","Writing","Drawing","Painting","Photography","Cooking","Baking","Gardening","Knitting","Crocheting","Sewing","Quilting","Embroidery","Origami","Scrapbooking","Calligraphy","Pottery","Woodworking","Metalworking","Jewelry making","Candle making","Soap making","Brewing","Chess","Sudoku","Crossword","Jigsaw","Puzzle","Card game","Board game","Video game","Role-playing game","Cosplay","LARPing","Magic","Yoga","Meditation","Pilates","Dancing","Singing","Playing an instrument","Composing music","Podcasting","Blogging","Vlogging","Streaming","Coding","Hacking","Volunteering","Collecting"];

const sportsList = ["Soccer","Football","Basketball","Baseball","Tennis","Golf","Hockey","Cricket","Rugby","Volleyball","Badminton","Table tennis","Swimming","Diving","Gymnastics","Athletics","Cycling","Skiing","Snowboarding","Skating","Boxing","Wrestling","Martial arts","Judo","Karate","Taekwondo","Fencing","Archery","Shooting","Equestrian","Polo","Rodeo","Racing","Formula One","NASCAR","MotoGP","Sailing","Rowing","Canoeing","Kayaking","Surfing","Windsurfing","Fishing","Chess","Poker","Darts","Billiards","Bowling","Curling","Bobsleigh"];

const instrumentsList = ["Piano","Guitar","Violin","Cello","Flute","Clarinet","Saxophone","Trumpet","Trombone","Tuba","French horn","Harp","Banjo","Mandolin","Ukulele","Drums","Cymbals","Tambourine","Maracas","Bongo","Conga","Timpani","Xylophone","Marimba","Vibraphone","Glockenspiel","Triangle","Bell","Chime","Gong","Harmonica","Accordion","Keyboard","Synthesizer","Organ","Recorder","Oboe","Bassoon","Piccolo","English horn","Cor anglais","Bagpipe","Lute","Lyre","Zither","Dulcimer","Sitar","Koto","Erhu","Didgeridoo"];

const soundsList = ["Bang","Boom","Crash","Clang","Clap","Snap","Pop","Fizz","Sizzle","Hiss","Whizz","Zoom","Vroom","Roar","Growl","Bark","Meow","Moo","Quack","Tweet","Chirp","Caw","Hoot","Buzz","Hum","Beep","Ding","Ring","Click","Clack","Tick","Tock","Knock","Thump","Thud","Slam","Splash","Drip","Drop","Plop","Gush","Swish","Swoosh","Whir","Whirl","Snore","Sneeze","Cough","Ahem"];

const agileList = ["Scrum","Kanban","Sprint","Backlog","User story","Epic","Feature","Task","Bug","Acceptance criteria","Definition of done","Estimation","Velocity","Burndown chart","Burnup chart","Cumulative flow diagram","Lead time","Cycle time","Throughput","Work in progress","Product owner","Scrum master","Development team","Stakeholder","Customer","Sprint planning","Daily scrum","Sprint review","Sprint retrospective","Product backlog refinement","Scrum board","Scrum of scrums","Kanban board","Swimlane","Card","Column","Limit","Pull system","Agile manifesto"];

const candyList = ["Chocolate","Gummy","Jelly","Lollipop","Hard candy","Toffee","Caramel","Fudge","Marshmallow","Cotton candy","Licorice","Mints","Gum","Candy cane","Candy corn","Skittles","M&M's","Hershey's","Snickers","Kit Kat","Twix","Milky Way","Reese's","Butterfinger","Twizzlers","Sour Patch Kids","Starburst","Jolly Rancher","Nerds","Smarties","Tic Tac","Lifesavers","Werther's","Rolo","Crunch","Almond Joy","Mounds","Heath","Baby Ruth","PayDay","100 Grand","Laffy Taffy","Airheads","Pop Rocks","Warheads","Swedish Fish","Haribo","Jelly Belly","Pez"];

const natureList = ["Sun","Moon","Star","Sky","Cloud","Rain","Snow","Wind","Storm","Lightning","Thunder","Rainbow","Earth","Mountain","Hill","Valley","Volcano","River","Lake","Ocean","Sea","Wave","Island","Beach","Sand","Rock","Coral","Reef","Forest","Tree","Leaf","Flower","Grass","Moss","Mushroom","Animal","Bird","Fish","Insect","Reptile","Mammal","Amphibian","Butterfly","Bee","Spider","Snake","Frog","Deer","Bear","Wolf"];

const minecraftList = [
  "Creeper",
  "Steve",
  "Enderman",
  "Diamond",
  "Nether",
  "Pig",
  "Zombie",
  "Crafting",
  "Enchanting",
  "Furnace",
  "TNT",
  "Redstone",
  "Potion",
  "Villager",
  "Iron",
  "Gold",
  "Emerald",
  "Obsidian",
  "Portal",
  "End",
  "Dragon",
  "Wither",
  "Skeleton",
  "Spider",
  "Slime",
  "Ghast",
  "Blaze",
  "Magma",
  "Cube",
  "Witch",
  "Guardian",
  "Elder",
  "Shulker",
  "Elytra",
  "Beacon",
  "Anvil",
  "Chest",
  "Minecart",
  "Rail",
  "Boat",
  "Fishing",
  "Rod",
  "Sword",
  "Axe",
  "Pickaxe",
  "Shovel",
  "Hoe",
  "Bow",
  "Arrow",
  "Shield",
  "Armor",
  "Helmet",
  "Chestplate",
  "Leggings",
  "Boots",
  "Leather",
  "Chainmail",
  "Wood",
  "Stone",
  "Brick",
  "Sand",
  "Gravel",
  "Dirt",
  "Grass",
  "Flower",
  "Tree",
  "Sapling",
  "Leaf",
  "Log",
  "Plank",
  "Stair",
  "Slab",
  "Glass",
  "Pane",
  "Wool",
  "Carpet",
  "Clay",
  "Snow",
  "Ice",
  "Water",
  "Lava",
  "Fire",
  "Smoke",
  "Bed",
  "Cake",
  "Cookie",
  "Bread",
  "Apple",
  "Melon",
  "Pumpkin",
  "Pie",
  "Mushroom",
  "Stew",
  "Soup",
  "Book",
  "Quill",
  "Paper",
  "Map",
  "Compass",
  "Clock"
];

const idiomList = [
  "...a dozen",
  "a piece...",
  "...and a leg",
  "back to...",
  "beat around...",
  "better late...",
  "break...",
  "call it...",
  "cut me...",
  "...corners",
  "easy...",
  "...of hand",
  "...off your chest",
  "...cold shoulder",
  "...drawing board",
  "hit the nail...",
  "in the heat...",
  "it's not...",
  "...off the hook",
  "...long story short",
  //"miss the boat",
  "no pain...",
  //"on the ball",
  "once in a...",
  //"pull [someone's] leg",
  "...on ice",
  "rain on...",
  //"see eye to eye",
  "spill the...",
  "take it with...",
  "the best of...",
  "the last...",
  "...the weather",
  "bite off more than...",
  //"burn the midnight oil",
  //"...and a leg",
  "don't judge a book...",
  "...silver lining",
  //"have a blast",
  "it takes two...",
  "kill two birds...",
  "...out of the bag",
  "play devil's...",
  "sit on the...",
  "the elephant...",
  "throw caution...",
  "when pigs...",
  //"you can't judge a book by its cover",
  "...your lips"
];

const mythList = [
  "Zeus",
  "Odin",
  "Hercules",
  "Thor",
  "Medusa",
  "Athena",
  "Loki",
  "Aphrodite",
  "Poseidon",
  "Valkyrie",
  "Minotaur",
  "Cyclops",
  "Apollo",
  "Anubis",
  "Merlin",
  "Arthur",
  "Excalibur",
  "Dragon",
  "Phoenix",
  "Unicorn",
  "Pegasus",
  "Hydra",
  "Sphinx",
  "Cerberus",
  "Nymph",
  "Satyr",
  "Centaur",
  "Faun",
  "Pixie",
  "Fairy",
  "Elf",
  "Dwarf",
  "Giant",
  "Troll",
  "Ogre",
  "Goblin",
  "Griffin",
  "Chimera",
  "Kraken",
  "Leviathan",
  "Manticore",
  "Basilisk",
  "Werewolf",
  "Vampire",
  "Zombie",
  "Ghost",
  "Witch",
  "Wizard",
  "Genie",
  "Nessie"
];

const attractiveActorsList = [
    "Brad Pitt",
    "Scarlett Johansson",
    "Idris Elba",
    "Emma Watson",
    "Chris Hemsworth",
    "Gal Gadot",
    "Henry Cavill",
    "Jennifer Lawrence",
    "Tom Cruise",
    "Angelina Jolie",
    "Ryan Reynolds",
    "Margot Robbie",
    "Leonardo DiCaprio",
    "Natalie Portman",
    "Jason Momoa",
    "Emma Stone",
    "Hugh Jackman",
    "Mila Kunis",
    "Will Smith",
    "Anne Hathaway",
    "Chris Evans",
    "Zoe Saldana",
    "Robert Downey Jr.",
    "Keira Knightley",
    "Dwayne Johnson",
    "Sandra Bullock",
    "Chadwick Boseman",
    "Jessica Alba",
    "Johnny Depp",
    "Halle Berry",
    "Chris Pratt",
    "Charlize Theron",
    "Tom Hiddleston",
    "Megan Fox",
    "Denzel Washington",
    "Reese Witherspoon",
    "Benedict Cumberbatch",
    "Jennifer Aniston",
    "George Clooney",
    "Nicole Kidman",
    "Michael B. Jordan",
    "Julia Roberts",
    "Daniel Craig",
    "Penelope Cruz",
    "Keanu Reeves",
    "Salma Hayek",
    "Christian Bale",
    "Cameron Diaz",
    "Bradley Cooper",
    "Kate Winslet"
];

const kids90List = [
    "Tamagotchi",
    "Pokémon",
    "Spice Girls",
    "Beanie Babies",
    "Nintendo 64",
    "Backstreet Boys",
    "Britney Spears",
    "Furby",
    "The Lion King",
    "Friends",
    "Pogs",
    "The Matrix",
    "Titanic",
    "Harry Potter",
    "Nirvana",
    "The Simpsons",
    "Toy Story",
    "Jurassic Park",
    "The Fresh Prince of Bel-Air",
    "Rugrats",
    "Dawson's Creek",
    "Goosebumps",
    "Power Rangers",
    "The X-Files",
    "Buffy the Vampire Slayer",
    "The Spice World",
    "Space Jam",
    "Home Alone",
    "Clueless",
    "The Little Mermaid",
    "Saved by the Bell",
    "TLC",
    "NSYNC",
    "The Macarena",
    "Skip-It",
    "Super Soaker",
    "Game Boy",
    "Sonic the Hedgehog",
    "Barbie",
    "Lion King",
    "Men in Black",
    "Star Wars",
    "The Baby-Sitters Club",
    "Gargoyles",
    "Hey Arnold!",
    "Daria",
    "The Magic School Bus",
    "Bill Nye the Science Guy",
    "Teletubbies"
];

const collegeCoursesList = [
    "Calculus",
    "Biology",
    "Psychology",
    "Economics",
    "Philosophy",
    "Chemistry",
    "History",
    "Literature",
    "Physics",
    "Sociology",
    "Art",
    "Music",
    "Computer Science",
    "Engineering",
    "Business",
    "Accounting",
    "Marketing",
    "Political Science",
    "Anthropology",
    "Geography",
    "Astronomy",
    "Statistics",
    "Ethics",
    "Law",
    "Medicine",
    "Nursing",
    "Education",
    "Communication",
    "Journalism",
    "Linguistics",
    "Mathematics",
    "Environmental Science",
    "Religion",
    "Theater",
    "Dance",
    "Architecture",
    "Design",
    "Criminal Justice",
    "Social Work",
    "Psychiatry",
    "Neuroscience",
    "Genetics",
    "Biochemistry",
    "Geology",
    "Oceanography",
    "Meteorology",
    "Archeology",
    "Classics",
    "French",
    "Spanish"
];

const historicalFigureList = [
    "Abraham Lincoln",
    "Albert Einstein",
    "Alexander the Great",
    "Anne Frank",
    "Aristotle",
    "Benjamin Franklin",
    "Buddha",
    "Charles Darwin",
    "Cleopatra",
    "Confucius",
    "Dalai Lama",
    "Elizabeth I",
    "Gandhi",
    "George Washington",
    "Helen Keller",
    "Henry VIII",
    "Isaac Newton",
    "Joan of Arc",
    "John F. Kennedy",
    "Julius Caesar",
    "Leonardo da Vinci",
    "Mahatma Gandhi",
    "Malala Yousafzai",
    "Marco Polo",
    "Marie Curie",
    "Martin Luther King Jr.",
    "Marilyn Monroe",
    "Moses",
    "Muhammad",
    "Napoleon Bonaparte",
    "Nelson Mandela",
    "Nicolaus Copernicus",
    "Nostradamus",
    "Plato",
    "Queen Victoria",
    "Rosa Parks",
    "Sigmund Freud",
    "Socrates",
    "Steve Jobs",
    "Thomas Edison",
    "Tutankhamun",
    "Vincent van Gogh",
    "William Shakespeare",
    "Winston Churchill",
    "Wolfgang Amadeus Mozart",
]
