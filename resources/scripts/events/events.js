window.onresize = function (event) {
  Resize();
};


window.onmousedown = function (event) {
  var item = document.elementFromPoint(event.x, event.y);
  if (
    item &&
    item.classList.contains("card") &&
    deck.player.cards.findIndex(function (x) {
      return x.id === parseInt(item.id.slice(4));
    }) !== -1
  ) {
    if (event.button === 0) {
      item.classList.add("dragging");
      item.classList.add("highlighted");
      document.getElementsByTagName("html")[0].style.cursor = "none";
      ArrangeCards(
        deck.player.cards.filter(function (x) {
          return x.id !== parseInt(item.id.slice(4));
        }),
        true
      );
      selectedCard = deck.player.cards.find(function (x) {
        return x.id === parseInt(item.id.slice(4));
      });
      //console.log("Card selected:", selectedCard);
    } else if (event.button === 2) {
      item.classList.remove("dragging");
      item.classList.remove("highlighted");
      document.getElementsByTagName("html")[0].style.cursor = "default";
      ArrangeCards(deck.player.cards, true);
      //console.log("Card deselected:", selectedCard);
      selectedCard = null;
    }
  }
  if (event.button === 2) {
    event.preventDefault();
  }
};

window.onmouseup = function () {
  var draggings = document.getElementsByClassName("dragging");
  
  if (draggings.length > 0 && playerTurn === true) {
    audioPlayer.Play('placed');
    console.log("player move");
    var draggedElement = draggings[0];
    var draggedCardId = parseInt(draggedElement.id.replace("card", ""));
    var draggedCard = deck.player.cards.find((c) => c.id === draggedCardId);

    draggedElement.classList.remove("dragging", "highlighted");

    var canEat = false;

    deck.table.cards.forEach((targetCard) => {
    if (canEatCard(draggedCard, targetCard)) {
      eatCard(draggedCard, targetCard);
      canEat = true;
      playereatedcards.push(draggedCard, targetCard);
      // console.log("Eated : ", playereatedcards);
      playerlasteat = true;
      //ArrangePlayerEatedCards("player");
      playerTurn = false;
      botAttack();
    }
    });

    if (!canEat) {
      placeCardOnTable(draggedCard);
      playerTurn = false;
      botAttack();
    }
    
    ArrangeCards(deck.player.cards, true);
    ArrangeTableCards(deck.table.cards);
    dealNewCardsIfNeeded();

    if(deck.player.cards.length === 0 && deck.bot.cards.length === 0) {
      if(playerlasteat) {
        for(var i = 0 ; i < deck.table.cards.length ; i++) {
          playereatedcards.push(deck.table.cards[i]);
          removeCardElement(deck.table.cards[i].id);
        }
      } else {
        for(var i = 0 ; i < deck.table.cards.length ; i++) {
          boteatedcards.push(deck.table.cards[i]);
          removeCardElement(deck.table.cards[i].id);
        }
      }
      deck.table.cards = [];
      CalculateScore(playereatedcards, boteatedcards);
    }
  }
  
};
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

