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
	"instructions/instruct-ready.html",
	"stage.html",
    "post_questionnaire.html",
	"complete.html"
];

var instructionPages = [
	"instructions/instruct-ready.html"
];

psiTurk.preloadPages(pages);

var xmlhttp, text;
xmlhttp = new XMLHttpRequest();
xmlhttp.open('GET', '/static/files/question_object_pairs.txt', false);
xmlhttp.send();
text = xmlhttp.responseText;
var lines = text.split('\n');
var question_object_pairs = [];
for(var line in lines) {
    question_object_pairs.push(lines[line].split(","));
}


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

var numTimesRun = 0;
var answersToCollect = 100;
;

/********************
* ASK QUESTION      *
********************/
var QuestionExperiment = function() {
	var questions = ['IS IT AN ANIMAL?', 'IS IT A BODY PART?', 'IS IT A BUILDING?', 'IS IT A BUILDING PART?', 'IS IT CLOTHING?', 'IS IT FURNITURE?', 'IS IT AN INSECT?', 'IS IT A KITCHEN ITEM?', 'IS IT MANMADE?', 'IS IT A TOOL?', 'CAN YOU EAT IT?', 'IS IT A VEHICLE?', 'IS IT A PERSON?', 'IS IT A VEGETABLE / PLANT?', 'IS IT A FRUIT?', 'IS IT MADE OF METAL?', 'IS IT MADE OF PLASTIC?', 'IS PART OF IT MADE OF GLASS?', 'IS IT MADE OF WOOD?', 'IS IT SHINY?', 'CAN YOU SEE THROUGH IT?', 'IS IT COLORFUL?', 'DOES IT CHANGE COLOR?', 'IS ONE MORE THAN ONE COLORED?', 'IS IT ALWAYS THE SAME COLOR(S)?', 'IS IT WHITE?', 'IS IT RED?', 'IS IT ORANGE?', 'IS IT FLESH-COLORED?', 'IS IT YELLOW?', 'IS IT GREEN?', 'IS IT BLUE?', 'IS IT SILVER?', 'IS IT BROWN?', 'IS IT BLACK?', 'IS IT CURVED?', 'IS IT STRAIGHT?', 'IS IT FLAT?', 'DOES IT HAVE A FRONT AND A BACK?', 'DOES IT HAVE A FLAT / STRAIGHT TOP?', 'DOES IT HAVE FLAT / STRAIGHT SIDES?', 'IS TALLER THAN IT IS WIDE/LONG?', 'IS IT LONG?', 'IS IT POINTED / SHARP?', 'IS IT TAPERED?', 'IS IT ROUND?', 'DOES IT HAVE CORNERS?', 'IS IT SYMMETRICAL?', 'IS IT HAIRY?', 'IS IT FUZZY?', 'IS IT CLEAR?', 'IS IT SMOOTH?', 'IS IT SOFT?', 'IS IT HEAVY?', 'IS IT LIGHTWEIGHT?', 'IS IT DENSE?', 'IS IT SLIPPERY?', 'CAN IT CHANGE SHAPE?', 'CAN IT BEND?', 'CAN IT STRETCH?', 'CAN IT BREAK?', 'IS IT FRAGILE?', 'DOES IT HAVE PARTS?', 'DOES IT HAVE MOVING PARTS?', 'DOES IT COME IN PAIRS?', 'DOES IT COME IN A BUNCH/PACK?', 'DOES IT LIVE IN GROUPS?', 'IS IT PART OF SOMETHING LARGER?', 'DOES IT CONTAIN SOMETHING ELSE?', 'DOES IT HAVE INTERNAL STRUCTURE?', 'DOES IT OPEN?', 'IS IT HOLLOW?', 'DOES IT HAVE A HARD INSIDE?', 'DOES IT HAVE A HARD OUTER SHELL?', 'DOES IT HAVE AT LEAST ONE HOLE?', 'IS IT ALIVE?', 'WAS IT EVER ALIVE?', 'IS IT A SPECIFIC GENDER?', 'IS IT MANUFACTURED?', 'WAS IT INVENTED?', 'WAS IT AROUND 100 YEARS AGO?', 'ARE THERE MANY VARIETIES OF IT?', 'DOES IT COME IN DIFFERENT SIZES?', 'DOES IT GROW?', 'IS IT SMALLER THAN A GOLFBALL?', 'IS IT BIGGER THAN A LOAF OF BREAD?', 'IS IT BIGGER THAN A MICROWAVE OVEN?', 'IS IT BIGGER THAN A BED?', 'IS IT BIGGER THAN A CAR?', 'IS IT BIGGER THAN A HOUSE?', 'IS IT TALLER THAN A PERSON?', 'DOES IT HAVE A TAIL?', 'DOES IT HAVE LEGS?', 'DOES IT HAVE FOUR LEGS?', 'DOES IT HAVE FEET?', 'DOES IT HAVE PAWS?', 'DOES IT HAVE CLAWS?', 'DOES IT HAVE HORNS / THORNS / SPIKES?', 'DOES IT HAVE HOOVES?', 'DOES IT HAVE A FACE?', 'DOES IT HAVE A BACKBONE?', 'DOES IT HAVE WINGS?', 'DOES IT HAVE EARS?', 'DOES IT HAVE ROOTS?', 'DOES IT HAVE SEEDS?', 'DOES IT HAVE LEAVES?', 'DOES IT COME FROM A PLANT?', 'DOES IT HAVE FEATHERS?', 'DOES IT HAVE SOME SORT OF NOSE?', 'DOES IT HAVE A HARD NOSE/BEAK?', 'DOES IT CONTAIN LIQUID?', 'DOES IT HAVE WIRES OR A CORD?', 'DOES IT HAVE WRITING ON IT?', 'DOES IT HAVE WHEELS?', 'DOES IT MAKE A SOUND?', 'DOES IT MAKE A NICE SOUND?', 'DOES IT MAKE SOUND CONTINUOUSLY WHEN ACTIVE?', 'IS ITS JOB TO MAKE SOUNDS?', 'DOES IT ROLL?', 'CAN IT RUN?', 'IS IT FAST?', 'CAN IT FLY?', 'CAN IT JUMP?', 'CAN IT FLOAT?', 'CAN IT SWIM?', 'CAN IT DIG?', 'CAN IT CLIMB TREES?', 'CAN IT CAUSE YOU PAIN?', 'CAN IT BITE OR STING?', 'DOES IT STAND ON TWO LEGS?', 'IS IT WILD?', 'IS IT A HERBIVORE?', 'IS IT A PREDATOR?', 'IS IT WARM BLOODED?', 'IS IT A MAMMAL?', 'IS IT NOCTURNAL?', 'DOES IT LAY EGGS?', 'IS IT CONSCIOUS?', 'DOES IT HAVE FEELINGS?', 'IS IT SMART?', 'IS IT MECHANICAL?', 'IS IT ELECTRONIC?', 'DOES IT USE ELECTRICITY?', 'CAN IT KEEP YOU DRY?', 'DOES IT PROVIDE PROTECTION?', 'DOES IT PROVIDE SHADE?', 'DOES IT CAST A SHADOW?', 'DO YOU SEE IT DAILY?', 'IS IT HELPFUL?', 'DO YOU INTERACT WITH IT?', 'CAN YOU TOUCH IT?', 'WOULD YOU AVOID TOUCHING IT?', 'CAN YOU HOLD IT?', 'CAN YOU HOLD IT IN ONE HAND?', 'DO YOU HOLD IT TO USE IT?', 'CAN YOU PLAY IT?', 'CAN YOU PLAY WITH IT?', 'CAN YOU PET IT?', 'CAN YOU USE IT?', 'DO YOU USE IT DAILY?', 'CAN YOU USE IT UP?', 'DO YOU USE IT WHEN COOKING?', 'IS IT USED TO CARRY THINGS?', 'CAN YOU PICK IT UP?', 'CAN YOU CONTROL IT?', 'CAN YOU SIT ON IT?', 'CAN YOU RIDE ON/IN IT?', 'IS IT USED FOR TRANSPORTATION?', 'COULD YOU FIT INSIDE IT?', 'IS IT USED IN SPORTS?', 'DO YOU WEAR IT?', 'CAN IT BE WASHED?', 'IS IT COLD?', 'IS IT COOL?', 'IS IT WARM?', 'IS IT HOT?', 'IS IT UNHEALTHY?', 'IS IT HARD TO CATCH?', 'CAN YOU PEEL IT?', 'CAN YOU WALK ON IT?', 'CAN YOU SWITCH IT ON AND OFF?', 'CAN IT BE EASILY MOVED?', 'DO YOU DRINK FROM IT?', 'DOES IT GO IN YOUR MOUTH?', 'IS IT TASTY?', 'IS IT USED DURING MEALS?', 'DOES IT HAVE A STRONG SMELL?', 'DOES IT SMELL GOOD?', 'DOES IT SMELL BAD?', 'IS IT USUALLY INSIDE?', 'IS IT USUALLY OUTSIDE?', 'WOULD YOU FIND IT ON A FARM?', 'WOULD YOU FIND IT IN A SCHOOL?', 'WOULD YOU FIND IT IN A ZOO?', 'WOULD YOU FIND IT IN AN OFFICE?', 'WOULD YOU FIND IT IN A RESTAURANT?', 'WOULD YOU FIND IN THE BATHROOM?', 'WOULD YOU FIND IT IN A HOUSE?', 'WOULD YOU FIND IT NEAR A ROAD?', 'WOULD YOU FIND IT IN A DUMP/LANDFILL?', 'WOULD YOU FIND IT IN THE FOREST?', 'WOULD YOU FIND IT IN A GARDEN?', 'WOULD YOU FIND IT IN THE SKY?', 'DO YOU FIND IT IN SPACE?', 'DOES IT LIVE ABOVE GROUND?', 'DOES IT GET WET?', 'DOES IT LIVE IN WATER?', 'CAN IT LIVE OUT OF WATER?', 'DO YOU TAKE CARE OF IT?', 'DOES IT MAKE YOU HAPPY?', 'DO YOU LOVE IT?', 'WOULD YOU MISS IT IF IT WERE GONE?', 'IS IT SCARY?', 'IS IT DANGEROUS?', 'IS IT FRIENDLY?', 'IS IT RARE?', 'CAN YOU BUY IT?', 'IS IT VALUABLE?'];
	var objects = ['bear', 'cat', 'cow', 'dog', 'horse', 'arm', 'eye', 'foot', 'hand', 'leg', 'apartment', 'barn', 'church', 'house', 'igloo', 'arch', 'chimney', 'closet', 'door', 'window', 'coat', 'dress', 'pants', 'shirt', 'skirt', 'bed', 'chair', 'desk', 'dresser', 'table', 'ant', 'bee', 'beetle', 'butterfly', 'fly', 'bottle', 'cup', 'glass', 'knife', 'spoon', 'bell', 'key', 'refrigerator', 'telephone', 'watch', 'chisel', 'hammer', 'pliers', 'saw', 'screwdriver', 'carrot', 'celery', 'corn', 'lettuce', 'tomato', 'airplane', 'bicycle', 'car', 'train', 'truck', 'wax', 'chain', 'wall', 'speck', 'card', 'honey', 'trail', 'sofa', 'walrus', 'pizza', 'surf', 'typewriter', 'powder', 'shark', 'scar', 'pipe', 'chin', 'reptile', 'artichoke', 'backpack', 'bomb', 'stingray', 'fire', 'volcano', 'aspirin', 'island', 'gravel', 'shoulder', 'soup', 'lightning', 'jet', 'pickle', 'rib', 'sedan', 'pint', 'chapel', 'bumper', 'lip', 'wart', 'notebook', 'crocodile', 'seat', 'lock', 'raspberry', 'ticket', 'walnut', 'monkey', 'cast', 'dolphin', 'submarine', 'staircase', 'tshirt', 'gallon', 'disinfectant', 'pan', 'lamb', 'gas', 'straw', 'note', 'mosquito', 'earth', 'grasshopper', 'mushroom', 'beet', 'bark', 'meat', 'sleigh', 'umbrella', 'camel', 'ladder', 'alley', 'channel', 'soil', 'fence', 'mattress', 'drink', 'quilt', 'screw', 'billboard', 'dagger', 'cave', 'store', 'milk', 'yard', 'jeep', 'breakfast', 'water', 'acorn', 'sky', 'steam', 'tear', 'bin', 'handrail', 'spear', 'town', 'clipboard', 'carton', 'teeth', 'moth', 'carpet', 'garlic', 'lung', 'harbour', 'dent', 'button', 'cloud', 'hoe', 'banana', 'vein', 'lime', 'library', 'fork', 'toe', 'bubble', 'slush', 'guardrail', 'diamond', 'hay', 'boat', 'camp', 'valley', 'napkin', 'dandelion', 'stew', 'almond', 'axle', 'pillow', 'rust', 'pig', 'money', 'eyebrow', 'school', 'cola', 'quarter', 'clothing', 'gold', 'paste', 'slipper', 'bench', 'tuba', 'skyscraper', 'lemonade', 'iris', 'journal', 'fat', 'lotion', 'lunch', 'stem', 'phone', 'grass', 'stadium', 'menu', 'garbage', 'uniform', 'cord', 'fan', 'ladle', 'dance', 'sunglasses', 'crumb', 'child', 'cucumber', 'ipod', 'feet', 'tribe', 'iceberg', 'toothbrush', 'ivy', 'brush', 'hedge', 'octopus', 'drain', 'rice', 'building', 'eyelash', 'hotel', 'locker', 'birch', 'spice', 'armrest', 'rug', 'letter', 'needle', 'deck', 'kite', 'watermelon', 'moccasins', 'lever', 'hair', 'woman', 'thigh', 'tractor', 'spade', 'boot', 'dot', 'food', 'canteen', 'rock', 'breast', 'pineapple', 'sleeve', 'river', 'tongue', 'flute', 'rash', 'arrow', 'scarf', 'liquid', 'laundry', 'tooth', 'paint', 'tablespoon', 'necktie', 'clothes', 'floss', 'thread', 'aquarium', 'chestnut', 'whisker', 'rifle', 'liquor', 'ladybug', 'basket', 'propeller', 'beard', 'male', 'body', 'step', 'rocket', 'caterpillar', 'planet', 'mail', 'whip', 'pill', 'kettle', 'insect', 'stone', 'bible', 'cancer', 'gum', 'strawberry', 'sponge', 'handle', 'maple', 'hippo', 'plane', 'peacock', 'encyclopedia', 'wine', 'bread', 'gorilla', 'fries', 'bank', 'sand', 'dumpster', 'hood', 'moon', 'van', 'hog', 'windshield', 'rattlesnake', 'rake', 'cinnamon', 'calf', 'zipper', 'asparagus', 'mug', 'thermometer', 'pond', 'cocktail', 'goldfish', 'kitten', 'wife', 'certificate', 'photograph', 'coffee', 'hyena', 'lawn', 'bush', 'oar', 'crystal', 'nickel', 'ditch', 'elephant', 'panties', 'driveway', 'stomach', 'wind', 'fruit', 'nose', 'breeze', 'tornado', 'tent', 'doorway', 'ocean', 'antique', 'husband', 'chalkboard', 'circus', 'hook', 'onion', 'railroad', 'rat', 'penny', 'asphalt', 'bean', 'meatballs', 'heart', 'wedding', 'flagpole', 'brain', 'sled', 'hospital', 'cement', 'earphones', 'jail', 'market', 'kilt', 'magnet', 'vegetable', 'penguin', 'wallpaper', 'potato', 'yoke', 'popcorn', 'racquet', 'beak', 'dock', 'crow', 'sunshine', 'smile', 'poster', 'grapefruit', 'groin', 'trash', 'accordion', 'human', 'knee', 'skate', 'flag', 'lake', 'atom', 'lamp', 'cd', 'frisbee', 'owl', 'coffin', 'sandal', 'dime', 'shore', 'earthworms', 'blood', 'necklace', 'pudding', 'mixer', 'hut', 'phonebook', 'pie', 'pencil', 'vest', 'corridor', 'rhinoceros', 'dart', 'bus', 'oven', 'juice', 'kitchen', 'platter', 'skateboard', 'gang', 'playground', 'hill', 'sun', 'street', 'dollar', 'painting', 'net', 'minivan', 'pole', 'fireplace', 'burner', 'vacuum', 'piano', 'lap', 'mist', 'frame', 'missile', 'robot', 'mannequin', 'wrench', 'cream', 'branch', 'broccoli', 'bay', 'head', 'glove', 'shoestring', 'peach', 'skin', 'tweezers', 'wheel', 'coin', 'wreckage', 'raindrops', 'bluebird', 'map', 'meal', 'tail', 'gym', 'saxophone', 'mailbox', 'fuel', 'cattle', 'doughnut', 'seed', 'dictionary', 'jaw', 'salmon', 'haddock', 'puddle', 'receipt', 'jar', 'floor', 'dust', 'computer', 'stick', 'throne', 'gun', 'ham', 'squirrel', 'grape', 'soda', 'flannel', 'pool', 'iron', 'streetlights', 'sidewalk', 'tangerine', 'world', 'magazine', 'oak', 'cereal', 'seagull', 'stool', 'sock', 'fish', 'meteor', 'bucket', 'cannon', 'potholes', 'lint', 'cockroach', 'linen', 'mitt', 'surfboard', 'muffler', 'tulip', 'raisins', 'newspaper', 'star', 'racket', 'wool', 'academy', 'tea', 'worm', 'mat', 'laptop', 'spider', 'curb', 'lion', 'toilet', 'supper', 'sandwich', 'novel', 'dinosaur', 'poison', 'pawn', 'platform', 'rose', 'thunderbolt', 'wig', 'sink', 'nest', 'trumpet', 'nerve', 'butter', 'lawnmower', 'supermarket', 'cotton', 'mouse', 'ashtray', 'glacier', 'balloon', 'collar', 'buttocks', 'continent', 'cash', 'cockpit', 'avenue', 'earring', 'milkshake', 'radio', 'lips', 'microwave', 'jersey', 'cabbage', 'limb', 'sweater', 'television', 'cork', 'museum', 'pepperoni', 'hockey', 'violin', 'berry', 'brake', 'carnation', 'cherry', 'park', 'nail', 'bandage', 'tunnel', 'rooster', 'salt', 'bathtub', 'taco', 'wink', 'sword', 'macaroni', 'cigar', 'candle', 'gallery', 'university', 'farm', 'essay', 'flower', 'koala', 'pigeon', 'appliance', 'sunburn', 'mud', 'sweatshirt', 'fur', 'jewel', 'barrel', 'pocket', 'toaster', 'bullet', 'wood', 'restaurant', 'zoo', 'egg', 'herb', 'knuckle', 'bouquet', 'cigarette', 'giraffe', 'basement', 'man', 'football', 'chocolate', 'cottage', 'toothpick', 'pot', 'toy', 'boy', 'salamander', 'muscle', 'office', 'candy', 'court', 'tire', 'bedroom', 'diaper', 'jam', 'alligator', 'toast', 'blueberry', 'kid', 'box', 'yak', 'flour', 'fabric', 'bathrobe', 'face', 'bacon', 'livingroom', 'shoe', 'pear', 'blanket', 'belt', 'toothpaste', 'briefcase', 'fox', 'engine', 'scooter', 'alcohol', 'ball', 'pollen', 'ostrich', 'syrup', 'rope', 'revolver', 'smoke', 'eggplant', 'mouth', 'hall', 'slide', 'forest', 'package', 'sausage', 'bra', 'calculator', 'mop', 'leaf', 'thumb', 'sparrow', 'sailboat', 'band', 'beef', 'blade', 'spark', 'vase', 'pumpkin', 'canal', 'bulldozer', 'flea', 'seal', 'nightgown', 'sauce', 'dandruff', 'salad', 'weed', 'bird', 'glue', 'golf', 'purse', 'oil', 'goat', 'cookie', 'slope', 'motor', 'person', 'cauliflower', 'snail', 'bowl', 'deer', 'medal', 'blossom', 'headlight', 'bracelet', 'snow', 'elevator', 'otter', 'wave', 'racetrack', 'shed', 'cellphone', 'broom', 'twig', 'coast', 'drum', 'spaghetti', 'leopard', 'eagle', 'attic', 'keg', 'page', 'basin', 'finger', 'skunk', 'rainstorm', 'cafe', 'camera', 'blouse', 'aisle', 'horn', 'pit', 'medicine', 'bridge', 'pedal', 'cake', 'book', 'chicken', 'column', 'hydrant', 'fingernail', 'cradle', 'disease', 'tie', 'razor', 'club', 'couch', 'belly', 'resort', 'film', 'cheese', 'parrot', 'wolf', 'donkey', 'hamburger', 'beer', 'puppy', 'hawk', 'windmill', 'parcel', 'cemetary', 'grave', 'chalk', 'sheep', 'telescope', 'garden', 'quart', 'entrance', 'measles', 'stream', 'fog', 'factory', 'kernel', 'honeymoon', 'gift', 'theater', 'scab', 'ice', 'cactus', 'ape', 'elbow', 'pin', 'deodorant', 'shop', 'ship', 'saucer', 'scarecrow', 'projector', 'knob', 'countertop', 'bone', 'stocking', 'cheek', 'pocketbook', 'tiger', 'ravine', 'ceiling', 'vulture', 'mirror', 'stable', 'sea', 'mansion', 'flame', 'mittens', 'handkerchief', 'highway', 'cliff', 'doll', 'anchor', 'trombone', 'pine', 'turtle', 'tree', 'jacket', 'dome', 'seaweed', 'beach', 'shrimp', 'pony', 'road', 'pet', 'hole', 'steak', 'stapler', 'soap', 'sweat', 'lizard', 'pen', 'volleyball', 'jelly', 'pearl', 'gazelle', 'yogurt', 'crowd', 'pimple', 'outfit', 'ground', 'apple', 'home', 'clover', 'roof', 'goose', 'sugar', 'sack', 'ketchup', 'mustard', 'chopsticks', 'wallet', 'drug', 'trophy', 'cricket', 'gown', 'pepper', 'clam', 'back', 'rollercoaster', 'fudge', 'plate', 'greenhouse', 'pea', 'ankle', 'towel', 'scissors', 'stair', 'gravy', 'paper', 'neck', 'meadow', 'ear', 'dirt', 'cupboard', 'spool', 'wire', 'microscope', 'biscuit', 'urinal', 'ambulance', 'pupil', 'sneaker', 'microphone', 'thorn', 'tobacco', 'crayon', 'clock', 'auditorium', 'breath', 'pancake', 'utensil', 'heel', 'wing', 'village', 'chip', 'womb', 'shovel', 'forehead', 'plug', 'dinner', 'envelope', 'helicopter', 'seashell', 'motorcycle', 'noodle', 'lunchbox', 'beverage', 'robin', 'yarn', 'gate', 'whale', 'throat', 'keyboard', 'helmet', 'cranberry', 'cage', 'feather', 'room', 'snake', 'rabbit', 'sundial', 'ski', 'axe', 'graph', 'root', 'crown', 'duck', 'lane', 'party', 'cider', 'stove', 'brick', 'cloth', 'boulder', 'lightbulb', 'college', 'toad', 'baby', 'mouthpiece', 'skull', 'city', 'freezer', 'loudspeaker', 'peanut', 'guitar', 'liver', 'ink', 'zebra', 'stain', 'lemon', 'capitol', 'trout', 'tray', 'ring', 'frog', 'underwear', 'cabin', 'ruler', 'pickup', 'sign', 'handbag', 'seam', 'string', 'mountain', 'whiteboard', 'moose', 'flesh', 'parade', 'girl', 'sewer', 'hen', 'limousine', 'raccoon', 'wheat', 'flashlight', 'satellite', 'waist', 'plum', 'earplugs', 'daisy', 'ribbon', 'pasta', 'oatmeal', 'plank', 'bagel', 'furniture', 'kangaroo', 'buffalo', 'ox', 'unicorn', 'bull', 'antelope', 'goblet', 'lobster', 'freckles', 'comb', 'ghost'];
	var pairs =  [[227, 106], [227, 150], [227, 106], [227, 104], [227, 126], [482, 109], [482, 49], [482, 137], [482, 127], [482, 100], [256, 93], [256, 49], [256, 133], [256, 126], [256, 106], [840, 39], [840, 103], [840, 37], [840, 60], [840, 8], [976, 182], [976, 173], [976, 194], [976, 15], [976, 15], [937, 61], [937, 60], [937, 68], [937, 73], [937, 78], [544, 168], [544, 131], [544, 11], [544, 193], [544, 2], [534, 168], [534, 65], [534, 29], [534, 171], [534, 217], [266, 205], [266, 147], [266, 194], [266, 39], [266, 33], [331, 97], [331, 84], [331, 166], [331, 71], [331, 79], [234, 177], [234, 32], [234, 156], [234, 81], [234, 82], [969, 51], [969, 200], [969, 58], [969, 52], [969, 217], [629, 23], [629, 147], [629, 195], [629, 21], [629, 54], [762, 126], [762, 63], [762, 63], [762, 135], [762, 192], [876, 26], [876, 68], [876, 5], [876, 32], [876, 112], [151, 8], [151, 78], [151, 146], [151, 150], [151, 70], [272, 4], [272, 181], [272, 216], [272, 8], [272, 216], [649, 58], [649, 58], [649, 38], [649, 38], [649, 171], [856, 166], [856, 72], [856, 170], [856, 187], [856, 72], [944, 206], [944, 10], [944, 137], [944, 184], [944, 49], [479, 33], [479, 87], [479, 47], [479, 65], [479, 25], [169, 217], [169, 112], [169, 72], [169, 84], [169, 159], [692, 165], [692, 130], [692, 58], [692, 198], [692, 207], [354, 90], [354, 52], [354, 198], [354, 198], [354, 21], [686, 28], [686, 116], [686, 172], [686, 52], [686, 58], [908, 74], [908, 15], [908, 9], [908, 172], [908, 34], [831, 101], [831, 39], [831, 133], [831, 207], [831, 70], [196, 206], [196, 185], [196, 73], [196, 144], [196, 112], [559, 54], [559, 171], [559, 181], [559, 64], [559, 81], [903, 152], [903, 78], [903, 152], [903, 54], [903, 158], [306, 181], [306, 174], [306, 181], [306, 58], [306, 177], [403, 118], [403, 164], [403, 33], [403, 67], [403, 164], [956, 50], [956, 26], [956, 26], [956, 28], [956, 127], [743, 30], [743, 132], [743, 39], [743, 202], [743, 30], [153, 190], [153, 86], [153, 8], [153, 164], [153, 78], [404, 143], [404, 31], [404, 202], [404, 191], [404, 32], [877, 81], [877, 197], [877, 81], [877, 40], [877, 197], [342, 205], [342, 85], [342, 82], [342, 205], [342, 85], [11, 214], [11, 31], [11, 114], [11, 21], [11, 30], [654, 216], [654, 167], [654, 111], [654, 62], [654, 73], [19, 20], [6, 20], [218, 20], [319, 20], [150, 20], [150, 20], [770, 20], [19, 20], [37, 20], [436, 20], [218, 20], [150, 20], [347, 20], [57, 20], [218, 20], [311, 91], [232, 91], [896, 91], [874, 91], [767, 91], [653, 91], [250, 91], [716, 91], [855, 91], [63, 91], [726, 91], [981, 91], [301, 91], [651, 91], [777, 91], [573, 86], [477, 86], [378, 86], [324, 86], [977, 86], [951, 86], [809, 86], [674, 86], [228, 86], [531, 86], [691, 86], [60, 86], [201, 86], [250, 86], [64, 86], [670, 90], [458, 90], [344, 90], [942, 90], [48, 90], [582, 90], [405, 90], [49, 90], [651, 90], [118, 90], [526, 90], [877, 90], [772, 90], [344, 90], [337, 90], [308, 149], [622, 149], [376, 149], [829, 149], [837, 149], [322, 149], [903, 149], [837, 149], [681, 149], [890, 149], [899, 149], [903, 149], [901, 149], [968, 149], [263, 149], [128, 11], [361, 11], [361, 11], [128, 11], [4, 11], [361, 11], [128, 11], [361, 11], [4, 11], [361, 11], [759, 11], [4, 11], [4, 11], [4, 11], [759, 11], [750, 22], [12, 22], [769, 22], [59, 22], [496, 22], [962, 22], [251, 22], [80, 22], [684, 22], [945, 22], [329, 22], [616, 22], [436, 22], [268, 22], [311, 22], [838, 12], [48, 12], [205, 12], [347, 12], [662, 12], [915, 12], [36, 12], [837, 12], [1, 12], [693, 12], [590, 12], [809, 12], [132, 12], [496, 12], [262, 12], [764, 43], [725, 43], [380, 43], [762, 43], [97, 43], [718, 43], [985, 43], [104, 43], [17, 43], [566, 43], [701, 43], [447, 43], [722, 43], [121, 43], [994, 43], [664, 22], [566, 22], [315, 22], [394, 22], [943, 22], [900, 22], [872, 22], [900, 22], [566, 22], [743, 22], [221, 22], [968, 22], [433, 22], [345, 22], [382, 22], [818, 106], [360, 106], [54, 106], [674, 106], [641, 106], [620, 106], [548, 106], [325, 106], [517, 106], [382, 106], [851, 106], [452, 106], [501, 106], [501, 106], [169, 106], [925, 80], [348, 80], [742, 80], [775, 80], [607, 80], [509, 80], [806, 80], [711, 80], [5, 80], [503, 80], [868, 80], [696, 80], [844, 80], [6, 80], [168, 80], [464, 31], [806, 31], [464, 31], [464, 31], [148, 31], [637, 31], [162, 31], [148, 31], [148, 31], [714, 31], [148, 31], [714, 31], [464, 31], [806, 31], [714, 31], [361, 116], [328, 116], [852, 116], [618, 116], [541, 116], [978, 116], [800, 116], [923, 116], [224, 116], [410, 116], [173, 116], [800, 116], [989, 116], [135, 116], [179, 116], [186, 160], [227, 160], [875, 160], [884, 160], [718, 160], [778, 160], [899, 160], [647, 160], [552, 160], [936, 160], [849, 160], [268, 160], [114, 160], [436, 160], [385, 160], [80, 133], [684, 133], [901, 133], [317, 133], [821, 133], [629, 133], [965, 133], [202, 133], [93, 133], [622, 133], [163, 133], [691, 133], [246, 133], [901, 133], [470, 133], [70, 186], [800, 186], [756, 186], [280, 186], [950, 186], [756, 186], [477, 186], [299, 186], [0, 186], [277, 186], [720, 186], [800, 186], [720, 186], [270, 186], [517, 186], [278, 1], [997, 1], [602, 1], [599, 1], [74, 1], [286, 1], [997, 1], [286, 1], [997, 1], [602, 1], [74, 1], [919, 1], [204, 1], [204, 1], [248, 1], [698, 34], [351, 34], [733, 34], [877, 34], [246, 34], [568, 34], [717, 34], [814, 34], [111, 34], [912, 34], [807, 34], [798, 34], [522, 34], [222, 34], [535, 34], [489, 151], [803, 151], [767, 151], [106, 151], [68, 151], [161, 151], [502, 151], [258, 151], [881, 151], [380, 151], [913, 151], [840, 151], [68, 151], [886, 151], [330, 151]];

 //    var pair = question_object_pairs[Math.floor(Math.random()*question_object_pairs.length)];

	// var question = pair[0];
 //    var object = pair[1];

    var pair = pairs[Math.floor(Math.random()*pairs.length)]
    var question = questions[pair[1]];
    var object = objects[pair[0]];

	psiTurk.showPage('stage.html');

	object = object.toUpperCase();

	document.getElementById("question").innerHTML = question;
	document.getElementById("object").innerHTML = "Object: " + object;
    document.getElementById("question-on").innerHTML = "Question " + numTimesRun + " out of " + answersToCollect;
};

/* var old_finish = function(answer) {
	numTimesRun++;
	console.log(numTimesRun);
	var question = document.getElementById("question").
					innerHTML.substring(("Question: ").length); //otherwise won't be pure data
	var object = document.getElementById("object").
					innerHTML.substring(("Object: ").length);
	psiTurk.recordTrialData([question, object, answer]);
	psiTurk.saveData();
	if(numTimesRun == 5) complete();
	else QuestionExperiment();
}; */

var finish = function(answer) {
    numTimesRun++;
    var question = document.getElementById("question").innerHTML; //otherwise won't be pure data
    var object = document.getElementById("object").
                    innerHTML.substring(("Object: ").length);
    psiTurk.recordTrialData([question, object, answer]);
    psiTurk.saveData();
    if(numTimesRun == answersToCollect) 
        setTimeout(
            function(){
                psiTurk.showPage('post_questionnaire.html');
                //document.getElementById("time").innerHTML = ((new Date().getTime() / 1000) - beginTime);
            }, 200);

    else setTimeout(QuestionExperiment, 200);
}

var complete = function() {
	psiTurk.showPage('complete.html');
    var timeRan = (new Date().getTime() / 1000) - beginTime;
    psiturk.recordUnstructuredData('time', timeRan);
    psiturk.recordUnstructuredData('comments', $("#comments").val());
	psiTurk.completeHIT();
}


var beginTime;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    beginTime = new Date().getTime() / 1000;
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() {
    		currentview = new QuestionExperiment(); 
    	} // what you want to do when you are done with instructions
    );
});
