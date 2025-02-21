import { PidPlayer } from "../controllers/pid/pid_player";
import { PositionPIDController } from "../controllers/pid/position_controller";
import { Simulator } from "../simulation/simulator";

/**
 * Main script for pid.html
 */
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('simulation-container');
  if (!container) {
    throw new Error("Elemento 'simulation-container' não encontrado!");
  }
  const simulator = new Simulator(container);
  // Inicia o simulador
  simulator.start();
  const player = new PidPlayer(simulator);
  const pController = player.getController() as PositionPIDController;

  const targetInput = document.getElementById('target-position') as HTMLInputElement;
  const setTargetButton = document.getElementById('set-target');

  if (targetInput && setTargetButton) {
    setTargetButton.addEventListener('click', () => {
      const targetValue = parseFloat(targetInput.value);
      if (!isNaN(targetValue)) {
        pController.setTargetPosition(targetValue);
      }
    });
  }
});
