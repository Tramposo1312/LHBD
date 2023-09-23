// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: casino.js
// DESC: Provides casino games functions and commands
// TYPE: Server (JavaScript)
// ===========================================================================

const V_CASINO_GAME_NONE = 0;
const V_CASINO_GAME_BLACKJACK = 1;
const V_CASINO_GAME_POKER = 2;
const V_CASINO_GAME_BACCARAT = 3;
const V_CASINO_GAME_ROULETTE = 4;
const V_CASINO_GAME_CRAPS = 5;
const V_CASINO_GAME_HOLDEM = 6;

// ===========================================================================

const V_CASINO_DECK_SUIT_NONE = 1;
const V_CASINO_DECK_SUIT_CLUBS = 1;
const V_CASINO_DECK_SUIT_DIAMONDS = 2;
const V_CASINO_DECK_SUIT_HEARTS = 3;
const V_CASINO_DECK_SUIT_SPADES = 4;

// ===========================================================================

class DeckCard {
	constructor(suit, value, imageName) {
		this.suit = suit;
		this.value = value;
		this.imageName = imageName;
	}
}

// ===========================================================================

let cardDeck = [
	new DeckCard(V_CASINO_DECK_SUIT_CLUBS, 1, "deckCardClubAce"),
	new DeckCard(V_CASINO_DECK_SUIT_CLUBS, 2, "deckCardClubTwo"),
	new DeckCard(V_CASINO_DECK_SUIT_CLUBS, 3, "deckCardClubThree"),
	new DeckCard(V_CASINO_DECK_SUIT_CLUBS, 4, "deckCardClubFour"),
	new DeckCard(V_CASINO_DECK_SUIT_CLUBS, 5, "deckCardClubFive"),
	new DeckCard(V_CASINO_DECK_SUIT_CLUBS, 6, "deckCardClubSix"),
	new DeckCard(V_CASINO_DECK_SUIT_CLUBS, 7, "deckCardClubSeven"),
	new DeckCard(V_CASINO_DECK_SUIT_CLUBS, 8, "deckCardClubEight"),
	new DeckCard(V_CASINO_DECK_SUIT_CLUBS, 9, "deckCardClubNine"),
	new DeckCard(V_CASINO_DECK_SUIT_CLUBS, 10, "deckCardClubTen"),
	new DeckCard(V_CASINO_DECK_SUIT_CLUBS, 11, "deckCardClubJack"),
	new DeckCard(V_CASINO_DECK_SUIT_CLUBS, 12, "deckCardClubQueen"),
	new DeckCard(V_CASINO_DECK_SUIT_CLUBS, 13, "deckCardClubKing"),
	new DeckCard(V_CASINO_DECK_SUIT_DIAMONDS, 1, "deckCardDiamondAce"),
	new DeckCard(V_CASINO_DECK_SUIT_DIAMONDS, 2, "deckCardDiamondTwo"),
	new DeckCard(V_CASINO_DECK_SUIT_DIAMONDS, 3, "deckCardDiamondThree"),
	new DeckCard(V_CASINO_DECK_SUIT_DIAMONDS, 4, "deckCardDiamondFour"),
	new DeckCard(V_CASINO_DECK_SUIT_DIAMONDS, 5, "deckCardDiamondFive"),
	new DeckCard(V_CASINO_DECK_SUIT_DIAMONDS, 6, "deckCardDiamondSix"),
	new DeckCard(V_CASINO_DECK_SUIT_DIAMONDS, 7, "deckCardDiamondSeven"),
	new DeckCard(V_CASINO_DECK_SUIT_DIAMONDS, 8, "deckCardDiamondEight"),
	new DeckCard(V_CASINO_DECK_SUIT_DIAMONDS, 9, "deckCardDiamondNine"),
	new DeckCard(V_CASINO_DECK_SUIT_DIAMONDS, 10, "deckCardDiamondTen"),
	new DeckCard(V_CASINO_DECK_SUIT_DIAMONDS, 11, "deckCardDiamondJack"),
	new DeckCard(V_CASINO_DECK_SUIT_DIAMONDS, 12, "deckCardDiamondQueen"),
	new DeckCard(V_CASINO_DECK_SUIT_DIAMONDS, 13, "deckCardDiamondKing"),
	new DeckCard(V_CASINO_DECK_SUIT_HEARTS, 1, "deckCardHeartAce"),
	new DeckCard(V_CASINO_DECK_SUIT_HEARTS, 2, "deckCardHeartTwo"),
	new DeckCard(V_CASINO_DECK_SUIT_HEARTS, 3, "deckCardHeartThree"),
	new DeckCard(V_CASINO_DECK_SUIT_HEARTS, 4, "deckCardHeartFour"),
	new DeckCard(V_CASINO_DECK_SUIT_HEARTS, 5, "deckCardHeartFive"),
	new DeckCard(V_CASINO_DECK_SUIT_HEARTS, 6, "deckCardHeartSix"),
	new DeckCard(V_CASINO_DECK_SUIT_HEARTS, 7, "deckCardHeartSeven"),
	new DeckCard(V_CASINO_DECK_SUIT_HEARTS, 8, "deckCardHeartEight"),
	new DeckCard(V_CASINO_DECK_SUIT_HEARTS, 9, "deckCardHeartNine"),
	new DeckCard(V_CASINO_DECK_SUIT_HEARTS, 10, "deckCardHeartTen"),
	new DeckCard(V_CASINO_DECK_SUIT_HEARTS, 11, "deckCardHeartJack"),
	new DeckCard(V_CASINO_DECK_SUIT_HEARTS, 12, "deckCardHeartQueen"),
	new DeckCard(V_CASINO_DECK_SUIT_HEARTS, 13, "deckCardHeartKing"),
];

// ===========================================================================

function createBlackJackDeck() {
	let deck = [];
	for (let i in cardDeck) {
		deck.push(cardDeck[i]);
	}
	return deck;
}

// ===========================================================================

function shuffleBlackJackDeck(deck) {
	// For 1000 turns, switch the values of two random cards
	// This may need to be lowered for a more optimized shuffling algorithm (reduces server load)
	for (var i = 0; i < 1000; i++) {
		var location1 = Math.floor((Math.random() * deck.length));
		var location2 = Math.floor((Math.random() * deck.length));
		var tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}
}

// ===========================================================================

function blackJackHitCommand(command, params, client) {
	if (!isPlayerPlayingBlackJack(client)) {
		return false;
	}

	if (isPlayersTurnInBlackJack(client)) {
		return false;
	}

	let hand = getPlayerData(client).casinoCardHand;

	hand.push(deck.pop());

	let tempHandValue = getValueOfBlackJackHand(hand);

	if (handValue > 21) {
		playerBustBlackJack(client);
		return false;
	}
}

// ===========================================================================

function blackJackStandCommand(command, params, client) {
	if (!isPlayerPlayingBlackJack(client)) {
		return false;
	}

	if (isPlayersTurnInBlackJack(client)) {
		return false;
	}

	return true;
}

// ===========================================================================

function dealPlayerBlackJackHand(deck, players) {
	// Alternate handing cards to each player, 2 cards each
	for (var i = 0; i < 2; i++) {
		for (var x = 0; x < players.length; x++) {
			var card = deck.pop();
			getPlayerData(players[i]).casinoCardHand.push(card);
			updateCasinoCardHand(players[i]);
		}
	}
}

// ===========================================================================

function calculateValueOfBlackJackHand(hand) {
	let tempHandValue = 0;

	for (let i in hand) {
		if (hand[i].value == 1) {

			if ((tempHandValue + 11) > 21) {
				tempHandValue += 1;
			} else {
				tempHandValue += 11;
			}
		} else {
			tempHandValue += hand[i].value;
		}
	}
}

// ===========================================================================