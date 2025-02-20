import { PIDController } from "../controllers/pid/pid_controller";
import { PositionPIDController } from "../controllers/pid/position_controller";
import { Ground } from "../simulation/ground";
import { Robot } from "../simulation/robot";
import { Simulator } from "../simulation/simulator";

/**
 * Main script that initializes and starts the simulation.
 */
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('simulation-container');
  if (!container) {
    throw new Error("Elemento 'simulation-container' não encontrado!");
  }

  const simulator = new Simulator(container);

  // Instancia o robô com parâmetros iniciais
  const robot = new Robot(400, 500, 100, 20, 150, 10);

  // Adiciona os corpos do robô à simulação
  simulator.addBody(robot.cart.body);
  simulator.addBody(robot.pendulum.weight);
  simulator.addBody(robot.pendulum.constraint);

  // Cria o chão (ground) e adiciona à simulação
  const ground = new Ground(400, 590, 800, 20);
  simulator.addBody(ground.body);

  // Inicia o simulador
  simulator.start();

  // Inicializa os controladores:
  // O PIDController controla o ângulo e o PositionPIDController controla a posição,
  // enviando o targetAngle desejado para o PIDController.
  const angleController = new PIDController(robot,50, 0.09, 0.0001, 0.01, 0.0);
  const positionController = new PositionPIDController(robot,50, angleController, 200, -0.08, 0.08, 0.0001, 0, 0);

  // Configuração da interface para alterar a targetPosition
  const targetInput = document.getElementById('target-position') as HTMLInputElement;
  const setTargetButton = document.getElementById('set-target');

  if (targetInput && setTargetButton) {
    setTargetButton.addEventListener('click', () => {
      const targetValue = parseFloat(targetInput.value);
      if (!isNaN(targetValue)) {
        positionController.setTargetPosition(targetValue);
      }
    });
  }
});
