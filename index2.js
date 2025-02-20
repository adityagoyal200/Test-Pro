document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.querySelector(".button_outer button");
    const graphContainer = document.querySelector(".graph_div");
    const speciesNameInput = document.querySelector(".species-name");
    const screenElement = document.querySelector(".screen");

    screenElement.style.display = "flex";
    screenElement.style.justifyContent = "center";
    screenElement.style.alignItems = "center";

    const ctx = document.createElement("canvas");
    graphContainer.appendChild(ctx);
    let chartInstance = null;

    function convertToDays(value, unit) {
        switch (unit) {
            case "Weeks": return value * 7;
            case "Months": return value * 30;
            case "Years": return value * 365;
            default: return value;
        }
    }

    function calculatePopulationGrowth() {
        const speciesName = speciesNameInput.value.trim() || "Unknown Species";

        const inputs = document.querySelectorAll(".mid_col_in input");
        let initialPopulation = parseInt(inputs[0].value);
        const offspringPerBirth = parseInt(inputs[1].value);
        const totalTimeElapsed = parseInt(inputs[2].value);

        const bottomInputs = document.querySelectorAll(".bottom_input_outer input");
        const bottomSelects = document.querySelectorAll(".bottom_input_outer select");

        const ageReporductionBegin = parseFloat(bottomInputs[0].value);
        const ageReporductionBeginDays = convertToDays(ageReporductionBegin, bottomSelects[0].value);

        const ageReproductionEnd = parseFloat(bottomInputs[1].value);
        const ageReproductionEndDays = convertToDays(ageReproductionEnd, bottomSelects[1].value);

        const gestationPeriod = parseFloat(bottomInputs[2].value);
        const gestationDays = convertToDays(gestationPeriod, bottomSelects[2].value);

        const daysBetweenPregnancies = parseFloat(bottomInputs[3].value);
        const intervalBetweenPregnancies = convertToDays(daysBetweenPregnancies, bottomSelects[3].value);

        const lifespan = parseFloat(bottomInputs[4].value);
        const lifespanInDays = convertToDays(lifespan, bottomSelects[4].value);

        const totalDays = convertToDays(totalTimeElapsed, "Years");

        // Calculate RGI (Reproductive Generation Interval)
        const RGI = ageReproductionEndDays - ageReporductionBeginDays + 
                   gestationDays + intervalBetweenPregnancies;

        const generations = Math.floor(totalDays / RGI);

        let population = initialPopulation;
        const populationData = [];
        const labels = [];

        if (RGI > 0 && generations > 0) {
            for (let i = 0; i < generations; i++) {
                population += population * offspringPerBirth;
                populationData.push(population);
                labels.push(`Gen ${i + 1}`);
                if (i * RGI >= lifespanInDays) break;
            }
        }

        screenElement.textContent = population.toLocaleString();

        updateChart(labels, populationData, speciesName);
    }

    function updateChart(labels, populationData, speciesName) {
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Population Growth",
                    data: populationData,
                    borderColor: "#4CAF50",
                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                    borderWidth: 2,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Population Growth of ${speciesName}`,
                        font: {
                            size: 18,
                            weight: 'bold'
                        },
                        padding: 15
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: "Generations" }
                    },
                    y: {
                        title: { display: true, text: "Population Count" },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    submitButton.addEventListener("click", function (e) {
        e.preventDefault();
        calculatePopulationGrowth();
    });
});