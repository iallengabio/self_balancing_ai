import { Engine, Render, Runner, World, Events } from 'matter-js';
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
        wireframes: false,
        background: '#fafafa',
      },
    });
    this.runner = Runner.create();

    // Adiciona o chão
    const ground = new Ground(400, 590, 800, 20);
    this.addBody(ground.body);

    // Cria as paredes (esquerda e direita)
    const leftWall = new Boundary(0, 300, 20, 600, 'boundary-left');
    const rightWall = new Boundary(800, 300, 20, 600, 'boundary-right');
    this.addBody(leftWall.body);
    this.addBody(rightWall.body);

    // Registra o monitor de colisões para identificar quedas individuais
    Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => {
        // Verifica ambos os corpos da colisão
        [pair.bodyA, pair.bodyB].forEach(body => {
          // Se o corpo tiver um plugin.robot, ele faz parte de um robô
          if (body.plugin && body.plugin.robot) {
            // O outro corpo na colisão
            const otherBody = body === pair.bodyA ? pair.bodyB : pair.bodyA;
            // Se o outro corpo for o chão ou uma parede
            if (
              otherBody.label === 'ground' ||
              (typeof otherBody.label === 'string' && otherBody.label.startsWith('boundary'))
            ) {
              const robot: Robot = body.plugin.robot;
              if (!robot.isFallen) {
                robot.isFallen = true;
                if (robot.onFall) {
                  robot.onFall();
                }
              }
            }
          }
        });
      });
    });
  }

  /**
   * Adds a body to the simulation world.
   * @param body - The body to add to the world.
   */
  private addBody(body: any) {
    World.add(this.engine.world, body);
  }

  /**
   * Removes a robot from the simulation world.
   * @param robot - The robot to remove from the world.
   */
  public removeRobot(robot: Robot) {
    World.remove(this.engine.world, robot.cart.body);
    World.remove(this.engine.world, robot.pendulum.weight);
    World.remove(this.engine.world, robot.pendulum.constraint);
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
