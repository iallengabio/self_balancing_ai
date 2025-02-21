import { Robot } from "../simulation/robot";

/**
 * Abstract class that defines the basic interface for all controllers.
 */
export abstract class Controller {
  protected robot: Robot;
  protected frequency: number;
  private intervalId: number | null = null;

  /**
   * @param robot Instance of the robot to be controlled.
   * @param frequency Frequency of the update calls.
   */
  constructor(robot: Robot, frequency: number) {
    this.robot = robot;
    this.frequency = frequency;
  }

  /**
   * Method to start the automatic update calls at the specified frequency.
   */
  public start(): void {
    if (this.intervalId === null) {
      this.intervalId = window.setInterval(() => this.update(), 1000 / this.frequency);
    }
  }

  /**
   * Method to stop the automatic update calls.
   */
  public stop(): void {
    //console.log('stop controller');
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public abstract update(): void;
}
