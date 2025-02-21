import { Simulator } from "../../simulation/simulator";
import { GeneticAlgorithm } from "./genetic";
import { NeuralPlayer } from "./neural_player";

export class NeuralEvolutionManager {
  private simulator: Simulator;
  private population: NeuralPlayer[];
  private populationSize: number;
  private mutationRate: number;
  private totalGenerations: number;
  private currentGeneration: number;
  private lostPlayersCount: number = 0;

  constructor(simulator: Simulator, populationSize: number, mutationRate: number, totalGenerations: number) {
    this.simulator = simulator;
    this.populationSize = populationSize;
    this.mutationRate = mutationRate;
    this.totalGenerations = totalGenerations;
    this.currentGeneration = 0;
    this.population = [];
    //console.log(`total gen ${totalGenerations}`);
  }

  public start(): void {
    console.log("Iniciando evolução neural");
    this.initializePopulation();
    this.startGeneration();
  }

  public stop(): void {
    // Realize aqui qualquer limpeza necessária.
  }

  private initializePopulation(): void {
    this.population = [];
    for (let i = 0; i < this.populationSize; i++) {
      const player = new NeuralPlayer(this.simulator);
      // Configura o callback onLoose para que, quando o robô cair, o gerenciador seja notificado.
      player.onLoose = () => {
        this.handlePlayerLost(player);
      };
      this.population.push(player);
    }
  }

  private startGeneration(): void {
    console.log(`Geração ${this.currentGeneration} iniciada`);
    this.lostPlayersCount = 0;
    // Reatribui o callback onLoose a cada jogador da geração atual (caso tenha sido sobrescrito)
    this.population.forEach((player) => {
      player.onLoose = () => {
        this.handlePlayerLost(player);
      };
    });
  }

  private handlePlayerLost(player: NeuralPlayer): void {
    //console.log(`Um jogador perdeu. Fitness: ${player.getFitness()}`);
    this.lostPlayersCount++;
    // Quando todos os jogadores da geração tiverem perdido:
    //console.log(`lost players: ${this.lostPlayersCount}`);
    if (this.lostPlayersCount === this.populationSize) {
      console.log(`Geração ${this.currentGeneration} finalizada.`);
      // Utilize o algoritmo genético para gerar a próxima geração.
      const ga = new GeneticAlgorithm(this.population, this.mutationRate);
      const newPopulation = ga.generateNextGeneration(this.simulator);

      this.population = newPopulation;
      this.currentGeneration++;
      console.log(`cg: ${this.currentGeneration}`)
      if (this.currentGeneration < this.totalGenerations) {
        this.startGeneration();
      } else {
        console.log("Evolução finalizada.");
      }
    }
  }
}
