import { NeuralEvolutionManager } from "../controllers/neural/neural_evolution_manager";
import { Simulator } from "../simulation/simulator";

window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("simulation-container");
  if (!container) {
    throw new Error("Elemento 'simulation-container' não encontrado!");
  }
  const simulator = new Simulator(container);
  simulator.start();

  // Form elements
  const generationsInput = document.getElementById("generations") as HTMLInputElement;
  const populationSizeInput = document.getElementById("populationSize") as HTMLInputElement;
  const mutationRateInput = document.getElementById("mutationRate") as HTMLInputElement;
  const startButton = document.getElementById("startEvolution");

  let evolutionManager: NeuralEvolutionManager | null = null;

  startButton?.addEventListener("click", () => {
    // Lê os parâmetros do formulário
    const generations = parseInt(generationsInput.value);
    const populationSize = parseInt(populationSizeInput.value);
    const mutationRate = parseFloat(mutationRateInput.value);

    // Se já houver um processo em execução, interrompe-o
    if (evolutionManager) {
      evolutionManager.stop();
    }

    // Cria um novo gerenciador da evolução e inicia o processo
    evolutionManager = new NeuralEvolutionManager(simulator, populationSize, mutationRate, generations);
    evolutionManager.start();
  });
});
