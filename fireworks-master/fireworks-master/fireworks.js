const colors = [
	"#ff6f91",
	"#ff9671",
	"#ffc75f",
	"#f9f871",
	"#ff4c4c",
	"#ffcc00"
];
const letters = "I LOVE YOU";
let letterIndex = 0;

// Cargar los sonidos
const launchSound = new Audio("disparo.mp3");
const explosionSound = new Audio("estallido.mp3");

function getRandomLetter() {
	const letter = letters.charAt(letterIndex);
	letterIndex = (letterIndex + 1) % letters.length;
	return letter;
}

function createFirework(x, y) {
	// Reproducir sonido de lanzamiento
	launchSound.currentTime = 0; // Reiniciar sonido
	launchSound.play();

	const launchHeight =
		Math.random() * (window.innerHeight / 4) + window.innerHeight / 4;
	const projectile = document.createElement("div");
	projectile.classList.add("projectile");
	document.body.appendChild(projectile);
	projectile.style.left = `${x}px`;
	projectile.style.top = `${y}px`;

	anime({
		targets: projectile,
		translateY: -launchHeight,
		duration: 1200,
		easing: "easeOutQuad",
		complete: () => {
			projectile.remove();
			createBurst(x, y - launchHeight);
			// Reproducir sonido de explosión
			explosionSound.currentTime = 0; // Reiniciar sonido
			explosionSound.play();
		}
	});
}

function createBurst(x, y) {
	const numLetters = 15;
	const numSparkles = 50;

	// Letras
	for (let i = 0; i < numLetters; i++) {
		createParticle(x, y, false);
	}

	// Chispas
	for (let i = 0; i < numSparkles; i++) {
		createParticle(x, y, true);
	}
}

function createParticle(x, y, isSparkle) {
	const el = document.createElement("div");
	el.classList.add(isSparkle ? "sparkle" : "particule");
	const instruction = document.querySelector('.instructions').style.display = 'none';

	if (!isSparkle) {
		el.textContent = getRandomLetter();
		el.style.color = colors[Math.floor(Math.random() * colors.length)];
	} else {
		el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
	}

	el.style.left = `${x}px`;
	el.style.top = `${y}px`;
	document.body.appendChild(el);

	animateParticle(el, isSparkle);
}

function animateParticle(el, isSparkle) {
	const angle = Math.random() * Math.PI * 2;
	const distance = anime.random(100, 200);
	const duration = anime.random(1200, 2000);
	const fallDistance = anime.random(20, 80);
	const scale = isSparkle ? Math.random() * 0.5 + 0.5 : Math.random() * 1 + 0.5;

	anime
		.timeline({
			targets: el,
			easing: "easeOutCubic",
			duration: duration,
			complete: () => el.remove()
		})
		.add({
			translateX: Math.cos(angle) * distance,
			translateY: Math.sin(angle) * distance,
			scale: [0, scale],
			opacity: [1, 0.9]
		})
		.add({
			translateY: fallDistance,
			opacity: [0.9, 0]
		});
}

// Detectar clic y crear fuegos artificiales
document.addEventListener("click", (e) => {
	createFirework(e.clientX, e.clientY);
});
