// document.addEventListener("DOMContentLoaded", function () {
//     const submitButton = document.querySelector(".button_outer button");
//     const graphContainer = document.querySelector(".graph_div");
//     const speciesNameInput = document.querySelector(".species-name");
//     const screenElement = document.querySelector(".screen");

//     // Add CSS styles to center the text in screen element
//     screenElement.style.display = "flex";
//     screenElement.style.justifyContent = "center";
//     screenElement.style.alignItems = "center";

//     const ctx = document.createElement("canvas");
//     graphContainer.appendChild(ctx);
//     let chartInstance = null;

//     function convertToDays(value, unit) {
//         const daysPerUnit = {
//             "Days": 1,
//             "Weeks": 7,
//             "Months": 30,
//             "Years": 365
//         };
//         return value * (daysPerUnit[unit] || 1);
//     }

//     function calculatePopulationGrowth() {
//         const speciesName = speciesNameInput.value.trim() || "Unknown Species";

//         const inputs = document.querySelectorAll(".mid_col_in input");
//         let initialPopulation = parseInt(inputs[0].value);
//         const offspringPerBirth = parseInt(inputs[1].value);
//         const totalTimeElapsed = parseInt(inputs[2].value);

//         const bottomInputs = document.querySelectorAll(".bottom_input_outer input");
//         const bottomSelects = document.querySelectorAll(".bottom_input_outer select");

//         const timeToReproduce = parseFloat(bottomInputs[0].value);
//         const reproductionAge = convertToDays(timeToReproduce, bottomSelects[0].value);

//         const gestationPeriod = parseFloat(bottomInputs[1].value);
//         const gestationDays = convertToDays(gestationPeriod, bottomSelects[1].value);

//         const timeBetweenPregnancies = parseFloat(bottomInputs[2].value);
//         const intervalBetweenPregnancies = convertToDays(timeBetweenPregnancies, bottomSelects[2].value);

//         const lifespan = parseFloat(bottomInputs[3].value);
//         const lifespanInDays = convertToDays(lifespan, bottomSelects[3].value);

//         const totalSimulationDays = convertToDays(totalTimeElapsed, "Years");
        
//         let alive = initialPopulation;
//         let totalDeaths = 0;
//         let totalPopulation = initialPopulation;

//         const populationData = [];
//         const deathData = [];
//         const aliveData = [];
//         const birthData = [];
//         const labels = [];
//         const birthHistory = {};

//         for (let day = 0; day <= totalSimulationDays; day += 365) {
//             const year = Math.floor(day / 365);
//             if (!birthHistory[year]) birthHistory[year] = 0;

//             const birthRate = Math.max(0.5, Math.min(3, 10 / (1 + alive / 1000000))); 

//             const newBirths = Math.floor(alive * (offspringPerBirth * birthRate) / 2);
//             birthHistory[year] += newBirths;
//             totalPopulation += newBirths;
//             alive += newBirths;

//             const deathYear = year - Math.floor(lifespanInDays / 365);
//             let deathsThisYear = 0;
//             if (birthHistory[deathYear]) {
//                 deathsThisYear = Math.floor(birthHistory[deathYear] * 0.9); 
//                 delete birthHistory[deathYear]; 
//             }

//             deathsThisYear = Math.min(deathsThisYear, alive);
//             alive -= deathsThisYear;
//             totalDeaths += deathsThisYear;
//             populationData.push(totalPopulation);
//             deathData.push(deathsThisYear); 
//             aliveData.push(alive);
//             birthData.push(newBirths);
//             labels.push(`Year ${year}`);
//         }

//         // Update the screen element with current alive population
//         screenElement.textContent = alive.toLocaleString();

//         updateChart(labels, populationData, deathData, aliveData, birthData, speciesName);
//     }

//     function updateChart(labels, populationData, deathData, aliveData, birthData, speciesName) {
//         if (chartInstance) {
//             chartInstance.destroy();
//         }
//         chartInstance = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: labels,
//                 datasets: [
//                     {
//                         label: "Total Population",
//                         data: populationData,
//                         borderColor: "blue",
//                         backgroundColor: "rgba(0, 0, 255, 0.2)",
//                         borderWidth: 2,
//                         fill: true,
//                     },
//                     {
//                         label: "Deaths per Year",
//                         data: deathData,
//                         borderColor: "red",
//                         backgroundColor: "rgba(255, 0, 0, 0.2)",
//                         borderWidth: 2,
//                         fill: true,
//                     },
//                     {
//                         label: "Alive Population",
//                         data: aliveData,
//                         borderColor: "green",
//                         backgroundColor: "rgba(0, 255, 0, 0.2)",
//                         borderWidth: 2,
//                         fill: true,
//                     },
//                     {
//                         label: "Births per Year",
//                         data: birthData,
//                         borderColor: "purple",
//                         backgroundColor: "rgba(128, 0, 128, 0.2)",
//                         borderWidth: 2,
//                         fill: true,
//                     },
//                 ],
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     title: {
//                         display: true,
//                         text: `Population Growth of ${speciesName}`,
//                         font: {
//                             size: 18,
//                             weight: 'bold'
//                         },
//                         padding: 15
//                     }
//                 },
//                 scales: {
//                     x: { 
//                         title: { display: true, text: "Time (Years)" } 
//                     },
//                     y: { 
//                         title: { display: true, text: "Population Count" }, 
//                         beginAtZero: true,
//                         ticks: {
//                             callback: function(value) {
//                                 if(value >= 1e24) return (value / 1e24).toFixed(1) + "Y";
//                                 if(value >= 1e21) return (value / 1e21).toFixed(1) + "Z";
//                                 if(value >= 1e18) return (value / 1e18).toFixed(1) + "E";
//                                 if(value >= 1e15) return (value / 1e15).toFixed(1) + "P"; 
//                                 if(value >= 1e12) return (value / 1e12).toFixed(1) + "T";
//                                 if (value >= 1e9) return (value / 1e9).toFixed(1) + "B"; 
//                                 if (value >= 1e6) return (value / 1e6).toFixed(1) + "M"; 
//                                 if (value >= 1e3) return (value / 1e3).toFixed(1) + "K"; 
//                                 return value; 
//                             }
//                         }
//                     }
//                 }
//             }                       
//         });
//     }

//     submitButton.addEventListener("click", function (e) {
//         e.preventDefault();
//         calculatePopulationGrowth();
//     });
// });
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