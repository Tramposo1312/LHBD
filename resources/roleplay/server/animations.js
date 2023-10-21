function playClientAnimation(anAnimation, client) {
	triggerNetworkEvent("AnimationPlay", client, anAnimation);
}


addCommandHandler("talk", (command, params, client) => {
	playClientAnimation(`Gestikulace05.i3d`);
});

addCommandHandler("point", (command, params, client) => {
	playClientAnimation(`GestoPojdSem02.i3d`);
})

addCommandHandler("drink", (command, params, client) => {
	playClientAnimation(`GestSklNapitise.i3d`);
})
addCommandHandler("wound", (command, params, client) => {
	playClientAnimation(`game12 sara01 chyceni f.i3d`);
})
