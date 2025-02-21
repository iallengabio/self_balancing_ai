import { Controller } from "./controller";
import { Robot } from "../simulation/robot";
import { Simulator } from "../simulation/simulator";

export class Player {

    private started?: number;
    private fitness?: number;
    public onLoose?: () => void; // Callback a ser chamado quando o jogador perder

    constructor(private controller: Controller, private robot: Robot, private simulator: Simulator) {
        this.start();
    }

    start() {
        this.started = performance.now();
        this.simulator.addRobot(this.robot);
        this.controller.start();
        // Configura o callback onFall do robô para interromper o jogador e disparar onLoose
        this.robot.onFall = () => {
            this.stop();
            this.simulator.removeRobot(this.robot);
            if (this.onLoose) {
                this.onLoose();
            }
        };
    }

    private stop() {
        this.controller.stop();
        const finished = performance.now();
        this.fitness = finished - this.started!;
    }

    getController(): Controller {
        return this.controller;
    }

    getFitness(): number | undefined {
        return this.fitness;
    }

    getRobot(): Robot {
        return this.robot;
    }
}
