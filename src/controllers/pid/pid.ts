/**
 * Basic PID Controller
 */
export class PID {
  private Kp: number;
  private Ki: number;
  private Kd: number;
  private previousError: number;
  private integral: number;

  /**
   * @param Kp Proportional gain.
   * @param Ki Integral gain.
   * @param Kd Derivative gain.
   */
  constructor(Kp: number, Ki: number, Kd: number) {
    this.Kp = Kp;
    this.Ki = Ki;
    this.Kd = Kd;
    this.previousError = 0;
    this.integral = 0;
  }

  /**
   * Updates the PID controller for a given error and returns the adjusted output.
   * @param error The current error.
   * @param dt Delta time.
   * @returns The PID output.
   */
  public update(error: number, dt: number): number {
    this.integral += error * dt;
    const derivative = (error - this.previousError) / dt;
    this.previousError = error;

    return this.Kp * error + this.Ki * this.integral + this.Kd * derivative;
  }
}