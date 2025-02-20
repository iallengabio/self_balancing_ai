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
    frequency: number,
    Kp: number = 0.05,
    Ki: number = 0.0001,
    Kd: number = 0.01,
    targetAngle : number = 0
  ) {
    super(robot, frequency);
    this.pid = new PID(Kp, Ki, Kd);
    this.targetAngle = targetAngle;
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
   * Updates the PID control: calculates the angular error between the pendulum and the vertical,
   * and applies the resulting force to the cart.
   * @param dt Delta time in seconds.
   */
  public updatePID(dt: number): void {
    //console.log(dt);
    // Calcula o ângulo atual do pêndulo (em radianos) com base na diferença de posição entre o peso e o carrinho.
    const cartPos = this.robot.cart.body.position;
    const pendulumPos = this.robot.pendulum.weight.position;

    const dx = pendulumPos.x - cartPos.x;
    const dy = cartPos.y - pendulumPos.y; // pêndulo está acima do carrinho
    const angle = Math.atan2(dx, dy); // ângulo atual

    // O setpoint é zero (vertical), portanto o erro é igual ao ângulo
    const error = angle - this.targetAngle;
    //console.log(error);

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
