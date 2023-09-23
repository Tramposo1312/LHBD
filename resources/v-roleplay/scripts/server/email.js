// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: email.js
// DESC: Provides email handling, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Email Methods
const V_EMAIL_METHOD_NONE = 0;							// None
const V_EMAIL_METHOD_SMTP_MODULE = "smtp";				// Use SMTP module
const V_EMAIL_METHOD_GET_REQUEST = "http";				// Use HTTP request (httpGet to custom PHP page)

// ===========================================================================

function initEmailScript() {
	logToConsole(LOG_INFO, "[V.RP.Email]: Initializing email script ...");
	logToConsole(LOG_INFO, "[V.RP.Email]: Email script initialized successfully!");
}

// ===========================================================================

async function sendEmail(toEmail, toName, subject, body) {
	switch (getEmailConfig().method) {
		case V_EMAIL_METHOD_SMTP_MODULE:
			if (!checkForSMTPModule()) {
				return false;
			}

			Promise.resolve().then(() => {
				module.smtp.send(
					getEmailConfig().smtp.host,
					getEmailConfig().smtp.port,
					intToBool(getEmailConfig().smtp.useTLS),
					getEmailConfig().smtp.username,
					getEmailConfig().smtp.password,
					toEmail,
					toName,
					subject,
					body,
					getEmailConfig().smtp.from,
					getEmailConfig().smtp.fromName
				);
			});
			break;

		case V_EMAIL_METHOD_GET_REQUEST:
			let tempURL = getEmailConfig().http.baseURL;
			tempURL = tempURL.replace("{0}", encodeURIComponent(getEmailConfig().http.password));
			tempURL = tempURL.replace("{1}", encodeURIComponent(toEmail));
			tempURL = tempURL.replace("{2}", encodeURIComponent(toName));
			tempURL = tempURL.replace("{3}", encodeURIComponent(subject));
			tempURL = tempURL.replace("{4}", encodeURIComponent(body));

			httpGet(
				tempURL,
				"",
				function (data) {

				},
				function (data) {
				}
			);
			break;

		default:
			return false;
	}

	return true;
}

// ===========================================================================

function getEmailConfig() {
	return getGlobalConfig().email;
}

// ===========================================================================