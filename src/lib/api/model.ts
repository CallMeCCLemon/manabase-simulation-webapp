
export interface DeckStats {
	totalManaPips: SimplifiedManaCost;
	totalCards: number;
	lands: number;
	nonLands: number;
}

export interface SimplifiedManaCost {
	whiteMana: number;
	blueMana: number;
	blackMana: number;
	redMana: number;
	greenMana: number;
	colorlessMana: number;
	genericCost: number;
}

export interface SimulateQueryInputs {
	deckList: string;
	initialHandSize: number;
	cardsDrawnPerTurn: number;
	onThePlay: boolean;
	targetTurn: number;
	formattedManaCost: string[];
	genericManaCost: number;
}

