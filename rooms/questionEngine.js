const QUESTIONS = {
  en: {
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
    ],
    romance: [
      "First crush story - go!",
      "What's your biggest dealbreaker in a relationship?",
      "Ideal date night: stay in or go out?",
      "What's the most romantic thing someone has done for you?",
      "Do you believe in love at first sight?",
      "What's your love language?",
      "What's the most important quality in a partner?",
      "Best relationship advice you've ever heard?",
      "Worst date you've ever been on?",
      "How do you know when you're in love?",
      "What's something you're still learning about relationships?",
      "Do you believe in soulmates?",
      "What's a small gesture that means a lot to you?",
      "How do you handle conflict in a relationship?",
      "What's the best thing about being in a relationship?"
    ],
    age: [
      "What's something you wish you'd known 10 years ago?",
      "How has your perspective on life changed as you've gotten older?",
      "What's been the most transformative year of your life so far?",
      "What are you most looking forward to in the next decade?",
      "What's a piece of wisdom you'd give to your younger self?",
      "How do you define 'growing up'?",
      "What's something you've outgrown that surprised you?",
      "What's your favorite age you've been so far and why?",
      "What's a life lesson you learned the hard way?",
      "How do you want to be remembered when you're older?",
      "What's the biggest difference between you now and you five years ago?",
      "What's something you're more comfortable with now than you used to be?",
      "What's a goal you've achieved that took years of work?",
      "How do you define 'success' at this stage in your life?",
      "What's been the most challenging stage of your life so far?"
    ]
  },

  hi: {
    all: [], // dynamically populated below
    chill: [
      "आधी रात को कौन सा खाना सबसे ज़्यादा अच्छा लगता है?",
      "समुद्र किनारा या पहाड़ — और गलत क्यों हो?",
      "अनलिमिटेड बजट हो तो ड्रीम वेकेशन कहाँ जाओगे?",
      "आखिरी बार कौन सा शो एक ही बैठक में पूरा देखा?",
      "कौन सी स्किल सीखने की कोशिश हमेशा रही लेकिन हुई नहीं?",
      "चाय, कॉफ़ी, या कुछ और?",
      "सुबह उठना पसंद है या रात को जागना?",
      "Relax करने का सबसे पसंदीदा तरीका क्या है?",
      "सबसे पसंदीदा मौसम और उसका असली कारण?",
      "कौन सा शौक छोड़ा लेकिन याद अभी भी आता है?",
      "आदर्श रविवार की सुबह कैसी होती है?",
      "वो खाना जो over-rated है लेकिन सब तारीफ़ करते हैं?",
      "वो खाना जो बहुत अच्छा है पर कोई बात नहीं करता?",
      "आखिरी बार ऐसा क्या Google किया जो थोड़ा embarrassing था?",
      "उदास होने पर कौन सी फ़िल्म देखते हो?",
      "झपकी: ज़रूरी या ज़्यादा?",
      "एक छोटी सी चीज़ जो दिन बना देती है?",
      "बारिश के दिन घर में कैसे समय बिताते हो?",
      "दुनिया की सबसे relaxing आवाज़ क्या है?",
      "बिना किसी जिम्मेदारी के Perfect Weekend कैसा होगा?",
      "अब तक का सबसे अच्छा खाना — कहाँ खाया था?",
      "Relax करते वक्त शांति पसंद है या background noise?",
      "कौन सी जगह गए और वहाँ घर जैसा महसूस हुआ?"
    ],
    funny: [
      "ऐसा बाल कटवाना जो ख़ुद से choose किया और बाद में पछताए?",
      "बचपन में किया सबसे ज़्यादा chaos क्या था?",
      "बचपन में कौन सी अजीब बात सच मानते थे?",
      "कोई काम जो low-key trauma देने वाला था?",
      "Video call पर हुई सबसे शर्मनाक चीज़?",
      "अपना सबसे हालिया सपना describe करो — बिना filter के।",
      "तुम्हारी villain origin story क्या है?",
      "कौन सा जानवर सबसे ज़्यादा बदतमीज़ होता अगर बोल पाता?",
      "अगर तुम्हारा pet बोल सकता तो कौन से राज़ बताता?",
      "बिना सोचे सबसे बुरी सलाह किसने दी — और माने भी?",
      "कौन सा शब्द लंबे समय तक गलत बोलते रहे जब तक किसी ने बताया?",
      "Public में सबसे awkward moment?",
      "Search history में सबसे पागल चीज़ क्या है?",
      "अपनी personality को एक fast food order में describe करो।",
      "काम पर हुई सबसे हँसाने वाली घटना?",
      "बचपन में कौन सा झूठ बोला जो बाद में बहुत बड़ा हो गया?",
      "रात 2 बजे online सबसे बेकार क्या खरीदा?",
      "अब तक की सबसे बेकार चोट कैसे लगी?",
      "अपनी सबसे worst date को सिर्फ तीन शब्दों में describe करो।",
      "कोई irrational डर जो अभी भी है?",
      "Playlist में सबसे embarrassing गाना कौन सा है?",
      "कौन सा trend follow किया जिस पर अब पछतावा है?",
      "सबसे अजीब compliment जो कभी मिला?",
      "अगर आपकी life sitcom होती तो उसका नाम क्या होता?"
    ],
    spicy: [
      "इस call में zombie apocalypse में कौन सबसे पहले जाएगा?",
      "तुम्हारी सबसे toxic habit honestly?",
      "एक unpopular opinion जिसे defend करोगे?",
      "एक बात जिसे absolutely सही मानते हो?",
      "जानबूझकर देने की सबसे बुरी सलाह क्या होगी?",
      "जीवन में सबसे dramatic इंसान कौन है — और क्यों वही?",
      "कौन सी red flag है जिसे quirk की तरह present करते हो?",
      "किसी चीज़ से बचने के लिए बोला सबसे बड़ा झूठ?",
      "Apocalypse team में call के किसे रखोगे?",
      "किस चीज़ में irrational competitive हो?",
      "इस call में किसी से एक सच जानना हो तो क्या पूछोगे?",
      "कोई double standard जिसका खुद फायदा उठाते हो?",
      "अपना email response time rate करो — और सफ़ाई दो।",
      "काम की एक आदत confess करो जो terrible है।",
      "कोई चीज़ जो सब पसंद करते हैं लेकिन तुम secretly नहीं करते?",
      "अब तक किया सबसे passive-aggressive काम?",
      "एक rule जो सिर्फ लोगों को परेशान करने के लिए बना लगता है?",
      "इस call में सबसे worst roommate कौन होगा और क्यों?",
      "सबसे petty काम क्या किया है — और गर्व है?",
      "कोई opinion जो लोगों को surprise करे?",
      "कोई compliment जो असल में insult था?",
      "किस चीज़ में खुद को जानबूझकर बुरा दिखाते हो ताकि करना न पड़े?",
      "किसी छोटी बात पर सबसे dramatic reaction?",
      "इस call में अकेले द्वीप पर सबसे लंबे कौन टिकेंगे — और पहले कौन हार मानेगा?"
    ],
    deep: [
      "असल में सबसे बड़ा डर क्या है?",
      "Success को personally कैसे define करते हो?",
      "किसी failure ने सबसे बड़ा सबक क्या सिखाया?",
      "कोई चीज़ जिसके बारे में सोच पूरी तरह बदल गई?",
      "अगर fail होना impossible होता तो क्या करते?",
      "कोई compliment जो सालों तक याद रहा?",
      "खुद का कौन सा हिस्सा अभी भी समझ नहीं आया?",
      "अब तक की सबसे अच्छी सलाह?",
      "एक दिन दोबारा जीना हो तो कौन सा — और क्यों?",
      "10 साल बाद आदर्श ज़िंदगी कैसी होगी?",
      "कोई बात जो चाहते हो लोग समझें?",
      "एक ऐसा विश्वास जिसे explain करना मुश्किल है?",
      "लोगों के साथ काम करने में सबसे important बात?",
      "कोई decision जिसने ज़िंदगी की दिशा बदल दी?",
      "घर का मतलब क्या है तुम्हारे लिए?",
      "कोई चीज़ जो पहले तुम्हारी पहचान थी लेकिन अब नहीं रही?",
      "एक सवाल जो हमेशा मन में आता है पर जवाब नहीं मिलता?",
      "किसका आज की personality पर सबसे ज़्यादा असर है?",
      "खुद का कौन सा version पीछे छोड़ना पड़ा?",
      "आराम का मतलब क्या है — और क्या खुद को वो मिलने देते हो?",
      "18 साल की उम्र में क्या जानना चाहते थे जो अब पता है?",
      "किसी की छोटी सी अच्छाई जो कभी नहीं भूले?",
      "कोई चीज़ जिसे अभी भी heal कर रहे हो?",
      "अगर अपने future self को एक letter लिखो तो एक बात क्या कहोगे?"
    ],
    chaos: [
      "अभी ₹80 लाख नगद या जीवनभर बिना फ़ोन — क्या चुनोगे?",
      "Ex को message करो या इस call पर National Anthem गाओ — अभी?",
      "Call में किसी एक को 30 सेकंड roast करो।",
      "किसी के साथ एक हफ्ते की ज़िंदगी बदल लो — कौन और क्यों?",
      "Social media हमेशा के लिए delete करो या favourite खाना छोड़ो?",
      "तुम्हारी सबसे unhinged लेकिन possible conspiracy theory?",
      "कल से नई job — क्या करोगे?",
      "एक बड़ी बत्तख से लड़ना या 100 छोटी बत्तखों से?",
      "एक cult शुरू करना हो तो मुख्य विचार क्या होगा?",
      "अगर पकड़े न जाओ तो कौन सा crime करोगे?",
      "सब मिलकर एक law पास करें — क्या होगा?",
      "Band बना रहे हो — नाम और genre बताओ।",
      "कौन सी फ़िल्म dinosaur से बेहतर होती?",
      "Dinner party में 3 guests — ज़िंदा या मुर्दा — कौन?",
      "एक ही खाना जिंदगीभर खाना हो — क्या चुनोगे और पछताओगे क्यों?",
      "कल उठो तो call के किसी और के रूप में — पहला काम?",
      "बैग के सामान से एक हफ्ते survive करना हो — कैसे?",
      "पूरी contact list को अभी voice note भेजो — क्या कहोगे?",
      "Trial में lawyer कौन होगा — और क्यों?",
      "₹40,000 और 24 घंटे — कैसे खर्च?",
      "अभी ज़िंदगी में सबसे chaotic decision क्या हो सकता है?",
      "Do truth aur ek jhooth — sabko guess karna hai.",
      "अभी अपना नया नाम रखो — और कारण बताओ।",
      "यह call reality show होती तो नाम क्या होता और पहले कौन बाहर?"
    ],
    work: [
      "अभी काम में कौन सी आदत सुधारने की कोशिश है?",
      "जल्दी unblock होने का सबसे अच्छा तरीका?",
      "काम का कौन सा हिस्सा सबसे ज़्यादा energy देता है?",
      "कौन सी meeting email से हो सकती थी — और क्यों?",
      "जब सब urgent हो तो priority कैसे decide करते हो?",
      "काम में एक tool जिसके बिना नहीं चलता?",
      "तुम्हारे role में सबसे underrated skill कौन सी है?",
      "Feedback कैसे लेना पसंद है — live, async, या written?",
      "कोई काम जो ship किया और उस पर गर्व है?",
      "आदर्श workday schedule कैसा होगा?",
      "कोई छोटा process change जिसने बड़ा फ़र्क डाला?",
      "किस तरह के tasks में flow state में होते हो?",
      "नया project कैसे शुरू करना पसंद है?",
      "Context switching कैसे handle करते हो?",
      "Career में मिली सबसे अच्छी सलाह?",
      "अभी कौन सी skill actively develop कर रहे हो?",
      "सबसे बुरे manager ने क्या सीखाया?",
      "Project कब पूरा माना जाता है?",
      "Team में कोई काम जो बहुत अच्छा है पर credit नहीं मिलता?",
      "काम में की गई गलती जिससे सबसे ज़्यादा सीखे?",
      "To-do list के साथ relationship honestly कैसा है?",
      "किसी ने meeting में पूछा सबसे अच्छा सवाल?",
      "काम में एक चीज़ जो automate करना चाहते हो?",
      "दिन के अंत में work mode से कैसे बाहर आते हो?",
      "कोई project जो succeed नहीं हुआ लेकिन गर्व है?"
    ],
    nostalgia: [
      "बचपन का वो snack जिसे अभी भी याद करते हो?",
      "कौन सा पुराना game वापस आए तो बेस्ट होगा?",
      "कौन सा गाना सुनते ही पुराने दिनों में चले जाते हो?",
      "बचपन का पसंदीदा cartoon?",
      "कौन सा trend था जो तुम्हें पसंद था लेकिन सबको नहीं?",
      "बचपन की वो movie जो bar-bar देखते थे?",
      "पहला email address कैसा था?",
      "पहला gadget जिसके दीवाने थे?",
      "स्कूल की कौन सी memory अभी भी हँसाती है?",
      "कौन सा खिलौना आज भी खरीदना हो?",
      "Teen age में weekends कैसे बिताते थे?",
      "कोई fashion phase जो दोबारा try करना हो?",
      "कौन सा ringtone era था तुम्हारा?",
      "स्कूल की कौन सी trip अभी भी याद है?",
      "अतीत की कोई जगह जहाँ एक दिन वापस जाना हो?",
      "बचपन का कोई शो जिसे अभी भी recite कर सको?",
      "कौन सी खुशबू बचपन की याद दिलाती है?",
      "बाहर खेला जाने वाला कोई game जो आज की पीढ़ी नहीं जानती?",
      "बचपन के favourite restaurant में क्या order करते थे?",
      "पहला concert या live event कौन सा था?",
      "बचपन की कोई slang जो अभी भी use करते हो?",
      "सबसे यादगार birthday कौन सी थी?",
      "स्कूल की कोई book जो actually याद रही?",
      "Teen age का कोई hobby जो अब नहीं है?",
      "Early internet का कोई feature जो miss करते हो?"
    ],
    creative: [
      "कोई app design करनी हो तो वो क्या करेगी?",
      "वो creative project जिसे try करना हमेशा चाहते थे?",
      "ज़िंदगी का soundtrack हो तो opening track क्या होगा?",
      "कोई ऐसा character या world जो build करना हो?",
      "कहीं भी mural बनाने दें तो क्या बनाओगे?",
      "एक छोटा design change जो users को खुश कर दे?",
      "Writing, music, art, या video — किसमें बेहतर होना है?",
      "हाल ही में किया सबसे creative काम?",
      "Exhibition curate करनी हो तो theme क्या होगा?",
      "रोज़ की कोई चीज़ जिसे redesign करोगे?",
      "कोई brand जिसे reimagine करना हो?",
      "नई छुट्टी बनाओ — वो क्या celebrate करेगी?",
      "Favourite font कौन सा है और क्यों?",
      "Game बनानी हो तो concept क्या होगा?",
      "आदर्श creative workspace कैसी होगी?",
      "Children's book illustrate करनी हो तो कहानी क्या होगी?",
      "एक movie concept जो exist नहीं करती लेकिन होनी चाहिए?",
      "किसी magazine का cover design करना हो — कौन सी और क्या होगा?",
      "कोई music, art, या writing जिसने दुनिया देखने का तरीका बदल दिया?",
      "नया रंग बनाओ और name दो — कैसा दिखेगा?",
      "कोई creative constraint जिसने काम बेहतर बनाया?",
      "किसी भी creator के साथ collaborate करना हो — कौन?",
      "Music, film, या art की कौन सी genre explore करनी है?",
      "Personality को design style में कैसे describe करोगे?",
      "कोई idea जो सालों से है लेकिन implement नहीं किया — क्यों नहीं?"
    ],
    movies: [
      "कोई movie जिसने दुनिया देखने का नज़रिया बदल दिया?",
      "सबसे overrated film जिसे सब पसंद करने का दिखावा करते हैं?",
      "कोई movie जिसे पूरा याद है — dialogue by dialogue?",
      "Cinema history का सबसे अच्छा villain — और क्यों?",
      "कोई film जिसे बीच में छोड़ा — और क्यों?",
      "कोई movie universe जिसमें वाकई रहना चाहोगे?",
      "कोई scene जिसने रुला दिया?",
      "सबसे underrated movie जिसकी कोई बात नहीं करता?",
      "कोई TV show जिसे वापस लाना हो?",
      "मुश्किल वक्त में दोबारा देखी जाने वाली show?",
      "कोई movie ending जिसे बदलना हो?",
      "किसी film का सबसे अच्छा soundtrack?",
      "कोई show जो बहुत तेज़ देखी और फिर पछताए?",
      "किस fictional TV family का हिस्सा बनना हो?",
      "अपनी ज़िंदगी movie होती तो genre क्या होता?"
    ],
    sports: [
      "सबसे पुरानी sports memory कौन सी है?",
      "देखी गई सबसे thrilling live sports moment?",
      "कौन सा sport आसान लगता है लेकिन actually बहुत मुश्किल है?",
      "कौन सा sport काश छोटे से शुरू किया होता?",
      "सभी sports का सबसे बेहतरीन athlete — defend करो।",
      "Talent हो तो किस sport में pro बनोगे?",
      "कोई team जिसके लिए irrational loyalty है?",
      "सबसे underrated sport जो ज़्यादा ध्यान deserve करता है?",
      "कोई sports rule जो कभी पूरी तरह समझ नहीं आया?",
      "एक championship जीतोगे या लंबा average career?",
      "देखा गया सबसे intense sporting event?",
      "सबसे अच्छी sports movie?",
      "कोई sport जो try किया और तुरंत छोड़ दिया?",
      "Fantasy draft: किसी भी sport से एक athlete team में?",
      "कोई fitness goal जो set किया और actually achieve किया?"
    ],
    travel: [
      "अब तक का सबसे अच्छा trip और क्यों?",
      "Bucket list में वो destination जहाँ अभी तक नहीं गए?",
      "Travel के दौरान सबसे unexpected चीज़ क्या हुई?",
      "Window seat या aisle seat — यह negotiable नहीं है?",
      "वो जगह जिसने सारी expectations तोड़ दीं?",
      "Travel में क्या pack करते हो जो दूसरों को अजीब लगता है?",
      "Travel के दौरान खाया सबसे अच्छा खाना?",
      "कल कहीं shift हो सकते हो तो कौन सा city?",
      "सबसे underrated travel destination जिसकी कोई बात नहीं करता?",
      "अब तक की सबसे लंबी flight — और survive किया?",
      "Beach resort या backpacking adventure?",
      "Travel में हुई गलती जो बाद में अच्छी story बनी?",
      "किस देश की culture ने सबसे ज़्यादा fascinate किया?",
      "Solo travel या group travel — और क्यों?",
      "Travel से कोई local experience जो अभी भी याद है?"
    ],
    food: [
      "वो dish जो हर रोज़ खा सकते हो बिना थके?",
      "अब तक खाई सबसे adventurous चीज़?",
      "कोई खाना जो बचपन में नहीं पसंद था लेकिन अब पसंद है?",
      "अब तक का सबसे अच्छा restaurant meal?",
      "कोई dish जो खुद बनाने पर गर्व होता है?",
      "वो cuisine जिसकी सब तारीफ़ करते हैं लेकिन overrated है?",
      "Decide न हो तो default order क्या होता है?",
      "Pizza पर pineapple — defend your position।",
      "कोई food combo जो अजीब लगे लेकिन बहुत अच्छा हो?",
      "सबसे spicy चीज़ जो खाई और पछताए?",
      "Street food या fine dining — किस पर ज़्यादा trust है?",
      "बचपन का वो खाना जो एक बार और खाना हो?",
      "वो guilty pleasure snack जो publicly admit नहीं करोगे?",
      "Late night food run पर सबसे अच्छा order?",
      "ज़िंदगी भर एक cuisine — क्या चुनोगे?"
    ],
    music: [
      "अभी की ज़िंदगी का anthem कौन सा गाना होगा?",
      "इस call में किसी ने न सुना हो ऐसा underrated artist?",
      "वो concert या live performance जो कभी नहीं भूले?",
      "कौन सी music genre secretly पसंद है जो admit नहीं करते?",
      "बचपन में पहला album या artist जिसके दीवाने थे?",
      "रात 2 बजे कौन सा गाना अलग ही feel देता है?",
      "Vinyl, streaming, या live only — क्या चुनोगे?",
      "कोई गाना जिसके सारे words याद हैं?",
      "कौन सा music era live करना चाहते?",
      "सबसे अच्छा road trip song?",
      "कोई गाना जिसने मुश्किल वक्त में साथ दिया?",
      "सबसे ज़्यादा play हुआ और अब सुना नहीं जाता वो गाना?",
      "Front row seat किसके concert पर चाहोगे?",
      "कोई artist जिसने ज़िंदगी के एक chapter को define किया?",
      "अभी karaoke करना हो तो कौन सा गाना?"
    ],
    gaming: [
      "पहला video game कौन सा खेला था?",
      "एक game में सबसे ज़्यादा घंटे कितने लगाए?",
      "कोई game जिसने stress में डाल दिया?",
      "Console, PC, या mobile — actually क्या prefer करते हो?",
      "Non-gamer को recommend करने वाला game?",
      "अब तक का सबसे satisfying gaming achievement?",
      "कोई game जिसे rage quit किया और वापस नहीं गए?",
      "सबसे अच्छा video game soundtrack?",
      "किस fictional game world में actually रहना चाहोगे?",
      "बचपन का वो game जिसे पहली बार experience करके replay करना हो?",
      "सबसे overrated game जिसे सब पसंद करते हैं लेकिन तुम नहीं?",
      "कोई game जिसने genuinely emotional किया?",
      "अपना game design करो — concept क्या होगा?",
      "Zone out करने के लिए go-to game?",
      "Board games या video games — competitive side किसमें ज़्यादा आता है?"
    ],
    romance: [
      "पहले क्रश की कहानी बताओ!",
      "रिश्ते में आपके लिए सबसे बड़ी dealbreaker क्या है?",
      "आदर्श डेट नाईट: घर पर रहना या बाहर जाना?",
      "किसी ने आपके लिए सबसे रोमांटिक काम क्या किया है?",
      "क्या आप पहली नज़र के प्यार में विश्वास करते हैं?",
      "आपकी प्यार की भाषा (love language) क्या है?",
      "पार्टनर में सबसे महत्वपूर्ण गुण क्या है?",
      "रिश्ते की सबसे अच्छी सलाह जो आपने सुनी है?",
      "अब तक की सबसे खराब डेट?",
      "आपको कैसे पता चलता है कि आप प्यार में हैं?",
      "रिश्तों के बारे में आप अभी भी क्या सीख रहे हैं?",
      "क्या आप सोलमेट्स (soulmates) में विश्वास करते हैं?",
      "एक छोटा सा इशारा जो आपके लिए बहुत मायने रखता है?",
      "आप रिश्ते में संघर्ष को कैसे संभालते हैं?",
      "रिश्ते में रहने की सबसे अच्छी बात क्या है?"
    ],
    age: [
      "ऐसी कौन सी बात है जो आप काश 10 साल पहले जानते?",
      "उम्र के साथ जीवन के प्रति आपका नजरिया कैसे बदला है?",
      "अब तक आपके जीवन का सबसे परिवर्तनकारी वर्ष कौन सा रहा है?",
      "अगले दशक में आप किस चीज़ का सबसे ज़्यादा इंतज़ार कर रहे हैं?",
      "आप अपने छोटे स्वरूप (younger self) को क्या सलाह देंगे?",
      "आप 'बड़ा होने' (growing up) को कैसे परिभाषित करते हैं?",
      "ऐसी कौन सी चीज़ है जिससे आप आगे निकल गए हैं और जिसने आपको चौंका दिया?",
      "अब तक आपकी पसंदीदा उम्र कौन सी रही है और क्यों?",
      "जीवन का वह सबक जो आपने मुश्किल तरीके से सीखा?",
      "जब आप बड़े होंगे तो आप कैसे याद किया जाना चाहते हैं?",
      "अब और पांच साल पहले के आप में सबसे बड़ा अंतर क्या है?",
      "ऐसी कौन सी चीज़ है जिसमें आप अब पहले से ज़्यादा कंफर्टेबल हैं?",
      "एक ऐसा लक्ष्य जिसे आपने सालों की मेहनत के बाद हासिल किया?",
      "जीवन के इस पड़ाव पर आप 'सफलता' को कैसे परिभाषित करते हैं?",
      "अब तक आपके जीवन का सबसे चुनौतीपूर्ण चरण कौन सा रहा है?"
    ]
  }
};

// Populate "all" for each locale
Object.keys(QUESTIONS).forEach(lang => {
  QUESTIONS[lang].all = Object.entries(QUESTIONS[lang])
    .filter(([key]) => key !== "all")
    .flatMap(([, questions]) => questions);
});

const VALID_CATEGORIES = Object.keys(QUESTIONS.en).filter(k => k !== "all").concat("all");
const VALID_LANGUAGES = Object.keys(QUESTIONS);

function getQuestionIndex(room, question) {
  const lang = room?.language || "en";
  if (!room?.category) return -1;
  const list = (QUESTIONS[lang] || QUESTIONS.en)[room.category] || [];
  return list.indexOf(question);
}

function getRandomQuestion(room, record = true) {
  const lang = room?.language || "en";
  if (!room?.category) return null;

  room.usedIndexes = room.usedIndexes || [];
  const list = (QUESTIONS[lang] || QUESTIONS.en)[room.category] || [];
  const available = list.map((_, i) => i).filter(i => !room.usedIndexes.includes(i));

  if (!available.length) return null;

  const index = available[Math.floor(Math.random() * available.length)];
  if (record) room.usedIndexes.push(index);
  room.usedIndexes = [...new Set(room.usedIndexes)];

  return list[index];
}

function getTotal(room) {
  const lang = room?.language || "en";
  if (!room?.category) return 0;
  return (QUESTIONS[lang] || QUESTIONS.en)[room.category]?.length || 0;
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

function changeLanguage(room, language) {
  if (!room || !VALID_LANGUAGES.includes(language)) return null;
  const prevLanguage = room.language || "en";
  if (prevLanguage === language) return prevLanguage;

  // Find the index of the current question in the old language pool
  const oldPool = (QUESTIONS[prevLanguage] || QUESTIONS.en)[room.category] || [];
  const currentIdx = room.currentQuestion != null ? oldPool.indexOf(room.currentQuestion) : -1;

  // Switch language
  room.language = language;

  // Translate the current question to the same index in the new language pool
  // (question arrays are ordered 1-to-1 across languages)
  const newPool = (QUESTIONS[language] || QUESTIONS.en)[room.category] || [];
  if (currentIdx >= 0 && newPool[currentIdx]) {
    room.currentQuestion = newPool[currentIdx];
  } else if (newPool.length > 0) {
    // Fallback: pick a new random question if mapping fails but pool exists
    room.currentQuestion = getRandomQuestion(room);
  } else {
    room.currentQuestion = null;
  }
  // usedIndexes, scores, currentTurn, votedThisRound are intentionally preserved

  return prevLanguage;
}

function nextQuestion(room, nameCount) {
  if (!room) return null;

  room.votedThisRound = {};
  if (nameCount > 0) {
    room.currentTurn = ((Number(room.currentTurn) || 0) + 1) % nameCount;
  } else {
    room.currentTurn = 0;
  }

  const question = getRandomQuestion(room);
  room.currentQuestion = question;
  return question;
}

function skipQuestion(room) {
  const lang = room?.language || "en";
  if (!room?.category) return null;

  room.votedThisRound = {};

  if (room.currentQuestion) {
    const idx = getQuestionIndex(room, room.currentQuestion);
    if (idx >= 0) room.usedIndexes = room.usedIndexes.filter(i => i !== idx);
  }

  const list = (QUESTIONS[lang] || QUESTIONS.en)[room.category] || [];
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
  VALID_LANGUAGES,
  getQuestionIndex,
  getRandomQuestion,
  getTotal,
  changeCategory,
  changeLanguage,
  nextQuestion,
  skipQuestion,
  resetRoom
};