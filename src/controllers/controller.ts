import { Robot } from "../simulation/robot";

/**
 * Abstract class that defines the basic interface for all controllers.
 */
export abstract class Controller {
  protected robot: Robot;

  /**
   * @param robot Instance of the robot to be controlled.
   */
  constructor(robot: Robot) {
    this.robot = robot;
  }

  /**
   * Method to initialize the controller, such as setting up event listeners or variables.
   */
  public abstract init(): void;

}
