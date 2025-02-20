import { Robot } from "../../simulation/robot";
import { Controller } from "../controller";
import { PID } from "./pid";
import { PIDController } from "./pid_controller";


/**
 * PositionPIDController:
 * Uses a PID controller to calculate a target angle from the desired horizontal position (targetPosition),
 * which will be applied to the angle controller (PIDController).
 */
export class PositionPIDController extends Controller {
  private pid: PID;
  private lastTimestamp: number | null = null;
  private targetPosition: number;
  private angleController: PIDController;
  private minAngle;
  private maxAngle;

  /**
   * @param robot Instance of the robot to be controlled.
   * @param angleController Instance of the angle controller that will receive the targetAngle.
   * @param targetPosition Desired horizontal position (in units compatible with Matter.js).
   * @param minAngle Minimum angle constraint.
   * @param maxAngle Maximum angle constraint.
   * @param Kp Proportional gain for the PID controller.
   * @param Ki Integral gain for the PID controller.
   * @param Kd Derivative gain for the PID controller.
   */
  constructor(
    robot: Robot,
    frequency: number,
    angleController: PIDController,
    targetPosition: number = 0,
    minAngle:number = 0,
    maxAngle:number = 0,
    Kp: number = 0.01,
    Ki: number = 0.0001,
    Kd: number = 0.001
  ) {
    super(robot, frequency);
    this.pid = new PID(Kp, Ki, Kd);
    this.minAngle = minAngle;
    this.maxAngle = maxAngle;
    this.targetPosition = targetPosition;
    this.angleController = angleController;
    this.init();
  }

  /**
   * Initializes the controller by setting the last timestamp and starting the control loop.
   */
  public init(): void {
    this.lastTimestamp = performance.now();
    setInterval(this.update.bind(this), 1000 / this.frequency);
  }

  /**
   * The main control loop that updates the controller at each interval.
   */
  public update(): void {
    const timestamp = performance.now();
    const dt = (timestamp - (this.lastTimestamp ?? timestamp)) / 1000; // Delta time in seconds
    this.lastTimestamp = timestamp;
    this.updatePID(dt);
  }

  /**
   * Updates the position control:
   * - Reads the current horizontal position of the cart.
   * - Calculates the error between the targetPosition and the current position.
   * - Updates the PID to obtain a targetAngle.
   * - Passes the targetAngle to the angle controller (angleController).
   * @param dt Delta time in seconds.
   */
  public updatePID(dt: number): void {
    // Current horizontal position of the cart.
    const currentPosition = this.robot.cart.body.position.x;
    const positionError = this.targetPosition - currentPosition;
    //console.log(positionError);

    // The position PID generates an output that we interpret as targetAngle.
    const output = this.pid.update(positionError, dt);

    // Constrains the output between minAngle and maxAngle
    const constrainedOutput = Math.max(this.minAngle, Math.min(this.maxAngle, output));

    // Updates the targetAngle in the angle controller.
    this.angleController.setTargetAngle(constrainedOutput);
    //console.log(positionError);
  }

  /**
   * Sets a new target position for the controller.
   * @param targetPosition The new target position.
   */
  public setTargetPosition(targetPosition: number): void {
    this.targetPosition = targetPosition;
  }
}
