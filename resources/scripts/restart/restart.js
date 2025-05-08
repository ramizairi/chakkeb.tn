function clearCardsAndContainer() {
    // Remove all card elements
    var cards = document.getElementsByClassName('card');
    while (cards.length > 0) {
        cards[0].parentNode.removeChild(cards[0]);
    }

    // Remove the game container
    var gameDeck = document.getElementById('container');
    if (gameDeck) {
        gameDeck.remove();
    }
}

function resetCardTransforms(cardsArray) {
    // Reset the transform property of each card
    for (var i = 0; i < cardsArray.length; i++) {
        var card = cardsArray[i];
        var cardItem = document.getElementById("card".concat(card.id));
        card.position = new Position(0, 0, 0);
        cardItem.style.transform = "translate(0%, 0%) rotate(0deg)";
    }
}

function clearAllTimeouts() {
    // List of timeouts to clear
    const timeouts = [
        timeoutShuffle, timeoutTrumpCard, timeoutInitCards,
        timeoutShowCards, timeoutHideCard, timeoutCenterCards,
        timeoutRestart, timeoutSmoothCenter, timeoutStrictSmooth, timeoutBotAttack,
        timeoutdealnewcards, timeoutRestartRound, timeoutverify,
        timeoutshowwinnerscore
    ];

    // Clear each timeout
    timeouts.forEach(timeout => {
        clearTimeout(timeout);
    });
}

function Restart() {

    playerTurn = true;
    playerscore = 0;
    botscore = 0;
    round = 1;
    HideInfoBox();

    resetCardTransforms(deck.table.cards);
    resetCardTransforms(deck.bot.cards);
    resetCardTransforms(deck.player.cards);
    resetCardTransforms(deck.cards);

    // Set a timeout to clear cards and restart the game
    timeoutSmoothCenter = setTimeout(function () {
        clearCardsAndContainer();
        start();
    }, 800);
}

function StrictRestart() {

    playerTurn = true;
    playerscore = 0;
    botscore = 0;
    round = 1;
    HideInfoBox();
    clearCardsAndContainer();
    clearAllTimeouts();
    start();
}

function StrictSmoothRestart() {
    playerTurn = true;
    playerscore = 0;
    botscore = 0;
    round = 1;
    HideInfoBox();
    clearAllTimeouts();
    deck.CardsToDeck();
    audioPlayer.Play('sweep');
    console.log(deck.cards.length, deck);

    // Apply transformation and style changes to cards
    deck.cards.forEach((card, i) => {
        var cardItem = document.getElementById("card".concat(card.id));
        cardItem.style.transform = "translate(0, ".concat(-40 + i / 3.5, "%) rotate(").concat(-10 + Math.floor(Math.random() * 20), "deg)");
        cardItem.style.transition = ".4s ease";
        cardItem.classList.add('no-shadow');
    });

    timeoutStrictSmooth = setTimeout(function () {
        deck.cards.forEach((card, i) => {
            var cardItem = document.getElementById("card".concat(card.id));
            cardItem.style.transform = "translate(0, ".concat(-40 + i / 3.5, "%) rotate(0deg)");
            cardItem.style.transition = ".35s ease";
        });

        timeoutAccurateShuffle = setTimeout(function () {
            clearCardsAndContainer();
            start();
        }, 400);
    }, 600);

    var winner = document.getElementById('winner');
    if (winner) {
        winner.remove();
    }
}
