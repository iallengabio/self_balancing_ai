import * as tf from '@tensorflow/tfjs';
import { Controller } from '../controller';
import { Robot } from '../../simulation/robot';

/**
 * NeuralController:
 * Utiliza uma rede neural para controlar a força aplicada ao carrinho,
 * baseando-se no estado atual do sistema.
 */
export class NeuralController extends Controller {
  private model: tf.Sequential;
  private lastPendulumAngle: number | null = null;
  private forceScale: number = 0.04;

  constructor(robot: Robot, frequency: number) {
    super(robot, frequency);
    this.model = tf.sequential();
    
    // Primeira camada oculta: 16 neurônios com ReLU
    this.model.add(tf.layers.dense({
      units: 16,
      inputShape: [4],
      activation: 'relu'
    }));

    // Segunda camada oculta: 8 neurônios com ReLU
    this.model.add(tf.layers.dense({
      units: 8,
      activation: 'relu'
    }));

    // Camada de saída: 1 neurônio com ativação tanh (saída entre -1 e 1)
    this.model.add(tf.layers.dense({
      units: 1,
      activation: 'tanh'
    }));

    // Se for necessário treinar via backpropagation, pode compilar o modelo,
    // mas para inferência via algoritmo evolutivo isso não é obrigatório.
    // this.model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
  }

  /**
   * Permite acesso ao modelo para leitura/escrita dos pesos.
   */
  public getModel(): tf.Sequential {
    return this.model;
  }

  /**
   * Atualiza o controlador: lê o estado atual, faz predição e aplica a força.
   */
  public update(): void {
    const cartPosX = this.robot.cart.body.position.x;
    const cartVelocityX = this.robot.cart.body.velocity.x;

    const cartPos = this.robot.cart.body.position;
    const pendulumPos = this.robot.pendulum.weight.position;
    const dx = pendulumPos.x - cartPos.x;
    const dy = cartPos.y - pendulumPos.y;
    const pendulumAngle = Math.atan2(dx, dy);

    let pendulumAngularVelocity = 0;
    if (this.lastPendulumAngle !== null) {
      pendulumAngularVelocity = pendulumAngle - this.lastPendulumAngle;
    }
    this.lastPendulumAngle = pendulumAngle;

    // Normalização (os fatores podem ser ajustados conforme o domínio)
    const normCartPosX = (cartPosX - 400) / 400;
    const normCartVelocityX = cartVelocityX / 5;
    const normPendulumAngle = pendulumAngle / Math.PI;
    const normPendulumAngularVelocity = pendulumAngularVelocity / 10;

    const inputState = [normCartPosX, normPendulumAngle, normCartVelocityX, normPendulumAngularVelocity];

    tf.tidy(() => {
      const inputTensor = tf.tensor2d([inputState], [1, 4]);
      const outputTensor = this.model.predict(inputTensor) as tf.Tensor;
      const outputArray = outputTensor.dataSync();
      const force = outputArray[0] * this.forceScale;
      this.robot.applyForce(force);
    });
  }
}
