import { Engine, Render, Runner, World } from 'matter-js';
import { Ground } from './ground';
import { Robot } from './robot';
import { Boundary } from './boundary';

/**
 * The Simulator class sets up and manages the physics simulation.
 */
export class Simulator {
  engine: Engine;
  render: Render;
  runner: Runner;
  container: HTMLElement;

  /**
   * Creates an instance of Simulator.
   * @param container - The HTML element to render the simulation in.
   */
  constructor(container: HTMLElement) {
    this.container = container;
    this.engine = Engine.create();
    this.render = Render.create({
      element: container,
      engine: this.engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false, // Non-wireframe mode for better visualization
        background: '#fafafa',
      },
    });
    this.runner = Runner.create();

    const ground = new Ground(400, 590, 800, 20);
    this.addBody(ground.body);

    // Cria as paredes (esquerda e direita)
    const leftWall = new Boundary(0, 300, 20, 600, 'boundary-left');
    const rightWall = new Boundary(800, 300, 20, 600, 'boundary-right');
    this.addBody(leftWall.body);
    this.addBody(rightWall.body);

  }

  /**
   * Adds a body to the simulation world.
   * @param body - The body to add to the world.
   */
  private addBody(body: any) {
    World.add(this.engine.world, body);
  }

  public addRobot(robot: Robot) {
    World.add(this.engine.world, robot.cart.body);
    World.add(this.engine.world, robot.pendulum.weight);
    World.add(this.engine.world, robot.pendulum.constraint);
  }

  /**
   * Starts the simulation rendering and running.
   */
  start() {
    Render.run(this.render);
    Runner.run(this.runner, this.engine);
  }
}
