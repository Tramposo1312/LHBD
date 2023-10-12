
let nativeIncome = 1000;





// ==========================================================================================================
function PlayerPayDay() {
    messageClient("== Payday! =============================", client, COLOUR_YELLOW);
	messageClient(`Paycheck: {ALTCOLOUR}$${nativeIncome}`, client, COLOUR_GREEN);
	messageClient(`Taxes: {ALTCOLOUR}$${incomeTaxAmount}`, client,COLOUR_GREEN);
	messageClient(`You receive: {ALTCOLOUR}$${netIncome}`, client, COLOUR_GREEN);
}
// ==========================================================================================================
