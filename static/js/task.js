/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"stage.html",
	"complete.html"
];

console.log("at this point now");

psiTurk.preloadPages(pages);

/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/


function getRadioVal(form, name) {
    var val;
    // get list of radio buttons with specified name
    var radios = form.elements[name];
    
    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    }
    return val; // return value of checked radio or undefined if none checked
}

/********************
* ASK QUESTION      *
********************/
var QuestionExperiment = function() {
	console.log("in question experiment");
	var questions = ['IS IT AN ANIMAL?', 'IS IT A BODY PART?', 'IS IT A BUILDING?', 'IS IT A BUILDING PART?', 'IS IT CLOTHING?', 'IS IT FURNITURE?', 'IS IT AN INSECT?', 'IS IT A KITCHEN ITEM?', 'IS IT MANMADE?', 'IS IT A TOOL?', 'CAN YOU EAT IT?', 'IS IT A VEHICLE?', 'IS IT A PERSON?', 'IS IT A VEGETABLE / PLANT?', 'IS IT A FRUIT?', 'IS IT MADE OF METAL?', 'IS IT MADE OF PLASTIC?', 'IS PART OF IT MADE OF GLASS?', 'IS IT MADE OF WOOD?', 'IS IT SHINY?', 'CAN YOU SEE THROUGH IT?', 'IS IT COLORFUL?', 'DOES IT CHANGE COLOR?', 'IS ONE MORE THAN ONE COLORED?', 'IS IT ALWAYS THE SAME COLOR(S)?', 'IS IT WHITE?', 'IS IT RED?', 'IS IT ORANGE?', 'IS IT FLESH-COLORED?', 'IS IT YELLOW?', 'IS IT GREEN?', 'IS IT BLUE?', 'IS IT SILVER?', 'IS IT BROWN?', 'IS IT BLACK?', 'IS IT CURVED?', 'IS IT STRAIGHT?', 'IS IT FLAT?', 'DOES IT HAVE A FRONT AND A BACK?', 'DOES IT HAVE A FLAT / STRAIGHT TOP?', 'DOES IT HAVE FLAT / STRAIGHT SIDES?', 'IS TALLER THAN IT IS WIDE/LONG?', 'IS IT LONG?', 'IS IT POINTED / SHARP?', 'IS IT TAPERED?', 'IS IT ROUND?', 'DOES IT HAVE CORNERS?', 'IS IT SYMMETRICAL?', 'IS IT HAIRY?', 'IS IT FUZZY?', 'IS IT CLEAR?', 'IS IT SMOOTH?', 'IS IT SOFT?', 'IS IT HEAVY?', 'IS IT LIGHTWEIGHT?', 'IS IT DENSE?', 'IS IT SLIPPERY?', 'CAN IT CHANGE SHAPE?', 'CAN IT BEND?', 'CAN IT STRETCH?', 'CAN IT BREAK?', 'IS IT FRAGILE?', 'DOES IT HAVE PARTS?', 'DOES IT HAVE MOVING PARTS?', 'DOES IT COME IN PAIRS?', 'DOES IT COME IN A BUNCH/PACK?', 'DOES IT LIVE IN GROUPS?', 'IS IT PART OF SOMETHING LARGER?', 'DOES IT CONTAIN SOMETHING ELSE?', 'DOES IT HAVE INTERNAL STRUCTURE?', 'DOES IT OPEN?', 'IS IT HOLLOW?', 'DOES IT HAVE A HARD INSIDE?', 'DOES IT HAVE A HARD OUTER SHELL?', 'DOES IT HAVE AT LEAST ONE HOLE?', 'IS IT ALIVE?', 'WAS IT EVER ALIVE?', 'IS IT A SPECIFIC GENDER?', 'IS IT MANUFACTURED?', 'WAS IT INVENTED?', 'WAS IT AROUND 100 YEARS AGO?', 'ARE THERE MANY VARIETIES OF IT?', 'DOES IT COME IN DIFFERENT SIZES?', 'DOES IT GROW?', 'IS IT SMALLER THAN A GOLFBALL?', 'IS IT BIGGER THAN A LOAF OF BREAD?', 'IS IT BIGGER THAN A MICROWAVE OVEN?', 'IS IT BIGGER THAN A BED?', 'IS IT BIGGER THAN A CAR?', 'IS IT BIGGER THAN A HOUSE?', 'IS IT TALLER THAN A PERSON?', 'DOES IT HAVE A TAIL?', 'DOES IT HAVE LEGS?', 'DOES IT HAVE FOUR LEGS?', 'DOES IT HAVE FEET?', 'DOES IT HAVE PAWS?', 'DOES IT HAVE CLAWS?', 'DOES IT HAVE HORNS / THORNS / SPIKES?', 'DOES IT HAVE HOOVES?', 'DOES IT HAVE A FACE?', 'DOES IT HAVE A BACKBONE?', 'DOES IT HAVE WINGS?', 'DOES IT HAVE EARS?', 'DOES IT HAVE ROOTS?', 'DOES IT HAVE SEEDS?', 'DOES IT HAVE LEAVES?', 'DOES IT COME FROM A PLANT?', 'DOES IT HAVE FEATHERS?', 'DOES IT HAVE SOME SORT OF NOSE?', 'DOES IT HAVE A HARD NOSE/BEAK?', 'DOES IT CONTAIN LIQUID?', 'DOES IT HAVE WIRES OR A CORD?', 'DOES IT HAVE WRITING ON IT?', 'DOES IT HAVE WHEELS?', 'DOES IT MAKE A SOUND?', 'DOES IT MAKE A NICE SOUND?', 'DOES IT MAKE SOUND CONTINUOUSLY WHEN ACTIVE?', 'IS ITS JOB TO MAKE SOUNDS?', 'DOES IT ROLL?', 'CAN IT RUN?', 'IS IT FAST?', 'CAN IT FLY?', 'CAN IT JUMP?', 'CAN IT FLOAT?', 'CAN IT SWIM?', 'CAN IT DIG?', 'CAN IT CLIMB TREES?', 'CAN IT CAUSE YOU PAIN?', 'CAN IT BITE OR STING?', 'DOES IT STAND ON TWO LEGS?', 'IS IT WILD?', 'IS IT A HERBIVORE?', 'IS IT A PREDATOR?', 'IS IT WARM BLOODED?', 'IS IT A MAMMAL?', 'IS IT NOCTURNAL?', 'DOES IT LAY EGGS?', 'IS IT CONSCIOUS?', 'DOES IT HAVE FEELINGS?', 'IS IT SMART?', 'IS IT MECHANICAL?', 'IS IT ELECTRONIC?', 'DOES IT USE ELECTRICITY?', 'CAN IT KEEP YOU DRY?', 'DOES IT PROVIDE PROTECTION?', 'DOES IT PROVIDE SHADE?', 'DOES IT CAST A SHADOW?', 'DO YOU SEE IT DAILY?', 'IS IT HELPFUL?', 'DO YOU INTERACT WITH IT?', 'CAN YOU TOUCH IT?', 'WOULD YOU AVOID TOUCHING IT?', 'CAN YOU HOLD IT?', 'CAN YOU HOLD IT IN ONE HAND?', 'DO YOU HOLD IT TO USE IT?', 'CAN YOU PLAY IT?', 'CAN YOU PLAY WITH IT?', 'CAN YOU PET IT?', 'CAN YOU USE IT?', 'DO YOU USE IT DAILY?', 'CAN YOU USE IT UP?', 'DO YOU USE IT WHEN COOKING?', 'IS IT USED TO CARRY THINGS?', 'CAN YOU PICK IT UP?', 'CAN YOU CONTROL IT?', 'CAN YOU SIT ON IT?', 'CAN YOU RIDE ON/IN IT?', 'IS IT USED FOR TRANSPORTATION?', 'COULD YOU FIT INSIDE IT?', 'IS IT USED IN SPORTS?', 'DO YOU WEAR IT?', 'CAN IT BE WASHED?', 'IS IT COLD?', 'IS IT COOL?', 'IS IT WARM?', 'IS IT HOT?', 'IS IT UNHEALTHY?', 'IS IT HARD TO CATCH?', 'CAN YOU PEEL IT?', 'CAN YOU WALK ON IT?', 'CAN YOU SWITCH IT ON AND OFF?', 'CAN IT BE EASILY MOVED?', 'DO YOU DRINK FROM IT?', 'DOES IT GO IN YOUR MOUTH?', 'IS IT TASTY?', 'IS IT USED DURING MEALS?', 'DOES IT HAVE A STRONG SMELL?', 'DOES IT SMELL GOOD?', 'DOES IT SMELL BAD?', 'IS IT USUALLY INSIDE?', 'IS IT USUALLY OUTSIDE?', 'WOULD YOU FIND IT ON A FARM?', 'WOULD YOU FIND IT IN A SCHOOL?', 'WOULD YOU FIND IT IN A ZOO?', 'WOULD YOU FIND IT IN AN OFFICE?', 'WOULD YOU FIND IT IN A RESTAURANT?', 'WOULD YOU FIND IN THE BATHROOM?', 'WOULD YOU FIND IT IN A HOUSE?', 'WOULD YOU FIND IT NEAR A ROAD?', 'WOULD YOU FIND IT IN A DUMP/LANDFILL?', 'WOULD YOU FIND IT IN THE FOREST?', 'WOULD YOU FIND IT IN A GARDEN?', 'WOULD YOU FIND IT IN THE SKY?', 'DO YOU FIND IT IN SPACE?', 'DOES IT LIVE ABOVE GROUND?', 'DOES IT GET WET?', 'DOES IT LIVE IN WATER?', 'CAN IT LIVE OUT OF WATER?', 'DO YOU TAKE CARE OF IT?', 'DOES IT MAKE YOU HAPPY?', 'DO YOU LOVE IT?', 'WOULD YOU MISS IT IF IT WERE GONE?', 'IS IT SCARY?', 'IS IT DANGEROUS?', 'IS IT FRIENDLY?', 'IS IT RARE?', 'CAN YOU BUY IT?', 'IS IT VALUABLE?'];
	var objects = ['bear', 'cat', 'cow', 'dog', 'horse', 'arm', 'eye', 'foot', 'hand', 'leg', 'apartment', 'barn', 'church', 'house', 'igloo', 'arch', 'chimney', 'closet', 'door', 'window', 'coat', 'dress', 'pants', 'shirt', 'skirt', 'bed', 'chair', 'desk', 'dresser', 'table', 'ant', 'bee', 'beetle', 'butterfly', 'fly', 'bottle', 'cup', 'glass', 'knife', 'spoon', 'bell', 'key', 'refrigerator', 'telephone', 'watch', 'chisel', 'hammer', 'pliers', 'saw', 'screwdriver', 'carrot', 'celery', 'corn', 'lettuce', 'tomato', 'airplane', 'bicycle', 'car', 'train', 'truck', 'wax', 'chain', 'wall', 'speck', 'card', 'honey', 'trail', 'sofa', 'walrus', 'pizza', 'surf', 'typewriter', 'powder', 'shark', 'scar', 'pipe', 'chin', 'reptile', 'artichoke', 'backpack', 'bomb', 'stingray', 'fire', 'volcano', 'aspirin', 'island', 'gravel', 'shoulder', 'soup', 'lightning', 'jet', 'pickle', 'rib', 'sedan', 'pint', 'chapel', 'bumper', 'lip', 'wart', 'notebook', 'crocodile', 'seat', 'lock', 'raspberry', 'ticket', 'walnut', 'monkey', 'cast', 'dolphin', 'submarine', 'staircase', 'tshirt', 'gallon', 'disinfectant', 'pan', 'lamb', 'gas', 'straw', 'note', 'mosquito', 'earth', 'grasshopper', 'mushroom', 'beet', 'bark', 'meat', 'sleigh', 'umbrella', 'camel', 'ladder', 'alley', 'channel', 'soil', 'fence', 'mattress', 'drink', 'quilt', 'screw', 'billboard', 'dagger', 'cave', 'store', 'milk', 'yard', 'jeep', 'breakfast', 'water', 'acorn', 'sky', 'steam', 'tear', 'bin', 'handrail', 'spear', 'town', 'clipboard', 'carton', 'teeth', 'moth', 'carpet', 'garlic', 'lung', 'harbour', 'dent', 'button', 'cloud', 'hoe', 'banana', 'vein', 'lime', 'library', 'fork', 'toe', 'bubble', 'slush', 'guardrail', 'diamond', 'hay', 'boat', 'camp', 'valley', 'napkin', 'dandelion', 'stew', 'almond', 'axle', 'pillow', 'rust', 'pig', 'money', 'eyebrow', 'school', 'cola', 'quarter', 'clothing', 'gold', 'paste', 'slipper', 'bench', 'tuba', 'skyscraper', 'lemonade', 'iris', 'journal', 'fat', 'lotion', 'lunch', 'stem', 'phone', 'grass', 'stadium', 'menu', 'garbage', 'uniform', 'cord', 'fan', 'ladle', 'dance', 'sunglasses', 'crumb', 'child', 'cucumber', 'ipod', 'feet', 'tribe', 'iceberg', 'toothbrush', 'ivy', 'brush', 'hedge', 'octopus', 'drain', 'rice', 'building', 'eyelash', 'hotel', 'locker', 'birch', 'spice', 'armrest', 'rug', 'letter', 'needle', 'deck', 'kite', 'watermelon', 'moccasins', 'lever', 'hair', 'woman', 'thigh', 'tractor', 'spade', 'boot', 'dot', 'food', 'canteen', 'rock', 'breast', 'pineapple', 'sleeve', 'river', 'tongue', 'flute', 'rash', 'arrow', 'scarf', 'liquid', 'laundry', 'tooth', 'paint', 'tablespoon', 'necktie', 'clothes', 'floss', 'thread', 'aquarium', 'chestnut', 'whisker', 'rifle', 'liquor', 'ladybug', 'basket', 'propeller', 'beard', 'male', 'body', 'step', 'rocket', 'caterpillar', 'planet', 'mail', 'whip', 'pill', 'kettle', 'insect', 'stone', 'bible', 'cancer', 'gum', 'strawberry', 'sponge', 'handle', 'maple', 'hippo', 'plane', 'peacock', 'encyclopedia', 'wine', 'bread', 'gorilla', 'fries', 'bank', 'sand', 'dumpster', 'hood', 'moon', 'van', 'hog', 'windshield', 'rattlesnake', 'rake', 'cinnamon', 'calf', 'zipper', 'asparagus', 'mug', 'thermometer', 'pond', 'cocktail', 'goldfish', 'kitten', 'wife', 'certificate', 'photograph', 'coffee', 'hyena', 'lawn', 'bush', 'oar', 'crystal', 'nickel', 'ditch', 'elephant', 'panties', 'driveway', 'stomach', 'wind', 'fruit', 'nose', 'breeze', 'tornado', 'tent', 'doorway', 'ocean', 'antique', 'husband', 'chalkboard', 'circus', 'hook', 'onion', 'railroad', 'rat', 'penny', 'asphalt', 'bean', 'meatballs', 'heart', 'wedding', 'flagpole', 'brain', 'sled', 'hospital', 'cement', 'earphones', 'jail', 'market', 'kilt', 'magnet', 'vegetable', 'penguin', 'wallpaper', 'potato', 'yoke', 'popcorn', 'racquet', 'beak', 'dock', 'crow', 'sunshine', 'smile', 'poster', 'grapefruit', 'groin', 'trash', 'accordion', 'human', 'knee', 'skate', 'flag', 'lake', 'atom', 'lamp', 'cd', 'frisbee', 'owl', 'coffin', 'sandal', 'dime', 'shore', 'earthworms', 'blood', 'necklace', 'pudding', 'mixer', 'hut', 'phonebook', 'pie', 'pencil', 'vest', 'corridor', 'rhinoceros', 'dart', 'bus', 'oven', 'juice', 'kitchen', 'platter', 'skateboard', 'gang', 'playground', 'hill', 'sun', 'street', 'dollar', 'painting', 'net', 'minivan', 'pole', 'fireplace', 'burner', 'vacuum', 'piano', 'lap', 'mist', 'frame', 'missile', 'robot', 'mannequin', 'wrench', 'cream', 'branch', 'broccoli', 'bay', 'head', 'glove', 'shoestring', 'peach', 'skin', 'tweezers', 'wheel', 'coin', 'wreckage', 'raindrops', 'bluebird', 'map', 'meal', 'tail', 'gym', 'saxophone', 'mailbox', 'fuel', 'cattle', 'doughnut', 'seed', 'dictionary', 'jaw', 'salmon', 'haddock', 'puddle', 'receipt', 'jar', 'floor', 'dust', 'computer', 'stick', 'throne', 'gun', 'ham', 'squirrel', 'grape', 'soda', 'flannel', 'pool', 'iron', 'streetlights', 'sidewalk', 'tangerine', 'world', 'magazine', 'oak', 'cereal', 'seagull', 'stool', 'sock', 'fish', 'meteor', 'bucket', 'cannon', 'potholes', 'lint', 'cockroach', 'linen', 'mitt', 'surfboard', 'muffler', 'tulip', 'raisins', 'newspaper', 'star', 'racket', 'wool', 'academy', 'tea', 'worm', 'mat', 'laptop', 'spider', 'curb', 'lion', 'toilet', 'supper', 'sandwich', 'novel', 'dinosaur', 'poison', 'pawn', 'platform', 'rose', 'thunderbolt', 'wig', 'sink', 'nest', 'trumpet', 'nerve', 'butter', 'lawnmower', 'supermarket', 'cotton', 'mouse', 'ashtray', 'glacier', 'balloon', 'collar', 'buttocks', 'continent', 'cash', 'cockpit', 'avenue', 'earring', 'milkshake', 'radio', 'lips', 'microwave', 'jersey', 'cabbage', 'limb', 'sweater', 'television', 'cork', 'museum', 'pepperoni', 'hockey', 'violin', 'berry', 'brake', 'carnation', 'cherry', 'park', 'nail', 'bandage', 'tunnel', 'rooster', 'salt', 'bathtub', 'taco', 'wink', 'sword', 'macaroni', 'cigar', 'candle', 'gallery', 'university', 'farm', 'essay', 'flower', 'koala', 'pigeon', 'appliance', 'sunburn', 'mud', 'sweatshirt', 'fur', 'jewel', 'barrel', 'pocket', 'toaster', 'bullet', 'wood', 'restaurant', 'zoo', 'egg', 'herb', 'knuckle', 'bouquet', 'cigarette', 'giraffe', 'basement', 'man', 'football', 'chocolate', 'cottage', 'toothpick', 'pot', 'toy', 'boy', 'salamander', 'muscle', 'office', 'candy', 'court', 'tire', 'bedroom', 'diaper', 'jam', 'alligator', 'toast', 'blueberry', 'kid', 'box', 'yak', 'flour', 'fabric', 'bathrobe', 'face', 'bacon', 'livingroom', 'shoe', 'pear', 'blanket', 'belt', 'toothpaste', 'briefcase', 'fox', 'engine', 'scooter', 'alcohol', 'ball', 'pollen', 'ostrich', 'syrup', 'rope', 'revolver', 'smoke', 'eggplant', 'mouth', 'hall', 'slide', 'forest', 'package', 'sausage', 'bra', 'calculator', 'mop', 'leaf', 'thumb', 'sparrow', 'sailboat', 'band', 'beef', 'blade', 'spark', 'vase', 'pumpkin', 'canal', 'bulldozer', 'flea', 'seal', 'nightgown', 'sauce', 'dandruff', 'salad', 'weed', 'bird', 'glue', 'golf', 'purse', 'oil', 'goat', 'cookie', 'slope', 'motor', 'person', 'cauliflower', 'snail', 'bowl', 'deer', 'medal', 'blossom', 'headlight', 'bracelet', 'snow', 'elevator', 'otter', 'wave', 'racetrack', 'shed', 'cellphone', 'broom', 'twig', 'coast', 'drum', 'spaghetti', 'leopard', 'eagle', 'attic', 'keg', 'page', 'basin', 'finger', 'skunk', 'rainstorm', 'cafe', 'camera', 'blouse', 'aisle', 'horn', 'pit', 'medicine', 'bridge', 'pedal', 'cake', 'book', 'chicken', 'column', 'hydrant', 'fingernail', 'cradle', 'disease', 'tie', 'razor', 'club', 'couch', 'belly', 'resort', 'film', 'cheese', 'parrot', 'wolf', 'donkey', 'hamburger', 'beer', 'puppy', 'hawk', 'windmill', 'parcel', 'cemetary', 'grave', 'chalk', 'sheep', 'telescope', 'garden', 'quart', 'entrance', 'measles', 'stream', 'fog', 'factory', 'kernel', 'honeymoon', 'gift', 'theater', 'scab', 'ice', 'cactus', 'ape', 'elbow', 'pin', 'deodorant', 'shop', 'ship', 'saucer', 'scarecrow', 'projector', 'knob', 'countertop', 'bone', 'stocking', 'cheek', 'pocketbook', 'tiger', 'ravine', 'ceiling', 'vulture', 'mirror', 'stable', 'sea', 'mansion', 'flame', 'mittens', 'handkerchief', 'highway', 'cliff', 'doll', 'anchor', 'trombone', 'pine', 'turtle', 'tree', 'jacket', 'dome', 'seaweed', 'beach', 'shrimp', 'pony', 'road', 'pet', 'hole', 'steak', 'stapler', 'soap', 'sweat', 'lizard', 'pen', 'volleyball', 'jelly', 'pearl', 'gazelle', 'yogurt', 'crowd', 'pimple', 'outfit', 'ground', 'apple', 'home', 'clover', 'roof', 'goose', 'sugar', 'sack', 'ketchup', 'mustard', 'chopsticks', 'wallet', 'drug', 'trophy', 'cricket', 'gown', 'pepper', 'clam', 'back', 'rollercoaster', 'fudge', 'plate', 'greenhouse', 'pea', 'ankle', 'towel', 'scissors', 'stair', 'gravy', 'paper', 'neck', 'meadow', 'ear', 'dirt', 'cupboard', 'spool', 'wire', 'microscope', 'biscuit', 'urinal', 'ambulance', 'pupil', 'sneaker', 'microphone', 'thorn', 'tobacco', 'crayon', 'clock', 'auditorium', 'breath', 'pancake', 'utensil', 'heel', 'wing', 'village', 'chip', 'womb', 'shovel', 'forehead', 'plug', 'dinner', 'envelope', 'helicopter', 'seashell', 'motorcycle', 'noodle', 'lunchbox', 'beverage', 'robin', 'yarn', 'gate', 'whale', 'throat', 'keyboard', 'helmet', 'cranberry', 'cage', 'feather', 'room', 'snake', 'rabbit', 'sundial', 'ski', 'axe', 'graph', 'root', 'crown', 'duck', 'lane', 'party', 'cider', 'stove', 'brick', 'cloth', 'boulder', 'lightbulb', 'college', 'toad', 'baby', 'mouthpiece', 'skull', 'city', 'freezer', 'loudspeaker', 'peanut', 'guitar', 'liver', 'ink', 'zebra', 'stain', 'lemon', 'capitol', 'trout', 'tray', 'ring', 'frog', 'underwear', 'cabin', 'ruler', 'pickup', 'sign', 'handbag', 'seam', 'string', 'mountain', 'whiteboard', 'moose', 'flesh', 'parade', 'girl', 'sewer', 'hen', 'limousine', 'raccoon', 'wheat', 'flashlight', 'satellite', 'waist', 'plum', 'earplugs', 'daisy', 'ribbon', 'pasta', 'oatmeal', 'plank', 'bagel', 'furniture', 'kangaroo', 'buffalo', 'ox', 'unicorn', 'bull', 'antelope', 'goblet', 'lobster', 'freckles', 'comb', 'ghost'];
	
	var question = questions[Math.floor(Math.random()*questions.length)];
	var object = objects[Math.floor(Math.random()*objects.length)];
	console.log("loading page");
	psiTurk.showPage('stage.html');

	document.getElementById("question").innerHTML = "Question: " + question;
	document.getElementById("object").innerHTML = "Object: " + object;
};

var finish = function(answer) {
	var question = document.getElementById("question").
					innerHTML.substring(("Question: ").length); //otherwise won't be pure data
	var object = document.getElementById("object").
					innerHTML.substring(("Object: ").length);
	console.log(question + " " + object);
	psiTurk.recordTrialData([question, object, answer]);
	psiTurk.saveData();
	complete();
};

var complete = function() {
	psiTurk.showPage('complete.html');
	psiTurk.completeHIT();
}

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.finishInstructions();
    QuestionExperiment();
});
