<script>
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
			text: 'Deze input velden simuleren de meterkast. In dit veld vul je het aantal Kwh in dat op dit moment wordt opgewekt door zonnepannelen.',
			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});

		tour.addStep({
			id: 'step2',
			title: 'Input velden (verbruik)',
			attachTo: { element: '.input2', on: 'bottom' },
			text: 'En in dit veld vul je het aantal Kwh in dat op dit moment wordt verbruikt door het huishouden.',
			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});

		tour.addStep({
			id: 'step3',
			title: 'Batterij',
			text: 'In ons systeem maken wij gebruik van een oude autobatterij. Hier past ongeveer 40 Kwh in en in deze sectie kun je zien hoe ver de batterij is opgeladen',
			attachTo: { element: '.battery-component', on: 'left' },
			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});
		tour.addStep({
			id: 'step4',
			title: 'Terugleverprijs en leverprijs',
			text: 'In dit kopje kun je zien hoeveel de batterij is opgeladen in procenten. In totaal past er in de batterij 40 Kw.',
			attachTo: { element: '.price-component', on: 'right' },
			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});

		tour.addStep({
			id: 'step5',
			title: 'Efficiëntie zonnepanelen',
			text: 'Hier kun je weerzien hoe efficiënt de zonnepanelen staan, soms kan het namelijk handig zijn om zonnepanelen minder efficiënt te zetten.',
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
			text: `Wij hebben op basis van weerdata en data over huishoudelijk
             verbruik een ai-model getraint die voorspelt op basis van wat het
              weer doet hoeveel energie het huishouden gaat verbruiken en opwekken met zonnepanelen.`,
			attachTo: { element: '.predict-component', on: 'left' },

			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});

		tour.addStep({
			id: 'step7',
			title: 'De laatste stap',
			text: `Als je op deze knop drukt gaat hij op basis van alle info van net de beste keuze maken om zo zo min mogelijk netcongestie te veroorzaken`,
			attachTo: { element: '.btn', on: 'bottom' },
			scrollTo: true,
			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});

		tour.addStep({
			id: 'step8',
			title: 'De laatste stap',
			text: `Wat het programma op dit moment doet zie je hier weer`,
			attachTo: { element: '.action', on: 'top' },
			scrollTo: true,
			buttons: [
				{ text: 'Terug', action: tour.back },
				{ text: 'Volgende', action: tour.next }
			]
		});

		tour.addStep({
			id: 'end',
			title: 'De laatste stap',
			text: `Vul nu de input velden in en klik op de knop`,
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

<slot />

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
</style>
