var playerscore = 0;
var botscore = 0;
var playerTurn = true;

function GuiInit() {
    var volumeButton = document.getElementById('btn-volume');
    volumeButton === null || volumeButton === void 0 ? void 0 : volumeButton.addEventListener('click', function () {
        audioPlayer.Toggle();
        if (audioPlayer.SoundsToggle) {
            volumeButton === null || volumeButton === void 0 ? void 0 : volumeButton.children[0].setAttribute('d', 'M5 17h-5v-10h5v10zm2-10v10l9 5v-20l-9 5zm11.008 2.093c.742.743 1.2 1.77 1.198 2.903-.002 1.133-.462 2.158-1.205 2.9l1.219 1.223c1.057-1.053 1.712-2.511 1.715-4.121.002-1.611-.648-3.068-1.702-4.125l-1.225 1.22zm2.142-2.135c1.288 1.292 2.082 3.073 2.079 5.041s-.804 3.75-2.096 5.039l1.25 1.254c1.612-1.608 2.613-3.834 2.616-6.291.005-2.457-.986-4.681-2.595-6.293l-1.254 1.25z');
        }
        else {
            volumeButton === null || volumeButton === void 0 ? void 0 : volumeButton.children[0].setAttribute('d', 'M5 17h-5v-10h5v10zm2-10v10l9 5v-20l-9 5zm15.324 4.993l1.646-1.659-1.324-1.324-1.651 1.67-1.665-1.648-1.316 1.318 1.67 1.657-1.65 1.669 1.318 1.317 1.658-1.672 1.666 1.653 1.324-1.325-1.676-1.656z');
        }
    });
    var restartButton = document.createElement('div');
    restartButton.textContent = 'Start again';
    restartButton.addEventListener('click', StrictSmoothRestart, true);
    restartButton.id = 'btn-restart';
    var infoLabel = document.createElement('div');
    infoLabel.id = 'btn-info';
    var actionButton = document.createElement('div');
    actionButton.textContent = '...';
    actionButton.id = 'btn-action';
    actionButton.classList.add('button');
    var gui = document.getElementById('gui');
    gui === null || gui === void 0 ? void 0 : gui.appendChild(restartButton);
    gui === null || gui === void 0 ? void 0 : gui.appendChild(infoLabel);
    gui === null || gui === void 0 ? void 0 : gui.appendChild(actionButton);

    for (var _i = 0, _e = deck.player.cards; _i < _e.length; _i++) {
        var card = _e[_i];
        var cardItem = document.getElementById("card".concat(card.id));

        // Add click event listener for player cards
        cardItem.addEventListener('click', function () {
            toggleCardSelection(card, cardItem);
        });
    }
    deck.player.cards.forEach(function (card) {
        var cardItem = document.getElementById("card" + card.id);
        cardItem.addEventListener('click', function () {
            toggleCardSelection(card, cardItem);
        });
    }); 

// Assuming this happens after the table cards are created and added to the DOM
    deck.table.cards.forEach(function (card) {
        var cardItem = document.getElementById("card" + card.id);
        cardItem.addEventListener('click', function () {
            handleCardFromTable(card, cardItem);
        });
    });

    for (var _i = 0, _a = deck.table.cards; _i < _a.length; _i++) {
        (function() {
            var tableCard = _a[_i];
            var tableCardItem = document.getElementById("card".concat(tableCard.id));

            // Add direct logging in the event listener
            tableCardItem.addEventListener('click', function (event) {
                console.log('Click event triggered for card ID:', tableCard.id);
                console.log('Card data:', tableCard);
                handleCardFromTable(tableCard, tableCardItem);
            });
        })();
    }
}
function GetDeckCardsInfo() {
    if (deck.cards.length > 6) return "Mzelou " + deck.cards.length/6 +" Jariet" ;
    else if(deck.cards.length = 6)  return "Mzelt Jaria";
    else return "Ekher jaria !";
}
function turnwho() {
    if(playerTurn) return "Enti Tal3eb , ";
    else if(!playerTurn) return "L bot yal3eb , ";
    return '';
}
function UpdateInfoBox() {
    var infoLabel = document.getElementById('btn-info');
    infoLabel.textContent = "".concat(turnwho()).concat(GetDeckCardsInfo());
    infoLabel.classList.add('visible');
}
function HideInfoBox() {
    var infoLabel = document.getElementById('btn-info');
    infoLabel.classList.remove('visible');
}

function DisplayWinner(player) {
    if (player === 'bot') {
        audioPlayer.Play('lose');
        var winner = document.createElement('div');
        winner.textContent = '5SERT 😢';
        winner.id = 'winner';
        var game = document.getElementById('game');
        game === null || game === void 0 ? void 0 : game.appendChild(winner);
    }
    else if (player === 'player') {
        audioPlayer.Play('win');
        var winner = document.createElement('div');
        winner.textContent = 'MABROUK 😎';
        winner.id = 'winner';
        var game = document.getElementById('game');
        game === null || game === void 0 ? void 0 : game.appendChild(winner);
    }
    else if (player === 'tie') {
        audioPlayer.Play('lose');
        var winner = document.createElement('div');
        winner.textContent = 'TOR7 ✖️';
        winner.id = 'winner';
        var game = document.getElementById('game');
        game === null || game === void 0 ? void 0 : game.appendChild(winner);
    }
}
// restart
function toggleActionButton(makeVisible) {
    var actionbtn = document.getElementById('btn-action');
    if (actionbtn !== null && makeVisible) {
        actionbtn === null || actionbtn === void 0 ? void 0 : actionbtn.classList.add('visible');
    }
    else {
        actionbtn === null || actionbtn === void 0 ? void 0 : actionbtn.classList.remove('visible');
        actionbtn.textContent = '...';
    }
}

function toggleBotsDecision(makeVisible, context) {
    var botAction = document.getElementById('bot-action');
    var botActionDecision = document.getElementById('bot-action-decision');
    if (botAction !== null && botActionDecision !== null) {
        if (makeVisible && (context !== null && context !== undefined)) {
            botActionDecision.textContent = context;
            if (!botAction.classList.contains('visible')) {
                audioPlayer.Play('alert');
            }
            botAction.classList.add('visible');
        }
        else {
            botActionDecision.textContent = '...';
            botAction.classList.remove('visible');
        }
    }
}
//----------------------------------------------------------------------------------------

function toggleCardSelection(card, cardItem) {
    // Assuming 'selected' is a custom property you added to track selection
    card.selected = !card.selected;
    if (card.selected) {
        cardItem.classList.add('selected'); // Highlight the card visually
    } else {
        cardItem.classList.remove('selected');
    }
}

function handleCardFromTable(tableCard, tableCardItem) {
    // Find the selected player card
    var selectedPlayerCard = deck.player.cards.find(function (card) {
        return card.selected;
    });

    if (selectedPlayerCard && selectedPlayerCard.force === tableCard.force) {
        // Matching condition (force in this case)
        removeCardFromGame(selectedPlayerCard);
        removeCardFromGame(tableCard);

        // UI removal
        removeCardElement(selectedPlayerCard.id);
        removeCardElement(tableCard.id);
    }
}

function removeCardFromGame(card) {
    // Assuming you have a method to remove cards from player's hand and table
    deck.player.RemoveCard(card);
    deck.table.RemoveCard(card);
}

function removeCardElement(cardId) {
    var cardElem = document.getElementById("card" + cardId);
    if (cardElem && cardElem.parentNode) {
        cardElem.parentNode.removeChild(cardElem);
    }
}

//----------------------------------------------------

//----------------------------------------------------------
function CalculateScore(playereatedcards, boteatedcards) {
    var carta = false;
    var bermila = 0;
    var haya = false;
    var dineri = 0;
    // carta
    if (playereatedcards.length > boteatedcards.length) {
      carta = true;
      playerscore = playerscore+1;
    } else {
      botscore = botscore+1;
    }
    // bermila
    for( var i = 0 ; i < playereatedcards.length ; i++) {
      if (playereatedcards[i].force === 7) {
        bermila = bermila+1
      }
      if (playereatedcards[i].force === 6) {
        bermila = bermila+1;
      }
    }
    if (bermila > 4) playerscore = playerscore+1;
    else if (bermila < 4) botscore = botscore+1;
    else if (bermila === 4) console.log("Bermila beji")
    // 7aya
    for( var i = 0 ; i < playereatedcards.length ; i++) {
      if(playereatedcards[i].force === 7) {
        if(playereatedcards[i].suit.name === "diamond") {
          haya = true;
        }
      }
    }
    if(haya) playerscore = playerscore+1;
    else botscore = botscore+1;
    //dineri
    for( var i = 0 ; i < playereatedcards.length ; i++) {
      if(playereatedcards[i].suit.name === 'diamond') {
        dineri = dineri+1;
      }
    }
    if(dineri > 5) playerscore = playerscore+1;
    else if (dineri < 5) botscore = botscore+1;
  
    if(playerscore >= targetScore || botscore >= targetScore) {
        console.log(playerscore >= targetScore ? "Player wins!" : "Bot wins!");
        DisplayWinner(playerscore >= targetScore ? 'player' : 'bot');
    } else {
        timeoutRestartRound = setTimeout(() => {
        starnextround();
        }, 2500);
        round = round+1;
        console.log("Round number = ", round);
        console.log("Player Score = ", playerscore);
        console.log("Bot Score = ", botscore) // Function to restart the round
    }
  }
 function starnextround() {
    Resize();
    GuiInit();
    showPopup();
    RestartRound();
}
  //----------------------------------------------------