import { Bodies, Body } from 'matter-js';

export class Ground {
    body: Body;

    constructor(x: number, y: number, width: number, height: number) {
        this.body = Bodies.rectangle(x, y, width, height, {
            friction: 0,         // Remove dynamic friction
            frictionStatic: 0,   // Remove static friction
            frictionAir: 0.0,    // Remove air friction (if desired)
            isStatic: true, // Makes the body static so it doesn't move
            render: {
                fillStyle: '#2ecc71', // Color to differentiate the ground
            },
        });
    }
}
