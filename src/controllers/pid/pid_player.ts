import { Robot } from "../../simulation/robot";
import { Simulator } from "../../simulation/simulator";
import { Controller } from "../controller";
import { Player } from "../player";
import { PIDController } from "./pid_controller";
import { PositionPIDController } from "./position_controller";

export class PidPlayer extends Player {
    constructor(simulator: Simulator) {
        // Instancia o robô com parâmetros iniciais
        const robot = new Robot(400, 500, 100, 20, 150, 10);
        const angleController = new PIDController(robot,50, 0.09, 0.0001, 0.01, 0.001);
        const positionController = new PositionPIDController(robot,50, angleController, 200, -0.08, 0.08, 0.0001, 0, 0);
        super(positionController,robot,simulator);
    }
}