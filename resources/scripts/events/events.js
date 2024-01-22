window.onresize = function (event) {
  Resize();
};
var sumtableselectedcard = 0;
var selectedCard = null;
var selectedTableCard = null;



//--------------------------------------------------------
window.onmousedown = function (event) {
  var item = document.elementFromPoint(event.x, event.y);

  // Check if the clicked item is a player card
  if (item && item.classList.contains("card") && deck.player.cards.some(x => x.id === parseInt(item.id.slice(4)))) {
    // Player card logic
    if (event.button === 0) {
      handlePlayerCardSelection(item);
    } else if (event.button === 2) {
      handlePlayerCardDeselection(item);
    }
  } else {
    // Check if the clicked item is a table card
    var item2 = document.elementFromPoint(event.x, event.y);
    if (item2 && item2.classList.contains("card") && deck.table.cards.some(y => y.id === parseInt(item2.id.slice(4)))) {
      // Table card logic

      if (event.button === 0) {
        handleTableCardSelection(item2);
      } else if (event.button === 2) {
        handleTableCardDeselection(item2);
      }
    }
  }

  if (event.button === 2) {
    event.preventDefault();
  }
};

function handlePlayerCardSelection(item) {
  item.classList.add("dragging");
  item.classList.add("highlighted");
  document.getElementsByTagName("html")[0].style.cursor = "none";
  ArrangeCards(deck.player.cards.filter(x => x.id !== parseInt(item.id.slice(4))), true);
  selectedCard = deck.player.cards.find(x => x.id === parseInt(item.id.slice(4)));
  //console.log("Player Card selected:", selectedCard);
}

function handlePlayerCardDeselection(item) {
  item.classList.remove("dragging");
  item.classList.remove("highlighted");
  ArrangeCards(deck.player.cards, true);
  selectedCard = null;
  document.getElementsByTagName("html")[0].style.cursor = "default";
}

var selectedTableCardIds = [];
function handleTableCardSelection(item2) {
  item2.classList.add("tablehighlighted");
  selectedTableCard = deck.table.cards.find(function (y) {
    return y.id === parseInt(item2.id.slice(4));
  });

  if (!selectedTableCardIds.includes(selectedTableCard.id)) {
    sumtableselectedcard += selectedTableCard.force;
    selectedTableCardIds.push(selectedTableCard.id); // Add the card ID to the list
  } else {
    console.log("Card already selected:", selectedTableCard);
  }
  console.log("Sum selected cards:", sumtableselectedcard);
  if (sumtableselectedcard > 10) {
    alert("Sum > 10");
    sumtableselectedcard = 0;
    deck.table.cards.forEach((card) => {
      var cardElement = document.getElementById("card" + card.id);
      if (cardElement) {
        resetTableCardSelection(cardElement);
      }
    });
  }
  if (sumtableselectedcard < 0) {
    sumtableselectedcard = 0;
    deck.table.cards.forEach((card) => {
      var cardElement = document.getElementById("card" + card.id);
      if (cardElement) {
        resetTableCardSelection(cardElement);
      }
    });
  }
}

function handleTableCardDeselection(item2) {
  sumtableselectedcard = sumtableselectedcard - selectedTableCard.force;
  resetTableCardSelection(item2);
}

function resetTableCardSelection(item2) {
  selectedTableCardIds = []; // Reset the list of selected card IDs
  item2.classList.remove("tablehighlighted");
  ArrangeTableCards(deck.table.cards);
  document.getElementsByTagName("html")[0].style.cursor = "hand";
}


//------------------------------------------------------------------
window.onmouseup = function () {
  var eatedthisround = [];
  var draggings = document.getElementsByClassName("dragging");
  UpdateInfoBox();

  if (draggings.length > 0 && playerTurn === true) {
    audioPlayer.Play('placed');
    //console.log("player turn");

    var draggedElement = draggings[0];
    var draggedCardId = parseInt(draggedElement.id.replace("card", ""));
    var draggedCard = deck.player.cards.find((c) => c.id === draggedCardId);

    draggedElement.classList.remove("dragging", "highlighted");

    var canEat = checkIfCanEat(draggedCard);

    if (canEat) {
      deck.table.cards.forEach((targetCard) => {
        if (selectedTableCardIds.includes(targetCard.id)) {
          eatCard(draggedCard, targetCard);
          eatedthisround.push(draggedCard);
          eatedthisround.push(targetCard);
          playereatedcards.push(draggedCard, targetCard);
          //onsole.log("Player Eated cards round ", round, "jaria ", deck.cards.length / 6, eatedthisround);
          //console.log("Total player eated cards : ", playereatedcards)
        }
      });
      //Chkeyb
      if (deck.table.cards.length === 0) {
        audioPlayer.Play('chkobba');
        pchkeyb = pchkeyb + 1;
        playerscore = playerscore + 1;
    }

      playerlasteat = true;
      playerTurn = false;
      sumtableselectedcard = 0;
      selectedTableCardIds = []; // Reset the list of selected card IDs

      timeoutBotAttack = setTimeout(() => {
        BotAttack();
      }, 1000);
    } else { //Can't eat
      placeCardOnTable(draggedCard);
      sumtableselectedcard = 0;
      selectedTableCardIds = [];
      playerTurn = false;
      //Remove the highlight ui
      deck.table.cards.forEach((card) => {
        var cardElement = document.getElementById("card" + card.id);
        if (cardElement) {
          resetTableCardSelection(cardElement);
        }
      });
      UpdateInfoBox();
      timeoutBotAttack = setTimeout(() => {
        BotAttack();
      }, 1000);
    }

    ArrangeCards(deck.player.cards, true);
    ArrangeTableCards(deck.table.cards);
    timeoutdealnewcards = setTimeout(() => {
      dealNewCardsIfNeeded();
    }, 1000);

    timeoutverify = setTimeout(() => {
      verifyGameState();
    }, 1400);
  }
  UpdateInfoBox();
};

function checkIfCanEat(draggedCard) {
  // Check if the sum of selected table cards equals the value of the dragged card
  return sumtableselectedcard === draggedCard.force;
}

//-----------------------------------------
function verifyGameState() {
  if (deck.player.cards.length === 0 && deck.bot.cards.length === 0) {
    if (playerlasteat) {
      for (var i = 0; i < deck.table.cards.length; i++) {
        removeCardElement(deck.table.cards[i].id);
        console.log("Player last eat : ", deck.table.cards[i])
        playereatedcards.push(deck.table.cards[i])
      }
    } else {
      for (var i = 0; i < deck.table.cards.length; i++) {
        boteatedcards.push(deck.table.cards[i]);
        removeCardElement(deck.table.cards[i].id);
        console.log("bot last eat : ", deck.table.cards[i])

      }
    }
    console.log("Player Total Eated Cards -->", playereatedcards.length)
    console.log("Bot Total Eated Cards -->", boteatedcards.length)

    deck.table.cards = [];
    CalculateScore(playereatedcards, boteatedcards);
  }
}
//----------------

window.onmousemove = function (event) {
  if (document.getElementsByClassName("dragging").length !== 0) {
    var elementId = document.getElementsByClassName("dragging")[0].id;
    var card = document.getElementById(elementId);
    var x =
      ((event.x - window.innerWidth * 0.52) / window.innerWidth) * 1920 + 30;
    var y =
      ((event.y - window.innerHeight * 0.52) / window.innerHeight) * 1080 - 40;
    var angle = Math.atan2(0 - x, 1500 - y);
    card.style.transform = "translate("
      .concat(x, "px, ")
      .concat(y, "px) rotate(")
      .concat(-((angle * 180) / Math.PI) / 2, "deg)");
    document.getElementsByTagName("html")[0].style.cursor = "default";
  }
};




function Resize() {
  var width = window.innerWidth;
  var gameDoc = document.getElementById("container");
  gameDoc.style.scale = "".concat(width / 1920);
  var guiDoc = document.getElementById("gui");
  guiDoc.style.scale = "".concat(width / 1920);
}

