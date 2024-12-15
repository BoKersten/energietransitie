<script>
	import Battery from '$lib/battery.svelte';
	import Solar from '$lib/solar.svelte';
	import Predictions from '$lib/predictions.svelte';
	import Price from '$lib/price.svelte';
	import { currentReturn, currentNet, predictedUse, predictedGen } from '$lib/store';
	import { Tooltip, Button } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	let chargingInterval = null;
	let dechargingInterval = null;
	let percentage = 0; // Initial percentage value
	let generation; // The input value for the solar generated energy in Kwh
	let usage; // The input value for how much energy is used in Kwh
	let solar = 0;
	let action = 'Klik op de knop om te beginnen'; // This shows what the AI is currently doing in a h2 section called .action
	let returnPrice = null; // The price to return one Kwh of energy to the grid
	let energyPrice = null; // The price to get energy from the grid
	let veo = null;
	let vev = null;
	$: reasons = [];
	const batteryCap = 40; // Set the capacity of the battery to 40 Kwh
	let efficiency = 1.0;
	let charging = false;

	//subscribe to all stores
	currentReturn.subscribe((value) => (returnPrice = -value));
	currentNet.subscribe((value) => (energyPrice = value));
	predictedGen.subscribe((value) => (veo = value));
	predictedUse.subscribe((value) => (vev = value / 1000));
	// Calculate solar output reactively
	$: solar = (parseFloat(generation) || 0) * efficiency;

	$: {
		if (efficiency > 1) efficiency = 1;
		if (percentage > 100) {
			percentage = 100;
			clearInterval(chargingInterval);
			runSim();
		}
	}

	function startCharging() {
		charging = true;
		let surplus = solar - usage;
		action = `Batterij aan het opladen met ${surplus} Kwh`;
		chargingInterval = setInterval(() => {
			// Increase battery percentage based on surplus
			percentage += (surplus / batteryCap) * 100;

			// Cap battery percentage at 100%
			if (percentage >= 100) {
				percentage = 100;

				// When the battery is full
			}
			if (percentage == 100 && returnPrice > 0) {
				// Reduce efficiency dynamically
				efficiency = usage / generation;
				if (efficiency > 1) {
					efficiency = 1;
					deflateBattery();
				}
				console.log(`Updated Efficiency: ${efficiency}`);
				console.log(`Updated Solar Output: ${solar}`);
				action = `Efficiëntie van de zonnepanelen degraderen naar ${efficiency.toFixed(1) * 100}%`;
				reasons = [...reasons, `Terugleveren kost geld namelijk: €${returnPrice}`];
				reasons = [...reasons, `Batterij is vol`];
			} else if (returnPrice < 0 && percentage == 100) {
				// Give surplus energy back to the grid
				giveToGrid();
			}
		}, 1000);
	}

	function giveToGrid() {
		let surplus = solar - usage;
		clearInterval(chargingInterval);
		action = `${surplus} Kwh terug aan het net leveren`;
		reasons = [
			...reasons,
			`Terugleveren levert €${(-returnPrice).toFixed(2)}/kWh op dus voordelig om te leveren`
		];
	}

	function deflateBattery() {
		charging = false;

		let deficit = usage - solar; // Energy shortfall
		if (percentage > 0) {
			// Use battery energy to cover the shortfall
			action = `${deficit} Kwh van de batterij gebruiken`;
			reasons = [...reasons, `Batterij heeft genoeg energie om te gebruiken`];

			dechargingInterval = setInterval(() => {
				percentage -= (deficit / batteryCap) * 100;
				if (percentage < 0) {
					percentage = 0;
					clearInterval(dechargingInterval);
				}
			}, 1000);
		} else {
			// If battery is empty, take energy from the grid
			action = `${deficit} Kwh van het net gebruiken`;
			clearInterval(dechargingInterval);
			reasons = [...reasons, `Batterij is leeg`];
		}
	}

	function runSim() {
		reasons = [];
		console.log(`Vev: ${vev}, Veo: ${veo}`);
		console.log(`Return: ${returnPrice} Takeprice: ${energyPrice}`);
		console.log(`Solar: ${solar}, Usage: ${usage}`);
		clearInterval(chargingInterval);
		clearInterval(dechargingInterval);

		if (solar > usage || generation > usage) {
			startCharging();
			reasons = [...reasons, `Opwek is hoger dan verbruik`];
		} else if (solar < usage) {
			deflateBattery();
			reasons = [...reasons, `Verbruik is hoger dan opwek`];
		} else if (solar == usage) {
			if (percentage > 100) {
				percentage = 100;
			}
			if (percentage == 100) {
				action = 'Geen actie nodig';
				reasons = [...reasons, `Opwek is gelijk aan verbruik`];
				reasons = [...reasons, `Batterij is vol`];
			} else if (percentage < 100 && efficiency < 1.0) {
				efficiency = 1.0;
			} else if (percentage < 100 && energyPrice < 0.3 && efficiency == 1.0) {
				action = `1.2 kWh van het net nemen om de batterij mee op te laden`;
				reasons = [...reasons, `Energie is nu goedkoop namelijk: €${energyPrice.toFixed(2)}/kWh`];
				reasons = [
					...reasons,
					`De zonnepanelen staan al maximaal dus kunnen niet nog meer opleveren`
				];
				chargingInterval = setInterval(() => {
					percentage += 3;
				}, 1000);
			} else {
				action = `Geen actie nodig`;
				reasons = [...reasons, `Energie is duur namelijk €${energyPrice}/kWh`];
				reasons = [...reasons, `Opwek is gelijk aan verbruik`];
			}
		}
	}
</script>

<div class="header">
	<div class="inputs">
		<input placeholder="Opwek in kWh" type="number" bind:value={generation} class="input1" />
		<input placeholder="Verbruik in kWh" type="number" bind:value={usage} class="input2" />
		<input type="button" class="btn" value="Run sim" on:click={runSim} />
	</div>
</div>
<div class="main">
	<Price></Price>

	<Battery {percentage}></Battery>

	<Predictions></Predictions>
	<Solar efficiency={efficiency * 100}></Solar>
	<div class="action">
		<div class="text">
			<h2>{action}</h2>
			{#if reasons.length > 0}
				<Button class="p-0 bg-transparent border-none focus:outline-none hover:bg-transparent"
					><InfoCircleSolid class="w-12 h-12" color="#0091d5"></InfoCircleSolid></Button
				>
				<Tooltip type="custom" class="bg-cyan-600 text-white" placement="top"
					><p>Redenen:</p>
					{#each reasons as reason}
						<li>{reason}</li>
					{/each}</Tooltip
				>
			{/if}
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

	.header {
		width: 100vw;
		height: fit-content;

		margin-top: 20px;
	}
	.main {
		margin-top: 20px;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(5, 1fr);
		grid-column-gap: 10px;
		grid-row-gap: 10px;
	}
	.text {
		display: flex;
		gap: 10px;
	}
	.action {
		grid-area: 5 / 1 / 6 / 6;
		background-color: white;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-left: 10px;
		margin-right: 10px;
		border-radius: 15px;
		min-height: fit-content;
	}
	h2 {
		font-size: 45px;
		font-family: 'Roboto', serif;
		font-weight: 400;
		font-style: normal;
	}
	input {
		width: 150px;
		margin-top: 10px;
		padding: 10px;
	}

	input[type='button'] {
		background-color: rgb(81, 81, 168);
		border: none;
		border-radius: 5px;
		color: white;
		width: fit-content;
		height: fit-content;
		padding: 10px;
		cursor: pointer;
	}
	input[type='button']:hover {
		background-color: rgb(71, 71, 150);
	}

	.inputs {
		width: fit-content;
		margin: auto;
	}

	/* action container css */

	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #f1f1f1;
	}
</style>
