import { Robot } from "../simulation/robot";
import { Controller } from "./controller";

/**
 * ManualController:
 * Allows manual control of the robot via keyboard inputs.
 */
export class ManualController extends Controller {
  private forceMagnitude: number;

  /**
   * @param robot Instance of the robot to be controlled.
   * @param forceMagnitude Magnitude of the force to be applied on key press.
   */
  constructor(robot: Robot, forceMagnitude: number = 0.005) {
    super(robot);
    this.forceMagnitude = forceMagnitude;
    this.init();
  }

  /**
   * Initializes the event listeners for manual control via keyboard.
   */
  public init(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  /**
   * For manual control, continuous update may not be necessary,
   * but the method is mandatory due to the abstract class.
   */
  public update(): void {
    // Para o controle manual, não há atualização contínua.
    // Esse método pode ser utilizado para futuras expansões.
  }

  /**
   * Handles the keydown event to apply force to the robot.
   * @param event The keyboard event.
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.robot.applyForce(-this.forceMagnitude);
    } else if (event.key === 'ArrowRight') {
      this.robot.applyForce(this.forceMagnitude);
    }
  }

  /**
   * Handles the keyup event to stop applying force to the robot.
   * @param event The keyboard event.
   */
  private handleKeyUp(event: KeyboardEvent): void {
    // Aqui você pode implementar a lógica de desaceleração ou parar a aplicação de força,
    // se necessário.
  }
}
