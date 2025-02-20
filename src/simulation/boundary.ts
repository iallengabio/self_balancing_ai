import { Bodies, Body } from 'matter-js';

export class Boundary {
  body: Body;

  constructor(x: number, y: number, width: number, height: number, label: string = 'boundary') {
    this.body = Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        visible: true, // Agora a parede ficará visível
        fillStyle: '#000', // Cor preta, por exemplo. Pode ser alterada conforme desejado.
      },
      label: label
    });
  }
}
