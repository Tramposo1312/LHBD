// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: insurance.js
// DESC: Provides insurance commands, functions, and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Insurance Account Owner Types
const V_INS_ACCT_OWNER_NONE = 0;               // None
const V_INS_ACCT_OWNER_PLAYER = 1;             // Player owns insurance company
const V_INS_ACCT_OWNER_BIZ = 2;                // Business owns insurance company
const V_INS_ACCT_OWNER_CLAN = 3;               // Clan owns insurance company

// ===========================================================================

// Insurance Account Entity Types
const V_INS_ACCT_ENTITY_NONE = 0;              // None
const V_INS_ACCT_ENTITY_PLAYER_HEALTH = 1;     // Health Insurance
const V_INS_ACCT_ENTITY_PLAYER_LIFE = 2;       // Life Insurance
const V_INS_ACCT_ENTITY_VEH = 3;               // Vehicle Insurance
const V_INS_ACCT_ENTITY_BIZ = 4;               // Business Insurance
const V_INS_ACCT_ENTITY_HOUSE = 5;             // House Insurance

// ===========================================================================

// Insurance Account History Types
const V_INS_ACCT_HISTORY_NONE = 0;             // None
const V_INS_ACCT_HISTORY_PLAYER_MEDICAL = 1;   // Medical insurance was used (player disease/injury)
const V_INS_ACCT_HISTORY_PLAYER_DEATH = 2;     // Life insurance was used (player death)
const V_INS_ACCT_HISTORY_VEH_DAMAGE = 3;       // Vehicle was damaged, but not destroyed
const V_INS_ACCT_HISTORY_VEH_WRECKED = 4;      // Vehicle was completely destroyed
const V_INS_ACCT_HISTORY_VEH_THEFT = 5;        // Vehicle was stolen
const V_INS_ACCT_HISTORY_BIZ_DAMAGE = 6;       // Business was damaged (broken items/window/door)
const V_INS_ACCT_HISTORY_BIZ_THEFT = 7;        // Business was stolen from
const V_INS_ACCT_HISTORY_HOUSE_DAMAGE = 8;     // House was damaged
const V_INS_ACCT_HISTORY_HOUSE_THEFT = 9;      // House was stolen from

// ===========================================================================