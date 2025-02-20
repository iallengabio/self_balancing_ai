import { Bodies, Body } from 'matter-js';

/**
 * The Cart class represents a cart in the simulation.
 */
export class Cart {
    body: Body;

    /**
     * Creates an instance of Cart.
     * @param x - The x-coordinate of the cart.
     * @param y - The y-coordinate of the cart.
     * @param width - The width of the cart.
     * @param height - The height of the cart.
     */
    constructor(x: number, y: number, width: number, height: number) {
        this.body = Bodies.rectangle(x, y, width, height, {
            friction: 0,         // Remove dynamic friction
            frictionStatic: 0,   // Remove static friction
            frictionAir: 0.0,    // Remove air friction (if desired)
            restitution: 0.0,
            render: {
                fillStyle: '#2e86de',
            },
        });
    }
}
