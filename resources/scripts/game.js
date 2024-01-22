var deck = new Deck();
var audioPlayer = new AudioManager();
var timeoutShuffle;
var timeoutTrumpCard;
var timeoutInitCards;
var timeoutShowCards;
var timeoutHideCard;
var timeoutCenterCards;
var timeoutRestart;
var timeoutSmoothCenter;
var timeoutStrictSmooth;
var timeoutBotAttack;
var timeoutdealnewcards;
var timeoutRestartRound;
var timeoutshowwinnerscore;
var timeoutverify;
var targetScore = 11;
var selectedCard = null;
var boteatedcards = [];
var playereatedcards = [];
var totalplayereatedcards = [];
var playerlasteat = false;
var round = 1;
var aboteatedcards = [];
let sumSelectedCards = 0;


function showCard(card) {
    var cardItem = document.getElementById("card".concat(card.id));
    cardItem.classList.remove('back-side');
    cardItem.classList.add(card.GetSuitType());
    cardItem.title = card.GetSuitForce();
    cardItem.classList.add(card.suit.name);
}
function hideCard(card) {
    var cardItem = document.getElementById("card".concat(card.id));
    cardItem.classList.remove('red', 'black', 'diamond', 'spade', 'club', 'heart');
    cardItem.classList.add('back-side');
    cardItem.title = '';
}
function sortCardsByForce() {
    deck.player.cards
        .sort(function (a, b) { return a.force - b.force; });
}
function sortCardsBySuit() {
    deck.player.cards
        .sort(function (a, b) { return b.suit.type - a.suit.type; });
}
function sortCards() {
    deck.player.cards
        .sort(function (a, b) { return b.suit.type - a.suit.type || a.force - b.force; });
}
function start() {
    openPopup();
    //console.log("Option selected:", targetScore);
    deck = new Deck();
    document.addEventListener('contextmenu', function (event) { return event.preventDefault(); });
    //console.log(deck.cards);
    var game = document.getElementById('game');
    var gameDeck = document.createElement('div');
    gameDeck.id = 'container';
    audioPlayer.Play('start');
    for (var i = 0; i < deck.cards.length; i++) {
        var cardItem = document.createElement('div');
        cardItem.classList.add('card');
        cardItem.classList.add('back-side');
        cardItem.id = "card".concat(deck.cards[i].id);
        cardItem.style.zIndex = (40 - i).toString();
        var randdelay = Math.random() * 2.2;
        cardItem.style.animationName = Math.random() > 0.5 ? 'shuffleleft' : 'shuffleright';
        cardItem.style.animationDelay = "0.".concat(i * randdelay < 10 ? "0".concat(Math.floor(i * randdelay)) : Math.floor(i * randdelay), "s");
        gameDeck === null || gameDeck === void 0 ? void 0 : gameDeck.appendChild(cardItem);
        cardItem.style.transform = "translateY(".concat(-40 + i / 3.5, "%)");
    }
    timeoutShuffle = setTimeout(function () {
        audioPlayer.Play('moving');
        // thot les reste carte ala jnab
        for (var i = 0; i < deck.cards.length; i++) {
            var cardItem_1 = document.getElementById("card".concat(i));
            cardItem_1.style.transform = "translate(-560%,".concat(-40 + ((10 - i / 2) > 0 ? (10 - i / 2) * -1 : 10 - i / 2), "%)");
            cardItem_1.style.animationDelay = '';
            cardItem_1.style.animationName = '';
            // cardItem.style.transition = '0.4s ease-in-out';
        }
        timeoutInitCards = setTimeout(function () {
            deck.InitPlayer();
            deck.InitTable();
            audioPlayer.Play('shuffle');
            // thot l wre9 fel table "animation"
            for (var _i = 0, _a = deck.table.cards; _i < _a.length; _i++) {
                var Card = _a[_i];
                var cardItem_4 = document.getElementById("card".concat(Card.id));
                cardItem_4.style.transition = "".concat(0.55 + Card.id / 15, "s");
            }
            // Tejri les carte lel player "animation"
            for (var _i = 0, _a = deck.player.cards; _i < _a.length; _i++) {
                var Card = _a[_i];
                var cardItem_2 = document.getElementById("card".concat(Card.id));
                // te9leb l carte w tt7el fi ydi l player
                cardItem_2.style.transform = 'translate(0%, 120%)';
                // l kaf tejrih mahloul
                cardItem_2.style.transition = "".concat(0.55 + Card.id / 15, "s");
            }
            // Tejri les cartes lel bot "animation"
            for (var _b = 0, _c = deck.bot.cards; _b < _c.length; _b++) {
                var Card = _c[_b];
                var cardItem_3 = document.getElementById("card".concat(Card.id));
                // t7ot les cartes 9odem l bot
                cardItem_3.style.transform = 'translate(0%, -200%)';
                cardItem_3.style.transition = "".concat(0.55 + Card.id / 15, "s");
            }

            // console.log(deck);
            timeoutShowCards = setTimeout(function () {
                audioPlayer.Play('appear');
                for (var _i = 0, _a = deck.player.cards; _i < _a.length; _i++) {
                    var Card = _a[_i];
                    showCard(Card);
                }
                InitializeCards();


                ArrangeCards(deck.player.cards, true);
                ArrangeCards(deck.bot.cards, false);
                ArrangeTableCards(deck.table.cards);

                UpdateInfoBox();
            }, 1200);
        }, 1400);
    }, 1400);
    game === null || game === void 0 ? void 0 : game.appendChild(gameDeck);
}
window.onload = function () {
    start();
    Resize();
    GuiInit();
    document.getElementById("start-game-btn").addEventListener("click", startGame);
};
window.onresize = function (event) {
    Resize();
};
//------------------------------------
// just annimation mta3 tahbit les cartes lel table
function InitializeCards() {
    // l wa9et eli l carte mte3k bch tahbet lel table
    var _loop_3 = function (Card) {
        var cardItem = document.getElementById("card".concat(Card.id));
        cardItem.addEventListener('mouseenter', function (event) { return ScaleCard(Card, cardItem); }, true);
        cardItem.addEventListener('mouseleave', function (event) { return NormalizeCard(Card, cardItem); }, true);
        cardItem.style.transition = "0.55s";
    };
    for (var _i = 0, _a = deck.player.cards; _i < _a.length; _i++) {
        var Card = _a[_i];
        _loop_3(Card);
    }
    // l wa9t eli l bot yhabet fih wre9
    for (var _b = 0, _c = deck.bot.cards; _b < _c.length; _b++) {
        var Card = _c[_b];
        var cardItem = document.getElementById("card".concat(Card.id));
        cardItem.style.transition = "0.55s";
    }
}
// tefret kafek
function ArrangeCards(Cards, isPlayer) {
    var cardNum = 0;
    if (isPlayer) {
        sortCards();
    }
    Cards.forEach(Card => {
        if (Card) { // Check if Card is not undefined
            var cardItem = document.getElementById("card".concat(Card.id));
            if (cardItem) { // Check if cardItem is not null
                var multiplier = 3 / Cards.length;
                Card.position = new Position(
                    (-10 * (Cards.length - 1) + (cardNum * 20)) * (multiplier >= 1 ? 1 : multiplier / 0.8),
                    ((isPlayer ? 130 : -210) - (isPlayer ? 1 : -1) * (6 * (cardNum < (Cards.length / 2) ? (Cards.length / 2 - ((Cards.length - cardNum) / 2)) : (((Cards.length - cardNum) - 1) / 2)))),
                    (-5 * (Cards.length - 1) + (cardNum++ * 10)) * (multiplier >= 1 ? 1 : multiplier * 1.5)
                );
                cardItem.style.transform = "translate(".concat(Card.position.x, "%, ").concat(Card.position.y, "%) rotate(").concat(isPlayer ? Card.position.angle : -Card.position.angle, "deg)");
                cardItem.style.zIndex = isPlayer ? cardNum.toString() : ((cardNum * -1) + 40).toString();
            }
        }
    });
}

function ArrangeTableCards(Cards) {
    var cardNum = 0;
    var numRows = 2; // Number of rows
    var numCols = Cards.length / numRows; // Number of columns
    var tableWidth = numCols * (100 / (numCols - 1));
    var tableHeight = numRows * (100 / (numRows - 1));

    var centerX = (70 - tableWidth) / 2;
    var centerY = (10 - tableHeight) / 2;
    // Loop through each card in the array
    for (var _i = 0, Cards_1 = Cards; _i < Cards_1.length; _i++) {

        var Card = Cards_1[_i];
        var cardItem = document.getElementById("card".concat(Card.id));
        showCard(Card);
        var col = cardNum % numCols;
        var row = Math.floor(cardNum / numCols);
        var cardWidth = 130;  // Adjust as needed
        var cardHeight = 180; // Adjust as needed
        // Calculate positioning parameters
        var row = Math.floor(cardNum / numCols);
        var col = cardNum % numCols;
        var cardSpacingX = 130; // Adjust as needed
        var cardSpacingY = 110; // Adjust as needed

        Card.position = new Position(
            centerX + col * cardSpacingX,
            centerY + row * cardSpacingY,
            0 // No rotation for parallel arrangement
        );


        cardItem.style.width = cardWidth + "px";
        cardItem.style.height = cardHeight + "px";
        // Apply transformations to the card element
        cardItem.style.transform = "translate(".concat(Card.position.x, "%, ").concat(Card.position.y, "%) rotate(").concat(Card.position.angle, "deg)");
        if (cardItem.classList.contains('taken')) {
            // Add any additional styling for taken cards
            cardItem.style.opacity = '0.5';
        }
        // Increment the card counter
        cardNum++;
    }
    document.getElementsByTagName("html")[0].style.cursor = "default";

}
//--------//-------------//----------------//-------//

// Tekel les cartes ythatou ala jnab
function ArrangePlayerEatedCards(playerType) {
    for (var i = 0; i < playereatedcards.length; i++) {
        var cardItem_1 = document.getElementById("card".concat(i));
        cardItem_1.style.transform = "translate(560%,".concat(-40 + ((10 - i / 2) > 0 ? (10 - i / 2) * -1 : 10 - i / 2), "%)");
        cardItem_1.style.animationDelay = '';
        cardItem_1.style.animationName = '';
        // cardItem.style.transition = '0.4s ease-in-out';
    }
}


// fel hover mtaa l carte tthaz carte wahda mech lkol
function NormalizeCard(Card, cardItem) {
    if (deck.player.cards.find(function (x) { return x.id === Card.id; })) {
        cardItem.style.transform = "translate(".concat(Card.position.x, "%, ").concat(Card.position.y, "%) rotate(").concat(Card.position.angle, "deg)");
    }
}
// des effets fel drag and drop
function ScaleCard(Card, cardItem) {
    if (!cardItem.classList.contains('dragging') && deck.player.cards.find(function (x) { return x.id === Card.id; })) {
        audioPlayer.Play('hover');
        cardItem.style.cursor = 'grab';
        cardItem.style.transform = "translate(".concat(Card.position.x - Math.cos((90 + Card.position.angle) * Math.PI / 180) * 70, "%, ").concat(Card.position.y - Math.sin((90 + Card.position.angle) * Math.PI / 180) * 35, "%) rotate(").concat(Card.position.angle, "deg)");
        // console.log(Card.position, Card.position!.angle! * Math.PI / 180, Card.position?.angle);
    }
    else {
        cardItem.style.cursor = 'default';
    }
}

//------------------------------------------------
// Function to open the popup
function openPopup() {
    startGame();
    document.getElementById("popup-window").style.display = "block";
}

// Function to close the popup and start the game
function startGame() {
    // Get the value of the selected radio button
    var selectedValue = document.querySelector('input[name="option"]:checked').value;
    targetScore = parseInt(selectedValue, 10);
    document.getElementById("popup-window").style.display = "none";
    document.getElementById("start-game-btn").addEventListener("click", startGame);

}
function setOption(value) {
    // Your code to handle the option
    //console.log("Option selected:", value);
}
//--------------------------------------------------
function startrestround() {
    deck = new Deck();
    document.addEventListener('contextmenu', function (event) { return event.preventDefault(); });
    //console.log(deck.cards);
    var game = document.getElementById('game');
    var gameDeck = document.createElement('div');
    gameDeck.id = 'container';
    audioPlayer.Play('start');
    for (var i = 0; i < deck.cards.length; i++) {
        var cardItem = document.createElement('div');
        cardItem.classList.add('card');
        cardItem.classList.add('back-side');
        cardItem.id = "card".concat(deck.cards[i].id);
        cardItem.style.zIndex = (40 - i).toString();
        var randdelay = Math.random() * 2.2;
        cardItem.style.animationName = Math.random() > 0.5 ? 'shuffleleft' : 'shuffleright';
        cardItem.style.animationDelay = "0.".concat(i * randdelay < 10 ? "0".concat(Math.floor(i * randdelay)) : Math.floor(i * randdelay), "s");
        gameDeck === null || gameDeck === void 0 ? void 0 : gameDeck.appendChild(cardItem);
        cardItem.style.transform = "translateY(".concat(-40 + i / 3.5, "%)");
    }
    timeoutShuffle = setTimeout(function () {
        audioPlayer.Play('moving');
        // thot les reste carte ala jnab
        for (var i = 0; i < deck.cards.length; i++) {
            var cardItem_1 = document.getElementById("card".concat(i));
            cardItem_1.style.transform = "translate(-560%,".concat(-40 + ((10 - i / 2) > 0 ? (10 - i / 2) * -1 : 10 - i / 2), "%)");
            cardItem_1.style.animationDelay = '';
            cardItem_1.style.animationName = '';
            // cardItem.style.transition = '0.4s ease-in-out';
        }
        timeoutInitCards = setTimeout(function () {
            deck.InitPlayer();
            deck.InitTable();
            audioPlayer.Play('shuffle');
            // thot l wre9 fel table "animation"
            for (var _i = 0, _a = deck.table.cards; _i < _a.length; _i++) {
                var Card = _a[_i];
                var cardItem_4 = document.getElementById("card".concat(Card.id));
                cardItem_4.style.transition = "".concat(0.55 + Card.id / 15, "s");
            }
            // Tejri les carte lel player "animation"
            for (var _i = 0, _a = deck.player.cards; _i < _a.length; _i++) {
                var Card = _a[_i];
                var cardItem_2 = document.getElementById("card".concat(Card.id));
                // te9leb l carte w tt7el fi ydi l player
                cardItem_2.style.transform = 'translate(0%, 120%)';
                // l kaf tejrih mahloul
                cardItem_2.style.transition = "".concat(0.55 + Card.id / 15, "s");
            }
            // Tejri les bot lel player "animation"
            for (var _b = 0, _c = deck.bot.cards; _b < _c.length; _b++) {
                var Card = _c[_b];
                var cardItem_3 = document.getElementById("card".concat(Card.id));
                // t7ot les cartes 9odem l bot
                cardItem_3.style.transform = 'translate(0%, -200%)';
                cardItem_3.style.transition = "".concat(0.55 + Card.id / 15, "s");
            }

            // console.log(deck);
            timeoutShowCards = setTimeout(function () {
                audioPlayer.Play('appear');
                for (var _i = 0, _a = deck.player.cards; _i < _a.length; _i++) {
                    var Card = _a[_i];
                    showCard(Card);
                }
                InitializeCards();


                ArrangeCards(deck.player.cards, true);
                ArrangeCards(deck.bot.cards, false);
                ArrangeTableCards(deck.table.cards);

                UpdateInfoBox();
            }, 1200);
        }, 1400);
    }, 1400);
    game === null || game === void 0 ? void 0 : game.appendChild(gameDeck);
}
//------------------------------------
/*
function eatedcardmove(eatedcards) {
    setTimeout(function () {
        audioPlayer.Play('moving');
        for (var _i = 0, _b = eatedcards ; _i < _b.length; _i++) {
            var card = _b[_i];
            console.log("eated cards : ",card)
                var cardItem = document.getElementById("card".concat(card.id));
                console.log(cardItem)
                card[i].style.transform = "translate(560%,".concat(-40 + ((10 - i / 2) > 0 ? (10 - i / 2) * -1 : 10 - i / 2), "%)");
                console.log("Eated nd moved")
                //cardItem.style.transition = '0.4s ease-in-out';
    }}, 1200 );
}*/
/*
function arrangeBotEatedCardsToLeft() {
    boteatedcards.forEach((card, index) => {
        var cardElement = document.getElementById("card".concat(card.id));
        if (cardElement) {
            // Existing logic
        } else {
            console.error(`Card element not found for card ID ${card.id}`);
            // Handle the missing element case here
        }
    });
}
*/

/*
function timeoutboteatedcards() {
    setTimeout(function () {
    audioPlayer.Play('moving');
    // thot les reste carte ala jnab
        for (var i = 0; i < eatedcardsthisround.length; i++) {
            var cardItem_1 = document.getElementById("card".concat(i));
            cardItem_1.style.transform = "translate(560%,".concat(-40 + ((10 - i / 2) > 0 ? (10 - i / 2) * -1 : 10 - i / 2), "%)");
            cardItem_1.style.animationDelay = '';
            cardItem_1.style.animationName = '';
            // cardItem.style.transition = '0.4s ease-in-out';
        }
}, 1200 )}; */

//-------------------------------------
function RestartRound() {
    HideInfoBox();
    startrestround();
}

function BotAttack() {
    var eatedcardsthisround = [];
    console.log("bot turn");
    UpdateInfoBox();
    if (deck.bot.cards.length > 0) {
        audioPlayer.Play('placed');
        var cardToPlace = deck.bot.cards[0];
        var canEat = false;

        deck.table.cards.forEach((targetCard) => {
            if (canEatCard(cardToPlace, targetCard)) {
                eatCard(cardToPlace, targetCard);

                eatedcardsthisround.push(cardToPlace, targetCard);
                //console.log("Bot Eated cards round ",round , "jaria ", deck.cards.length/6  ,eatedcardsthisround);
                canEat = true;
                boteatedcards.push(cardToPlace, targetCard);
                playerlasteat = false;
            }
        });

        if (!canEat) {
            placeCardOnTable(cardToPlace);
        }

        deck.bot.RemoveCard(cardToPlace);
        ArrangeCards(deck.bot.cards, false);
        ArrangeTableCards(deck.table.cards);


        // Update the display of the bot's eaten cards
        //arrangeBotEatedCardsToLeft();
    }

    playerTurn = true;
    UpdateInfoBox();
}


function eatCard(draggedCard, fromPlayer) {
    const combination = findCombination(draggedCard.force, deck.table.cards);
    if (combination && combination.length > 0) {
        combination.forEach((card) => {
            removeCard(card, deck.table.cards);
            removeCardElement(card.id);

            // Add to player's eaten cards if fromPlayer is true
            if (fromPlayer) {
                playereatedcards.push(card);
                if (deck.table.cards === 0) {
                    audioPlayer.Play('chkobba');
                    pchkeyb = pchkeyb + 1;
                    playerscore = playerscore + 1;
                }
            } else {
                boteatedcards.push(card);
                if (deck.table.cards === 0) {
                    audioPlayer.Play('chkobba');
                    bchkeyb = bchkeyb + 1;
                    botscore = botscore + 1;
                }
                hideCard(card);
            }
        });

        // Remove the played card from player's or bot's hand
        if (fromPlayer) {
            removeCard(draggedCard, deck.player.cards);
            removeCardElement(draggedCard.id);
            ArrangeCards(deck.player.cards, true);
            //console.log("Player eaten cards : ", playereatedcards)
        } else {
            removeCard(draggedCard, deck.bot.cards);
            //console.log("Bot eaten cards : ", playereatedcards)
        }
    } else {
        // If no match, place the card on the table
        placeCardOnTable(draggedCard);
    }


    ArrangeTableCards(deck.table.cards);
}
//------------------------------

function findCombination(
    targetValue,
    availableCards,
    currentCombo = [],
    startIndex = 0
) {
    const currentSum = currentCombo.reduce((sum, card) => sum + card.force, 0);

    if (currentSum === targetValue) {
        return currentCombo;
    }

    if (currentSum > targetValue || startIndex >= availableCards.length) {
        return null;
    }

    for (let i = startIndex; i < availableCards.length; i++) {
        const includeCard = findCombination(
            targetValue,
            availableCards,
            [...currentCombo, availableCards[i]],
            i + 1
        );
        if (includeCard) {
            return includeCard;
        }
        const excludeCard = findCombination(
            targetValue,
            availableCards,
            currentCombo,
            i + 1
        );
        if (excludeCard) {
            return excludeCard;
        }
    }

    return null;
}

function removeCardElement(cardId) {
    let cardElement = document.getElementById("card" + cardId);
    if (cardElement) {
        cardElement.remove();
    }
}

function removeCard(card, fromArray) {
    var index = fromArray.findIndex((c) => c.id === card.id);
    if (index !== -1) {
        fromArray.splice(index, 1);
    }
}

function placeCardOnTable(card) {
    deck.table.AddCard(card);
    removeCard(card, deck.player.cards);
}

function canEatCard(draggedCard, targetCard) {
    return draggedCard.force === targetCard.force;
}

function getSelectedCard() {
    return selectedCard;
}

//<-----------------------------------------------


/// A3tih 3 wra9 jdod kif youfa elfaw lawra9
function dealCardsToPlayer(player) {
    for (var i = 0; i < 3; i++) {
        if (deck.cards.length > 0) {
            var newCard = deck.cards.shift();
            if (newCard) {
                player.cards.push(newCard);
                showCard(newCard);
            }
        }
    }
    ArrangeCards(player.cards, true);
}

function dealCardsToBot(bot) {
    if (deck.cards.length > 0) {
        for (var i = 0; i < 3; i++) {
            if (deck.cards.length > 0) {
                var newCard = deck.cards.shift();
                if (newCard) {  // Check if newCard is not undefined
                    bot.cards.push(newCard);
                }
            }
        }
        ArrangeCards(bot.cards, false);
    }
}

function dealNewCardsIfNeeded() {
    if (deck.player.cards.length === 0 && deck.bot.cards.length === 0) {
        // Deal new cards if the deck still has cards
        if (deck.cards.length > 0) {
            dealCardsToPlayer(deck.player);
            dealCardsToBot(deck.bot);
            UpdateInfoBox(); // Update game info display
        }
    }
}

//-----------------------------------------

function updateSumSelectedCards() {
    sumSelectedCards = deck.table.cards
      .filter(card => card.selected)
      .reduce((sum, card) => sum + card.force, 0);
    // Optionally, update the UI to show the sum of selected cards
  }