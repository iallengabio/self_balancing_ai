import { Controller } from "../controllers/controller";
import { Robot } from "./robot";
import { Simulator } from "./simulator";

export class Player{

    private started? : number;
    private fitness? : number;
    
    constructor(private controller:Controller, private robot:Robot, private simulator:Simulator){

    }

    start(){
        
    }

}