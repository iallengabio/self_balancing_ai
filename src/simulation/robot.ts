import { Body } from 'matter-js';
import { Cart } from './cart';
import { Pendulum } from './pendulum';



/**
 * Class representing a self-balancing robot.
 */
export class Robot {
  cart: Cart;
  pendulum: Pendulum;
  isFallen: boolean = false; // flag para indicar se o robô já caiu
  onFall?: () => void;       // callback que será chamada quando o robô cair

  /**
   * Creates an instance of Robot.
   * @param x - Initial x position of the cart.
   * @param y - Initial y position of the cart.
   * @param cartWidth - Width of the cart.
   * @param cartHeight - Height of the cart.
   * @param pendulumLength - Length of the pendulum.
   * @param pendulumMass - Mass of the pendulum.
   */
  constructor(
    x: number,
    y: number,
    cartWidth: number,
    cartHeight: number,
    pendulumLength: number,
    pendulumMass: number
  ) {
    this.cart = new Cart(x, y, cartWidth, cartHeight);
    
    this.pendulum = new Pendulum(this.cart.body, pendulumLength, pendulumMass);
    // Associa o robô aos corpos para facilitar a identificação nas colisões
    //this.cart.body.plugin = { robot: this };
    this.pendulum.weight.plugin = { robot: this };
  }

  /**
   * Applies a horizontal force to the cart.
   * @param force - The force to be applied.
   */
  applyForce(force: number) {
    Body.applyForce(this.cart.body, this.cart.body.position, { x: force, y: 0 });
    //console.log(`force: ${force}`);
  }

  /**
   * Updates the pendulum parameters.
   * @param newLength - New length of the pendulum.
   * @param newMass - New mass of the pendulum.
   */
  updateParameters(newLength: number, newMass: number) {
    this.pendulum.setLength(newLength);
    this.pendulum.setMass(newMass);
  }
}
