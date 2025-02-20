import { PIDController } from "../controllers/pid/pid_controller";
import { PositionPIDController } from "../controllers/pid/position_controller";
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
  simulator.addRobot(robot);
  

  // Inicia o simulador
  simulator.start();

  // Inicializa os controladores:
  // O PIDController controla o ângulo e o PositionPIDController controla a posição,
  // enviando o targetAngle desejado para o PIDController.
  const angleController = new PIDController(robot,50, 0.09, 0.0001, 0.01, 0.001);
  const positionController = new PositionPIDController(robot,50, angleController, 200, -0.08, 0.08, 0.0001, 0, 0);
  angleController.start();
  positionController.start();
  function setupRobot(){
    const robot2 = new Robot(400, 500, 100, 20, 150, 10);
    simulator.addRobot(robot2);
    const angleController2 = new PIDController(robot2,50, 0.09, 0.0001, 0.01, 0.0);
    const positionController2 = new PositionPIDController(robot2,50, angleController2, 600, -0.08, 0.08, 0.0001, 0, 0);
  };

  // for(let i=0;i<400;i++){
  //   setupRobot();
  // }

  

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
