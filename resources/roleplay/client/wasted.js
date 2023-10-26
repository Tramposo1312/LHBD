

let wastedState = 0
let timer

function OnWasted() {
	game.hud.message("DEAD", 4000, 2)
	timer = 0.0
}

addEventHandler("OnProcess", function(event, deltaTime) {

	if (localPlayer.health <= 1.0) {
		if (wastedState == 0) {
			OnWasted()
			wastedState = 1
		}
	}
	if (wastedState == 1) {
		timer = timer + deltaTime
		if (timer >= 3.0) {
			game.cameraFade(1.0, false)
			wastedState = 2
		}
	}
})

addEventHandler("OnPedSpawn", function(event, ped) {
	if (ped == GetLocalPlayer()) {
		if (wastedState == 2) {
			GTA.Camera.Fade(1.0, true)
		}
		wastedState = 0
	}
})