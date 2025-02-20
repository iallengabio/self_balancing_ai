import { Engine, Render, Runner, World } from 'matter-js';

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
  }

  /**
   * Adds a body to the simulation world.
   * @param body - The body to add to the world.
   */
  addBody(body: any) {
    World.add(this.engine.world, body);
  }

  /**
   * Starts the simulation rendering and running.
   */
  start() {
    Render.run(this.render);
    Runner.run(this.runner, this.engine);
  }
}
