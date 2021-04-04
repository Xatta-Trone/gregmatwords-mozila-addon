allwords = [];
word = null;
itemskey = "gregwrodsaddon";
timekey = "gregwordsexpiery";
function main() {
  const itemStr = localStorage.getItem(timekey);
  if (!itemStr) {
    console.log("ttl not  found");
    return getwords();
  } else {
    //check time
    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      console.log("words expired");
      localStorage.removeItem(timekey);
      localStorage.removeItem(wordskey);
      return getwords();
    }
    allwords = JSON.parse(localStorage.getItem(itemskey));
    randomwords();
  }
}
main();

function randomwords() {
  let vocab__word = document.getElementById("vocab__word");
  let vocab__definition = document.getElementById("vocab__definition");
  let vocab__synonym = document.getElementById("vocab__synonym");
  let vocab__passage = document.getElementById("vocab__passage");
  let word = allwords[Math.floor(Math.random() * allwords.length)];

  vocab__word.innerText = word.word;

  //   meanings
  let meaning = "";
  word.definitions.forEach(function (def) {
    let singleMeaning = "";
    def.definitions.forEach(function (singleDef) {
      singleMeaning += `[${def.partOfSpeech}] - ${singleDef} \n`;
    });
    // console.log(singleMeaning);
    meaning += singleMeaning;
  });
  vocab__definition.innerText = meaning;

  if (word.synonyms.length) {
    vocab__synonym.innerText = "Synonym : " + word.synonyms.join(", ");
  }

  let example = "Example: \n";
  word.example.forEach(function (def) {
    example += ` ${def} \n`;
  });

  if (word.example.length) {
    vocab__passage.innerText = example;
  }
  //   console.log(word);
}

async function getwords() {
  let links = [
    "https://raw.githubusercontent.com/Xatta-Trone/gregmatgrewordsdb/main/group_compact_1_8.json",
    "https://raw.githubusercontent.com/Xatta-Trone/gregmatgrewordsdb/main/group_compact_9_12.json",
    "https://raw.githubusercontent.com/Xatta-Trone/gregmatgrewordsdb/main/group_compact_13_20.json",
    "https://raw.githubusercontent.com/Xatta-Trone/gregmatgrewordsdb/main/group_compact_21_28.json",
    "https://raw.githubusercontent.com/Xatta-Trone/gregmatgrewordsdb/main/group_compact_29_36.json",
    "https://raw.githubusercontent.com/Xatta-Trone/gregmatgrewordsdb/main/group_compact_37_46.json",
    "https://raw.githubusercontent.com/Xatta-Trone/gregmatgrewordsdb/main/group_compact_47_52.json",
  ];

  Promise.all(links.map(getwordsfromsinglelink)).then(function (res) {
    localStorage.setItem(itemskey, JSON.stringify(allwords));

    const now = new Date();
    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      expiry: now.getTime() + 21 * 24 * 3600 * 60,
    };
    localStorage.setItem(timekey, JSON.stringify(item));
    randomwords();
  });
}

async function getwordsfromsinglelink(link) {
  const res = await fetch(link);
  words = await res.json();
  allwords = [...allwords, ...words];
  //   console.log(words, allwords);
  return words;
}

// getwords();
