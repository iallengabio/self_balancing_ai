import { Body, Bodies, Constraint } from 'matter-js';

/**
 * Represents a pendulum connected to a cart body.
 */
export class Pendulum {
  weight: Body;
  constraint: Matter.Constraint;
  length: number;
  mass: number;
  cartBody: Body;

  /**
   * Creates an instance of Pendulum.
   * @param cartBody - The cart body to which the pendulum is connected.
   * @param length - The length of the pendulum rod.
   * @param mass - The mass of the pendulum weight.
   */
  constructor(cartBody: Body, length: number, mass: number) {
    this.cartBody = cartBody;
    this.length = length;
    this.mass = mass;

    // Cria o peso (cabeça do robô) como um círculo
    this.weight = Bodies.circle(
      cartBody.position.x,
      cartBody.position.y - length,
      20,
      {
        mass: mass,
        restitution: 0.0,
        render: {
          fillStyle: '#e74c3c',
        },
        collisionFilter: {
          group: -1 // Define um grupo negativo para evitar colisões com outros corpos do mesmo grupo
        },
        label:'head'
      }
    );
    

    // Cria a restrição (a "haste" que conecta o carrinho ao peso)
    this.constraint = Constraint.create({
      bodyA: cartBody,
      pointA: { x: 0, y: 0 },
      bodyB: this.weight,
      pointB: { x: 0, y: 0 },
      length: length,
      stiffness: 1,
      render: {
        strokeStyle: '#34495e',
        lineWidth: 3,
      },
    });

    // Aplica uma perturbação inicial para não iniciar perfeitamente alinhado
    this.applyInitialPerturbation();

    // Inicia o ruído periódico (perturbações ao longo do tempo)
    this.startNoise();
  }

  /**
   * Applies an initial perturbation to the pendulum weight.
   */
  private applyInitialPerturbation(): void {
    const perturbationForce = {
      x: (Math.random() - 0.5) * 0.1,
      y: (Math.random() - 0.5) * 0.1,
    };
    Body.applyForce(this.weight, this.weight.position, perturbationForce);
  }

  /**
   * Periodically applies a small random perturbation simulating noise.
   */
  private startNoise(): void {
    // Aplica ruído a cada 2 segundos (2000ms)
    setInterval(() => {
      const noiseForce = {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.001,
      };
      Body.applyForce(this.weight, this.weight.position, noiseForce);
    }, 2000);
  }

  /**
   * Sets a new length for the pendulum rod.
   * @param newLength - The new length of the rod.
   */
  setLength(newLength: number): void {
    this.length = newLength;
    this.constraint.length = newLength;
  }

  /**
   * Sets a new mass for the pendulum weight.
   * @param newMass - The new mass of the weight.
   */
  setMass(newMass: number): void {
    this.mass = newMass;
    Body.setMass(this.weight, newMass);
  }
}
