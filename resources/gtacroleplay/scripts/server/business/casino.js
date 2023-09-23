// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: casino.js
// DESC: Provides casino business functions and usage
// TYPE: Business (JavaScript)
// ===========================================================================

let deckCards = [
    DeckCardData("deckCardSpadeAce", VRR_DECKCARD_SUIT_SPADE, 1),
    DeckCardData("deckCardSpade2", VRR_DECKCARD_SUIT_SPADE, 2),
    DeckCardData("deckCardSpade3", VRR_DECKCARD_SUIT_SPADE, 3),
    DeckCardData("deckCardSpade4", VRR_DECKCARD_SUIT_SPADE, 4),
    DeckCardData("deckCardSpade5", VRR_DECKCARD_SUIT_SPADE, 5),
    DeckCardData("deckCardSpade6", VRR_DECKCARD_SUIT_SPADE, 6),
    DeckCardData("deckCardSpade7", VRR_DECKCARD_SUIT_SPADE, 7),
    DeckCardData("deckCardSpade8", VRR_DECKCARD_SUIT_SPADE, 8),
    DeckCardData("deckCardSpade9", VRR_DECKCARD_SUIT_SPADE, 9),
    DeckCardData("deckCardSpade10", VRR_DECKCARD_SUIT_SPADE, 10),
    DeckCardData("deckCardSpadeJack", VRR_DECKCARD_SUIT_SPADE, 11),
    DeckCardData("deckCardSpadeQueen", VRR_DECKCARD_SUIT_SPADE, 12),
    DeckCardData("deckCardSpadeKing", VRR_DECKCARD_SUIT_SPADE, 13),
    DeckCardData("deckCardClubAce", VRR_DECKCARD_SUIT_CLUB, 1),
    DeckCardData("deckCardClub2", VRR_DECKCARD_SUIT_CLUB, 2),
    DeckCardData("deckCardClub3", VRR_DECKCARD_SUIT_CLUB, 3),
    DeckCardData("deckCardClub4", VRR_DECKCARD_SUIT_CLUB, 4),
    DeckCardData("deckCardClub5", VRR_DECKCARD_SUIT_CLUB, 5),
    DeckCardData("deckCardClub6", VRR_DECKCARD_SUIT_CLUB, 6),
    DeckCardData("deckCardClub7", VRR_DECKCARD_SUIT_CLUB, 7),
    DeckCardData("deckCardClub8", VRR_DECKCARD_SUIT_CLUB, 8),
    DeckCardData("deckCardClub9", VRR_DECKCARD_SUIT_CLUB, 9),
    DeckCardData("deckCardClub10", VRR_DECKCARD_SUIT_CLUB, 10),
    DeckCardData("deckCardClubJack", VRR_DECKCARD_SUIT_CLUB, 11),
    DeckCardData("deckCardClubQueen", VRR_DECKCARD_SUIT_CLUB, 12),
    DeckCardData("deckCardClubKing", VRR_DECKCARD_SUIT_CLUB, 13),
    DeckCardData("deckCardHeartAce", VRR_DECKCARD_SUIT_HEART, 1),
    DeckCardData("deckCardHeart2", VRR_DECKCARD_SUIT_HEART, 2),
    DeckCardData("deckCardHeart3", VRR_DECKCARD_SUIT_HEART, 3),
    DeckCardData("deckCardHeart4", VRR_DECKCARD_SUIT_HEART, 4),
    DeckCardData("deckCardHeart5", VRR_DECKCARD_SUIT_HEART, 5),
    DeckCardData("deckCardHeart6", VRR_DECKCARD_SUIT_HEART, 6),
    DeckCardData("deckCardHeart7", VRR_DECKCARD_SUIT_HEART, 7),
    DeckCardData("deckCardHeart8", VRR_DECKCARD_SUIT_HEART, 8),
    DeckCardData("deckCardHeart9", VRR_DECKCARD_SUIT_HEART, 9),
    DeckCardData("deckCardHeart10", VRR_DECKCARD_SUIT_HEART, 10),
    DeckCardData("deckCardHeartJack", VRR_DECKCARD_SUIT_HEART, 11),
    DeckCardData("deckCardHeartQueen", VRR_DECKCARD_SUIT_HEART, 12),
    DeckCardData("deckCardHeartKing", VRR_DECKCARD_SUIT_HEART, 13),
    DeckCardData("deckCardDiamondAce", VRR_DECKCARD_SUIT_DIAMOND, 1),
    DeckCardData("deckCardDiamond2", VRR_DECKCARD_SUIT_DIAMOND, 2),
    DeckCardData("deckCardDiamond3", VRR_DECKCARD_SUIT_DIAMOND, 3),
    DeckCardData("deckCardDiamond4", VRR_DECKCARD_SUIT_DIAMOND, 4),
    DeckCardData("deckCardDiamond5", VRR_DECKCARD_SUIT_DIAMOND, 5),
    DeckCardData("deckCardDiamond6", VRR_DECKCARD_SUIT_DIAMOND, 6),
    DeckCardData("deckCardDiamond7", VRR_DECKCARD_SUIT_DIAMOND, 7),
    DeckCardData("deckCardDiamond8", VRR_DECKCARD_SUIT_DIAMOND, 8),
    DeckCardData("deckCardDiamond9", VRR_DECKCARD_SUIT_DIAMOND, 9),
    DeckCardData( "deckCardDiamond10", VRR_DECKCARD_SUIT_DIAMOND, 10),
    DeckCardData("deckCardDiamondJack", VRR_DECKCARD_SUIT_DIAMOND, 11),
    DeckCardData("deckCardDiamondQueen", VRR_DECKCARD_SUIT_DIAMOND, 12),
    DeckCardData("deckCardDiamondKing", VRR_DECKCARD_SUIT_DIAMOND, 13),
];

let deckCardBacks = [

]