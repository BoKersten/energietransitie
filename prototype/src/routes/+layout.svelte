<script>
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';
	import Shepherd from 'shepherd.js';
	import 'shepherd.js/dist/css/shepherd.css';

	let tour;

	onMount(() => {
		tour = new Shepherd.Tour({
			defaultStepOptions: {
				useModalOverlay: true,
				classes: 'shepherd-theme-arrows',
				scrollTo: false,
				cancelIcon: {
					enabled: true
				}
			}
		});

		tour.addStep({
			id: 'start',
			title: 'Stap 1: Welkom bij de tour!',
			text: "Voordat je begint, willen we je graag een korte rondleiding geven door deze applicatie. Klik op 'Volgende' om te starten. Weet je al hoe het werkt klik dan op 'overslaan'.",
			buttons: [
				{ text: 'Overslaan', action: tour.complete },
				{ text: 'Volgende', action: tour.next }
			]
		});

		tour.addStep({
			id: 'step1',
			title: 'Input velden',
			attachTo: { element: '.input1', on: 'bottom' },
			text: 'Deze invoervelden simuleren de meterkast. In dit veld vul je het aantal kWh in dat op dit moment wordt opgewekt door zonnepanelen.',
			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});

		tour.addStep({
			id: 'step2',
			title: 'Input velden',
			attachTo: { element: '.input2', on: 'bottom' },
			text: 'En in dit veld vul je het aantal kWh in dat op dit moment wordt verbruikt door het huishouden',
			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});

		tour.addStep({
			id: 'step3',
			title: 'Oude autobatterij',
			text: 'In ons systeem gebruiken we een oude autobatterij met een capaciteit van ongeveer 40 kWh. In deze sectie kun je zien hoe vol de batterij is opgeladen',
			attachTo: { element: '.battery-component', on: 'left' },
			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});
		tour.addStep({
			id: 'step4',
			title: 'Terugleververgoeding en leverprijs',
			text: 'Hier kun je zien wat de terugleververgoeding en de leverprijs per kWh aan het net zijn. Deze gegevens worden door het programma gebruikt om keuzes te maken. Deze data is afkomstig van <a href="https://www.easyenergy.com/">easyenergy.com</a>',
			attachTo: { element: '.price-component', on: 'right' },
			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});

		tour.addStep({
			id: 'step5',
			title: 'Efficiëntie zonnepanelen',
			text: 'Hier kun je zien hoe efficiënt de zonnepanelen werken. Soms kan het namelijk handig zijn om de efficiëntie van de zonnepanelen te verlagen, bijvoorbeeld in de zomer wanneer er veel stroom wordt teruggeleverd aan het net.',
			attachTo: { element: '.solar-component', on: 'right' },
			scrollTo: true,
			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});

		tour.addStep({
			id: 'step6',
			title: 'Voorspellingen',
			text: `Wij hebben op basis van weerdata en gegevens over huishoudelijk verbruik een AI-model getraind. Dit model voorspelt, op basis van het weer, hoeveel energie het huishouden zal verbruiken en opwekken met zonnepanelen.`,
			attachTo: { element: '.predict-component', on: 'left' },

			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});

		tour.addStep({
			id: 'step7',
			title: 'Bijna klaar',
			text: `Als je op deze knop drukt gaat hij op basis van alle info van net de beste keuze maken om zo zo min mogelijk netcongestie te veroorzaken.`,
			attachTo: { element: '.btn', on: 'bottom' },
			scrollTo: true,
			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});

		tour.addStep({
			id: 'step8',
			title: 'Bijna klaar',
			text: `Wat het programma op dit moment doet zie je hier weer.`,
			attachTo: { element: '.action', on: 'top' },
			scrollTo: true,
			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});

		tour.addStep({
			id: 'end',
			title: 'Bijna klaar',
			text: `Vul nu de input velden in en klik op de knop.`,
			attachTo: { element: '.btn', on: 'bottom' },
			scrollTo: true,
			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Beginnen', action: tour.complete }
			]
		});

		tour.start();
	});

	onDestroy(() => {
		if (tour) tour.destroy();
	});
</script>

<slot></slot>

<style>
	:global(body) {
		padding: 0;
		margin: 0;
	}

	:global(.shepherd-element) {
		background-color: whitesmoke;
		border: none;
		padding: 0;
	}

	:global(.shepherd-footer) {
		padding: 20px;
	}

	:global(.shepherd-arrow::before) {
		background-color: whitesmoke; /* Change to your desired color */
		border: none; /* Remove any default border if necessary */
	}
	:global(html) {
		scroll-behavior: smooth;
	}
	:global(.shepherd-button) {
		background-color: rgb(81, 81, 168);
		color: white;
	}

	:global(.shepherd-button:not(:disabled):hover) {
		background-color: rgb(52, 52, 131);
		color: white;
	}

	:global(a) {
		text-decoration: none;
		font-weight: bold;
	}
</style>
