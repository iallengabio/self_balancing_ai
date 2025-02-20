import { Robot } from "../../simulation/robot";
import { Controller } from "../controller";
import { PID } from "./pid";

/**
 * PIDController:
 * Uses a PID controller to calculate the angular error between the pendulum and the vertical,
 * and applies the resulting force to the cart.
 */
export class PIDController extends Controller {
  private pid: PID;
  private lastTimestamp: number | null = null;
  private targetAngle : number;

  /**
   * @param robot Instance of the robot to be controlled.
   * @param Kp Proportional gain for the PID controller.
   * @param Ki Integral gain for the PID controller.
   * @param Kd Derivative gain for the PID controller.
   * @param targetAngle Desired target angle.
   */
  constructor(
    robot: Robot,
    Kp: number = 0.05,
    Ki: number = 0.0001,
    Kd: number = 0.01,
    targetAngle : number = 0
  ) {
    super(robot);
    this.pid = new PID(Kp, Ki, Kd);
    this.targetAngle = targetAngle;
    this.init();
  }

  /**
   * Initializes the controller by setting the last timestamp and starting the control loop.
   */
  public init(): void {
    this.lastTimestamp = performance.now();
    requestAnimationFrame(this.controlLoop.bind(this));
  }

  /**
   * The main control loop that updates the controller at each animation frame.
   * @param timestamp The current timestamp.
   */
  private controlLoop(timestamp: number): void {
    const dt = (timestamp - (this.lastTimestamp ?? timestamp)) / 1000; // Delta time em segundos
    this.lastTimestamp = timestamp;
    this.update(dt);
    requestAnimationFrame(this.controlLoop.bind(this));
  }

  /**
   * Updates the PID control: calculates the angular error between the pendulum and the vertical,
   * and applies the resulting force to the cart.
   * @param dt Delta time in seconds.
   */
  public update(dt: number): void {
    // Calcula o ângulo atual do pêndulo (em radianos) com base na diferença de posição entre o peso e o carrinho.
    const cartPos = this.robot.cart.body.position;
    const pendulumPos = this.robot.pendulum.weight.position;

    const dx = pendulumPos.x - cartPos.x;
    const dy = cartPos.y - pendulumPos.y; // pêndulo está acima do carrinho
    const angle = Math.atan2(dx, dy); // ângulo atual

    // O setpoint é zero (vertical), portanto o erro é igual ao ângulo
    const error = angle - this.targetAngle;

    // Calcula a saída PID utilizando a classe auxiliar PID
    const output = this.pid.update(error, dt);

    // Aplica a força resultante ao carrinho
    this.robot.applyForce(output);
  }

  /**
   * Sets a new target angle for the controller.
   * @param targetAngle The new target angle.
   */
  public setTargetAngle(targetAngle:number):void{
    this.targetAngle = targetAngle;
  }
}
