var Suit;
(function (Suit) {
    Suit[Suit["DIAMOND"] = 0] = "DIAMOND";
    Suit[Suit["HEART"] = 1] = "HEART";
    Suit[Suit["CLUB"] = 2] = "CLUB";
    Suit[Suit["SPADE"] = 3] = "SPADE";
})(Suit || (Suit = {}));
var SuitName = /** @class */ (function () {
    function SuitName(type, name) {
        this.type = type;
        this.name = name;
    }
    return SuitName;
}());
var Suits = new Map();
Suits.set(Suit.DIAMOND, { type: 0, name: 'diamond' });
Suits.set(Suit.HEART, { type: 1, name: 'heart' });
Suits.set(Suit.CLUB, { type: 2, name: 'club' });
Suits.set(Suit.SPADE, { type: 3, name: 'spade' });

// tefret kafek
class Position {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
    };
}
//--------------
class Card {
    constructor(type, suit, force, id) {
      this.suit = new SuitName(type, suit)
      this.force = force
      this.id = id
    }
  
    GetSuitType = function () {
        if (this.suit.type === 0 || this.suit.type === 1) {
            return 'red';
        }
        return 'black';
    };
    GetSuitForce = function () {
        if (this.force > 7) {
            if (this.force === 8)
                return 'Q';
            if (this.force === 9)
                return 'J';
            if (this.force === 10)
                return 'K';
        }
        return this.force.toString();
    };
};



class Deck {
    constructor() {
        this.cards = [];
        this.player = new Player();
        this.table = new Table();
        this.bot = new Bot();

        // Create the cards
        for (let i = 0; i < 4; i++) {
            const suit = Suits.get(i)?.name;
            for (let j = 0; j < 10; j++) {
                const force = 1 + j;
                this.cards.push(new Card(i, suit, force, i * 10 + j));
            }
        }
        
        

        //------------
        this.trumps = this.Shuffle().suit;
    }

    Shuffle() {
        for (let i = 0; i < 40; i++) {
            const randcard = Math.floor(Math.random() * this.cards.length);
            const temp = this.cards[randcard];
            this.cards[randcard] = this.cards[i];
            this.cards[i] = temp;
        }

        for (let i = 0; i < 40; i++) {
            this.cards[i].id = i;
        }

        return this.cards[0];
    }

    InitPlayer() {
        for (let i = 0; i < 3; i++) {
            this.player.AddCard(this.cards[1]);
            this.cards.splice(1, 1);

            this.bot.AddCard(this.cards[1]);
            this.cards.splice(1, 1);
        }
    }

    InitTable() {
        const initialTableCards = this.cards.splice(0, 4);

        for (let i = 0; i < initialTableCards.length; i++) {
            this.table.AddCard(initialTableCards[i]);
        }

        ArrangeTableCards(this.table.cards);
    }
// on start again
    CardsToDeck() {
        while (this.player.cards.length > 0) {
            const Card_1 = this.player.cards.pop();
            hideCard(Card_1);
            this.cards.push(Card_1);
        }

        while (this.bot.cards.length > 0) {
            const Card_2 = this.bot.cards.pop();
            this.cards.push(Card_2);
        }

        while (this.table.cards.length > 0) {
            const Card_3 = this.table.cards.pop();
            hideCard(Card_3);
            this.cards.push(Card_3);
        }
    }
}

function shufflee() {
    for (var i = 0; i < cardsArray.length; i++) {
        var card = cardsArray[i];
        var cardItem = document.getElementById("card".concat(card.id));
        card.position = new Position(0, 0, 0);
        cardItem.style.transform = "translate(0%, 0%) rotate(0deg)";
    }
} 

class Table {
    constructor() {
      this.cards = []
    }
    AddCard(card) {
        if (!this.cards.includes(card)) {
            this.cards.push(card);
        }
    }
    RemoveCard(card) {
        if (this.cards.includes(card)) {
            this.cards.splice(this.cards.indexOf(card), 1);
        }
    }
}

class Player {
    constructor() {
      this.cards = []
    }
  
    AddCard(card) {
      if (!this.cards.includes(card)) {
        this.cards.push(card)
      }
    }
  
    RemoveCard(card) {
      if (this.cards.includes(card)) {
        this.cards.splice(this.cards.indexOf(card), 1)
      }
    }
}
  

class Bot {
    constructor() {
      this.cards = [];
    }
  
    AddCard(card) {
      if (!this.cards.some(c => c.id === card.id)) {
        this.cards.push(card);
      }
    }
  
    RemoveCard(card) {
      const index = this.cards.findIndex(c => c.id === card.id);
      if (index !== -1) {
        this.cards.splice(index, 1);
      }
    }
}

