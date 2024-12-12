<script>
	import Battery from '$lib/battery.svelte';
	import Solar from '$lib/solar.svelte';
	import Predictions from '$lib/predictions.svelte';
	import Price from '$lib/price.svelte';
	import { currentReturn, currentNet, predictedUse, predictedGen } from '$lib/store';
	let chargingInterval = null;
	let dechargingInterval = null;
	let percentage = 0; // Initial percentage value
	let generation; // The input value for the solar generated energy in Kwh
	let usage; // The input value for how much energy is used in Kwh
	let solar = 0;
	let action = 'Run the simulation first'; // This shows what the AI is currently doing in a h2 section called .action
	let returnPrice = null; // The price to return one Kwh of energy to the grid
	let energyPrice = null; // The price to get energy from the grid
	let veo = null;
	let vev = null;
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
		action = `Charging battery with ${surplus} Kwh`;
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
				action = `Setting efficiency to ${efficiency.toFixed(1) * 100}%`;
			} else if (returnPrice < 0 && percentage == 100) {
				// Give surplus energy back to the grid
				giveToGrid();
			}
		}, 1000);
	}

	function giveToGrid() {
		let surplus = solar - usage;
		clearInterval(chargingInterval);
		action = `Giving ${surplus} Kwh to the grid`;
	}

	function deflateBattery() {
		charging = false;

		let deficit = usage - solar; // Energy shortfall
		if (percentage > 0) {
			// Use battery energy to cover the shortfall
			action = `Using ${deficit} Kwh from the battery`;
			dechargingInterval = setInterval(() => {
				percentage -= (deficit / batteryCap) * 100;
				if (percentage < 0) {
					percentage = 0;
					clearInterval(dechargingInterval);
				}
			}, 1000);
		} else {
			// If battery is empty, take energy from the grid
			action = `Taking ${deficit} Kwh from the grid`;
			clearInterval(dechargingInterval);
		}
	}

	function runSim() {
		console.log(`Vev: ${vev}, Veo: ${veo}`);
		console.log(`Return: ${returnPrice} Takeprice: ${energyPrice}`);
		console.log(`Solar: ${solar}, Usage: ${usage}`);
		clearInterval(chargingInterval);
		clearInterval(dechargingInterval);
		if (solar > usage || generation > usage) {
			startCharging();
		} else if (solar < usage) {
			deflateBattery();
		} else if (solar == usage) {
			if (percentage > 100) {
				percentage = 100;
			}
			if (percentage == 100) {
				action = 'No surplus or deficit and battery full. No action required.';
			} else if (percentage < 100 && efficiency < 1.0) {
				efficiency = 1.0;
			} else if (percentage < 100 && energyPrice < 0.3 && efficiency == 1.0) {
				action = `Taking 1.2Kwh from the grid and charging the battery with it`;
				chargingInterval = setInterval(() => {
					percentage += 3;
				}, 1000);
			}
		}
	}
</script>

<div class="header">
	<div class="inputs">
		<input placeholder="Opwek in Kwh" type="number" bind:value={generation} class="input1" />
		<input placeholder="Verbruik in Kwh" type="number" bind:value={usage} class="input2" />
		<input type="button" class="btn" value="Run sim" on:click={runSim} />
	</div>
</div>
<div class="main">
	<Price></Price>

	<Battery {percentage}></Battery>

	<Predictions></Predictions>
	<Solar efficiency={efficiency * 100}></Solar>
	<div class="action">
		<h2>{action}</h2>
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
	.action {
		grid-area: 5 / 1 / 6 / 6;
		background-color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 10px;
		margin-right: 10px;
	}
	h2 {
		font-size: 50px;
		font-family: 'Roboto', serif;
		font-weight: 400;
		font-style: normal;
	}
	input {
		width: 130px;
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
