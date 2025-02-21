import * as tf from '@tensorflow/tfjs';
import { NeuralPlayer } from "./neural_player";
import { Simulator } from "../../simulation/simulator";

export class GeneticAlgorithm {
  private population: NeuralPlayer[];
  private populationSize: number;
  private mutationRate: number;

  constructor(population: NeuralPlayer[], mutationRate: number = 0.05) {
    this.population = population;
    this.populationSize = population.length;
    this.mutationRate = mutationRate;
  }

  private selectParents(): [NeuralPlayer, NeuralPlayer] {
    const sorted = this.population.slice().sort((a, b) => (b.getFitness()! - a.getFitness()!));
    return [sorted[0], sorted[1]];
  }

  private crossover(parent1: NeuralPlayer, parent2: NeuralPlayer): tf.Tensor[] {
    const weights1 = parent1.getWeights();
    const weights2 = parent2.getWeights();
    let newWeights: tf.Tensor[] = [];

    for (let i = 0; i < weights1.length; i++) {
      const tensor1 = weights1[i];
      const tensor2 = weights2[i];
      const arr1 = tensor1.dataSync();
      const arr2 = tensor2.dataSync();
      const shape = tensor1.shape;
      const newArr = new Float32Array(arr1.length);
      for (let j = 0; j < arr1.length; j++) {
        newArr[j] = Math.random() < 0.5 ? arr1[j] : arr2[j];
      }
      newWeights.push(tf.tensor(newArr, shape));
    }
    return newWeights;
  }

  private mutate(weights: tf.Tensor[]): tf.Tensor[] {
    let mutatedWeights: tf.Tensor[] = [];
    for (let i = 0; i < weights.length; i++) {
      const tensor = weights[i];
      const arr = tensor.dataSync();
      const shape = tensor.shape;
      let newArr = new Float32Array(arr.length);
      for (let j = 0; j < arr.length; j++) {
        let gene = arr[j];
        if (Math.random() < this.mutationRate) {
          gene += (Math.random() - 0.5) * 0.1;
        }
        newArr[j] = gene;
      }
      mutatedWeights.push(tf.tensor(newArr, shape));
    }
    return mutatedWeights;
  }

  /**
   * Gera a próxima geração de indivíduos usando crossover, mutação e elitismo.
   * Cria novos indivíduos para os membros da elite, copiando seus pesos.
   * @param simulator O ambiente a ser usado para criar os novos indivíduos.
   */
  generateNextGeneration(simulator: Simulator): NeuralPlayer[] {
    // Ordena a população por fitness (maior para menor)
    const sorted = this.population.slice().sort((a, b) => (b.getFitness()! - a.getFitness()!));
    const eliteCount = Math.floor(this.populationSize * 0.1);
    let newPopulation: NeuralPlayer[] = [];

    // Elitismo: para cada indivíduo da elite, cria um novo NeuralPlayer e copia seus pesos.
    for (let i = 0; i < eliteCount; i++) {
      const eliteParent = sorted[i];
      const child = new NeuralPlayer(simulator);
      const eliteWeights = eliteParent.getWeights();
      child.setWeights(eliteWeights);
      newPopulation.push(child);
    }

    // Preenche o restante da população com novos indivíduos gerados por crossover e mutação.
    while (newPopulation.length < this.populationSize) {
      const [parent1, parent2] = this.selectParents();
      const childWeights = this.crossover(parent1, parent2);
      const mutatedChildWeights = this.mutate(childWeights);
      const child = new NeuralPlayer(simulator);
      child.setWeights(mutatedChildWeights);
      newPopulation.push(child);
    }
    return newPopulation;
  }
}
