const QUESTIONS = {
  all: [], // dynamically populated below
  chill: [
    "Comfort food that hits different at midnight?",
    "Beach or mountains and why are you wrong?",
    "Dream vacation, unlimited budget?",
    "Last show you actually finished in one sitting?",
    "What's a skill you wish you had?",
    "Coffee, tea, or chaos?",
    "Morning person or night owl no lies?",
    "What's your go-to \"I need to relax\" activity?",
    "Favorite season and your actual reason?",
    "What's a hobby you abandoned but still think about?",
    "Ideal Sunday morning looks like...?",
    "Overrated food everyone pretends to love?",
    "Underrated food nobody talks about enough?",
    "What's the last thing you Googled that you're slightly embarrassed by?",
    "What's your go-to comfort movie when you're feeling down?",
    "Naps: overrated or underrated?",
    "What's a small thing that always makes your day better?",
    "Favorite way to spend a rainy day indoors?",
    "What's the most relaxing sound in the world to you?",
    "Tea, coffee, or something completely different?",
    "What's your ideal weekend with zero obligations?",
    "Best meal you've ever had and where was it?",
    "Do you prefer silence or background noise when relaxing?",
    "What's a place you've been that felt instantly like home?"
  ],
  funny: [
    "Worst haircut you ever voluntarily chose?",
    "Most chaotic thing you did as a kid?",
    "Weirdest thing you believed as a child?",
    "A job you had that was low-key traumatizing?",
    "Most embarrassing thing you've done on a video call?",
    "Describe your most recent dream go.",
    "What's your villain origin story?",
    "Which animal would be the rudest if it could talk?",
    "If your pet could speak, what secrets would they expose?",
    "Worst advice you ever followed without question?",
    "What's a word you mispronounced forever before someone told you?",
    "Most awkward thing that's happened to you in public?",
    "What's the most unhinged thing in your search history?",
    "Describe your personality using only a fast food order.",
    "What's the funniest thing that's ever happened to you at work?",
    "What's a lie you told as a kid that got completely out of hand?",
    "Most ridiculous thing you've ever bought online at 2am?",
    "What's the dumbest injury you've ever gotten?",
    "Describe your worst date in exactly three words.",
    "What's a totally irrational fear you still have as an adult?",
    "What's the most embarrassing song on your playlist?",
    "What's a trend you participated in that you deeply regret?",
    "What's the weirdest compliment you've ever received?",
    "If your life was a sitcom, what would it be called?"
  ],
  spicy: [
    "Who would survive the zombie apocalypse in this call and who dies first?",
    "Your most toxic trait, honestly?",
    "Unpopular opinion you'll actually defend?",
    "What's a hill you will absolutely die on?",
    "What's the worst advice you'd give someone on purpose?",
    "Who in your life is the most dramatic, and why is it them?",
    "What's a red flag you pretend is a quirk?",
    "Biggest lie you've told to get out of something?",
    "Which colleague would you want on your apocalypse team?",
    "What's something you're irrationally competitive about?",
    "If you could know one truth about anyone in this call, what would you ask?",
    "What's a double standard you personally benefit from?",
    "Rate your email response time and explain yourself.",
    "Confess a work habit you know is terrible.",
    "What's something everyone around you loves that you secretly can't stand?",
    "What's the most passive-aggressive thing you've ever done?",
    "What's a rule you think exists only to annoy people?",
    "Who in this call would be the worst roommate and why?",
    "What's the pettiest thing you've ever done and are you proud of it?",
    "What's an opinion you hold that would surprise most people who know you?",
    "What's a compliment that was actually an insult in disguise?",
    "What's something you pretend to be bad at so you don't have to do it?",
    "What's the most dramatic thing you've done over something minor?",
    "Who on this call would last longest on a deserted island \u2014 and who'd give up first?"
  ],
  deep: [
    "What's your biggest fear, really?",
    "How do you personally define success?",
    "Best lesson a failure ever taught you?",
    "What's something you changed your mind about completely?",
    "What would you do if you knew you couldn't fail?",
    "What's a compliment that stuck with you for years?",
    "What part of yourself are you still figuring out?",
    "What's the best advice you've ever received?",
    "If you could relive one day, which one and why?",
    "What does your ideal life look like in 10 years?",
    "What's something you wish people understood about you?",
    "What's a belief you hold that's hard to explain to others?",
    "What's the most important thing you've learned about working with people?",
    "What's a decision you made that changed your trajectory?",
    "What does home mean to you?",
    "What's something you've outgrown that used to define you?",
    "What's a question you keep coming back to but can never fully answer?",
    "Who has had the biggest influence on who you are today?",
    "What's a version of yourself you had to leave behind?",
    "What does rest mean to you \u2014 and do you let yourself have it?",
    "What's something you know now that you wish you'd known at 18?",
    "What's a small act of kindness someone did for you that you've never forgotten?",
    "What's something you're still healing from?",
    "If you could write a letter to your future self, what's the one thing you'd say?"
  ],
  chaos: [
    "$1M cash now or your phone for life no negotiating?",
    "Text your ex or sing the national anthem on this call right now?",
    "Pick someone on this call to roast for 30 seconds.",
    "Swap lives with anyone for a week who and why?",
    "Delete social media forever or give up your favorite food pick one.",
    "What's your most unhinged conspiracy theory that's actually plausible?",
    "You have to quit your job and try something completely different tomorrow \u2014 what is it?",
    "Fight one horse-sized duck or 100 duck-sized horses?",
    "You must start a cult. What's the central belief?",
    "What's a crime you would commit if you knew you'd get away with it?",
    "Everyone must agree on one law to pass right now \u2014 what do you propose?",
    "You're starting a band. Band name and genre \u2014 go.",
    "What movie would be improved by adding a dinosaur?",
    "You host a dinner party: 3 guests, dead or alive. Who's there?",
    "You can only eat one food for the rest of your life \u2014 what is it and why will you regret it?",
    "You wake up tomorrow as someone else on this call \u2014 what's the first thing you do?",
    "If you had to survive a week with only the contents of your bag right now, how would you do?",
    "You must send a voice note to your entire contact list right now \u2014 what do you say?",
    "Pick one person on this call to be your lawyer if you're ever on trial. Who and why?",
    "You're given $500 and 24 hours to spend it all \u2014 what do you do?",
    "What's the most chaotic decision you could make in your life right now?",
    "Two truths and a lie \u2014 go. Everyone has to guess which is the lie.",
    "You must rename yourself right now. What's your new name and why?",
    "If this call was a reality TV show, what would it be called and who gets eliminated first?"
  ],
  work: [
    "What work habit are you most trying to improve right now?",
    "What's your best trick for getting unblocked fast?",
    "What part of your job gives you the most energy?",
    "What's a meeting you wish could be an email - and why?",
    "What's your go-to way to prioritize when everything is urgent?",
    "A tool or shortcut you can't live without at work?",
    "What's the most underrated skill in your role?",
    "How do you prefer to get feedback: live, async, or written?",
    "What's a time you shipped something you're proud of?",
    "What does your ideal workday schedule look like?",
    "What's a small process change that made a big impact?",
    "What kind of tasks put you in flow state?",
    "What's your favorite way to kick off a new project?",
    "How do you handle context switching?",
    "What's the best piece of career advice you've received?",
    "What's a skill you're actively trying to develop right now?",
    "What's the most valuable lesson your worst manager taught you?",
    "How do you know when a project is truly done?",
    "What's something your team does really well that doesn't get enough credit?",
    "What's a mistake you made at work that you learned the most from?",
    "What's your honest relationship with your to-do list?",
    "What's the best question someone has ever asked you in a meeting?",
    "What's one thing you wish you could automate in your job?",
    "How do you separate work mode from rest mode at the end of the day?",
    "What's a project you worked on that didn't succeed but you're still proud of?"
  ],
  nostalgia: [
    "What's a childhood snack you still think about?",
    "Which old-school game do you wish made a comeback?",
    "What song instantly teleports you back in time?",
    "Your favorite cartoon growing up?",
    "What trend did you love that everyone else hated?",
    "A movie you watched on repeat as a kid?",
    "What was your first email address like?",
    "What's the first gadget you were obsessed with?",
    "Which school memory still makes you laugh?",
    "What toy would you buy again today?",
    "What was your go-to weekend activity in your teens?",
    "A fashion phase you wouldn't mind revisiting?",
    "What was your signature ringtone era?",
    "What class field trip do you still remember vividly?",
    "What's a place from your past you'd revisit for a day?",
    "What's a TV show from your childhood you could still recite by heart?",
    "What's a smell that instantly takes you back to being a kid?",
    "What's a game you played outside as a kid that kids today have never heard of?",
    "What was your go-to order at your favorite childhood restaurant?",
    "What's the first concert or live event you ever attended?",
    "What's a slang word from your childhood that you still use?",
    "What's the most memorable birthday you had growing up?",
    "What's a book from your school days that actually stuck with you?",
    "What's a hobby you had as a teenager that you've completely abandoned?",
    "What's something from the early internet era you genuinely miss?"
  ],
  creative: [
    "If you could design any app, what would it do?",
    "What's a creative project you've always wanted to try?",
    "If your life had a soundtrack, what's the opening track?",
    "What's a character or world you'd love to build?",
    "If you could paint a mural anywhere, what would it be?",
    "What's a small design change that would delight users?",
    "Which medium do you want to get better at: writing, music, art, or video?",
    "What's the most creative thing you've done recently?",
    "If you were curating an exhibition, what's the theme?",
    "What's an everyday object you would redesign?",
    "What's a brand you'd love to reimagine?",
    "If you could create a new holiday, what would it celebrate?",
    "What's your favorite font and why?",
    "If you could build a game, what's the premise?",
    "What's your ideal creative workspace vibe?",
    "If you could illustrate a children's book, what would the story be about?",
    "What's a movie concept that doesn't exist yet but absolutely should?",
    "If you could design the cover of any magazine, which one and what's on it?",
    "What's a piece of music, art, or writing that changed how you see the world?",
    "If you had to create a new color and name it, what would it look like?",
    "What's a creative constraint that actually made your work better?",
    "If you could collaborate with any artist, designer, or creator, who would it be?",
    "What's a genre of music, film, or art you want to explore more?",
    "If your personality was a design style, what would it be?",
    "What's an idea you've had for years but never acted on \u2014 and why not?"
  ],
  movies: [
    "What's a movie that genuinely changed how you see the world?",
    "Most overrated film everyone pretends to love?",
    "What's a movie you can quote entirely from memory?",
    "Best villain in cinema history \u2014 and why?",
    "What's a film you walked out of (or turned off) and why?",
    "Which movie universe would you actually want to live in?",
    "What's a scene that made you ugly cry?",
    "Most underrated movie nobody talks about enough?",
    "What's a TV show you'd revive if you could?",
    "Comfort show you rewatch when life gets hard?",
    "What's a movie ending you would change?",
    "Best soundtrack to a film ever?",
    "What's a show you watched way too fast and immediately regretted?",
    "Which fictional TV family would you want to be part of?",
    "If your life was a movie, what genre would it be?"
  ],
  sports: [
    "What's your earliest sports memory?",
    "Most thrilling live sports moment you've ever witnessed?",
    "Which sport looks easy but is actually brutally hard?",
    "What's a sport you wish you'd started younger?",
    "Best athlete of all time in any sport \u2014 defend your answer.",
    "What sport would you go pro in if you had the talent?",
    "What's a sports team you have an irrational loyalty to?",
    "Most underrated sport that deserves more attention?",
    "What's a sports rule you've never fully understood?",
    "Would you rather win one championship or have a long average career?",
    "What's the most intense sporting event you've ever watched?",
    "Best sports movie ever made?",
    "What's a sport you tried and immediately gave up on?",
    "Fantasy draft: pick one athlete from any sport for your team.",
    "What's a fitness goal you've set and actually hit?"
  ],
  travel: [
    "Best trip you've ever taken and why?",
    "What's a destination on your bucket list you haven't made it to yet?",
    "Most unexpected thing that happened to you while travelling?",
    "Window seat or aisle seat \u2014 and this is non-negotiable?",
    "What's a place that completely shattered your expectations?",
    "What do you always pack that others think is weird?",
    "Best food you've ever eaten while travelling?",
    "What's a city you'd move to tomorrow if you could?",
    "Most underrated travel destination nobody talks about?",
    "What's the longest flight you've taken and did you survive?",
    "Beach resort or backpacking adventure?",
    "What's a travel mistake that turned into a great story?",
    "What's one country whose culture fascinated you most?",
    "Solo travel or group travel \u2014 which do you prefer and why?",
    "What's a local experience from your travels you still think about?"
  ],
  food: [
    "What's a dish you could eat every single day and never get tired of?",
    "Most adventurous thing you've ever eaten?",
    "What's a food you hated as a kid but love now?",
    "Best restaurant meal you've ever had?",
    "What's a dish you're actually proud to cook?",
    "Overrated cuisine that everyone raves about?",
    "What's your go-to order when you can't decide?",
    "Pineapple on pizza \u2014 defend your position.",
    "What's a food combo that sounds wrong but tastes incredible?",
    "What's the spiciest thing you've ever eaten and did you regret it?",
    "Street food or fine dining \u2014 which do you trust more?",
    "What's a childhood meal you wish you could eat one more time?",
    "What's your guilty pleasure snack you'd never admit to publicly?",
    "Best thing you've ever ordered on a late-night food run?",
    "If you could only eat one cuisine for the rest of your life, what is it?"
  ],
  music: [
    "What song would you pick as the anthem of your life right now?",
    "Most underrated artist nobody in this call has heard of?",
    "What's a concert or live performance you'll never forget?",
    "What genre of music do you secretly love but never admit to?",
    "First album or artist you were obsessed with as a kid?",
    "What's a song that hits completely different at 2am?",
    "Vinyl, streaming, or live only \u2014 which do you choose?",
    "What's a song you know every single word to?",
    "What's a music era you wish you could have lived through?",
    "Best road trip song ever made?",
    "What's a song that got you through a really hard time?",
    "Most overplayed song you're completely done with?",
    "If you could have front row seats to any concert ever, who is it?",
    "What's an artist or band that defined a specific chapter of your life?",
    "If you had to sing karaoke right now, what song are you picking?"
  ],
  gaming: [
    "What's the first video game you ever played?",
    "Most hours you've ever sunk into a single game?",
    "What's a game that genuinely stressed you out?",
    "Console, PC, or mobile \u2014 which do you actually prefer?",
    "What's a game you'd recommend to someone who doesn't game?",
    "Most satisfying gaming achievement you've ever unlocked?",
    "What's a game you rage quit and never went back to?",
    "Best video game soundtrack ever?",
    "What fictional game world would you want to actually live in?",
    "What's a game from your childhood you'd love to replay for the first time again?",
    "Most overrated game everyone loves that you couldn't get into?",
    "What's a game that genuinely made you emotional?",
    "If you could design your own game, what's the concept?",
    "What's your go-to game when you just want to zone out?",
    "Board games or video games \u2014 which brings out your competitive side more?"
  ]
};

// Populate "all" with every question from every other category
QUESTIONS.all = Object.entries(QUESTIONS)
  .filter(([key]) => key !== "all")
  .flatMap(([, questions]) => questions);

const VALID_CATEGORIES = Object.keys(QUESTIONS);

function getQuestionIndex(room, question) {
  if (!room?.category) return -1;
  const list = QUESTIONS[room.category] || [];
  return list.indexOf(question);
}

function getRandomQuestion(room, record = true) {
  if (!room?.category) return null;

  room.usedIndexes = room.usedIndexes || [];
  const list = QUESTIONS[room.category] || [];
  const available = list.map((_, i) => i).filter(i => !room.usedIndexes.includes(i));

  if (!available.length) return null;

  const index = available[Math.floor(Math.random() * available.length)];
  if (record) room.usedIndexes.push(index);
  room.usedIndexes = [...new Set(room.usedIndexes)];

  return list[index];
}

function getTotal(room) {
  if (!room?.category) return 0;
  return QUESTIONS[room.category]?.length || 0;
}

function changeCategory(room, category) {
  if (!room || !VALID_CATEGORIES.includes(category)) return null;
  const prevCategory = room.category;

  room.category = category;
  room.usedIndexes = [];
  room.currentQuestion = null;
  room.currentTurn = 0;
  room.votedThisRound = {};
  room.scores = {};

  return prevCategory;
}

function nextQuestion(room, nameCount) {
  if (!room) return null;

  room.votedThisRound = {};
  if (nameCount > 0) {
    room.currentTurn = (room.currentTurn + 1) % nameCount;
  } else {
    room.currentTurn = 0;
  }

  const question = getRandomQuestion(room);
  room.currentQuestion = question;
  return question;
}

function skipQuestion(room) {
  if (!room?.category) return null;

  room.votedThisRound = {};

  if (room.currentQuestion) {
    const idx = getQuestionIndex(room, room.currentQuestion);
    if (idx >= 0) room.usedIndexes = room.usedIndexes.filter(i => i !== idx);
  }

  const list = QUESTIONS[room.category] || [];
  const available = list.map((_, i) => i).filter(i => !room.usedIndexes.includes(i));
  if (!available.length) return null;

  const index = available[Math.floor(Math.random() * available.length)];
  room.usedIndexes.push(index);
  room.usedIndexes = [...new Set(room.usedIndexes)];
  room.currentQuestion = list[index];

  return room.currentQuestion;
}

function resetRoom(room) {
  if (!room) return;

  room.usedIndexes = [];
  room.currentQuestion = null;
  room.currentTurn = 0;
  room.scores = {};
  room.votedThisRound = {};
}

module.exports = {
  QUESTIONS,
  VALID_CATEGORIES,
  getQuestionIndex,
  getRandomQuestion,
  getTotal,
  changeCategory,
  nextQuestion,
  skipQuestion,
  resetRoom
};