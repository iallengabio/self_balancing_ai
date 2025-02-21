import { Robot } from "../../simulation/robot";
import { Simulator } from "../../simulation/simulator";
import { NeuralController } from "./neural_controller";
import { Player } from "../player";
import * as tf from '@tensorflow/tfjs';

export class NeuralPlayer extends Player {
  constructor(simulator: Simulator) {
    // Instancia o robô com os parâmetros desejados
    const robot = new Robot(400, 500, 100, 20, 150, 10);
    // Cria o NeuralController com uma frequência, por exemplo, 60 Hz
    const neuralController = new NeuralController(robot, 50);
    super(neuralController, robot, simulator);
  }

  /**
   * Retorna os pesos atuais do modelo neural.
   */
  public getWeights(): tf.Tensor[] {
    return (this.getController() as NeuralController).getModel().getWeights();
  }

  /**
   * Atualiza os pesos do modelo neural.
   * @param newWeights Array de tensores representando os novos pesos.
   */
  public setWeights(newWeights: tf.Tensor[]): void {
    (this.getController() as NeuralController).getModel().setWeights(newWeights);
  }
}
