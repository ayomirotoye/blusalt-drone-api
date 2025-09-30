import app from "../../src";
// @ts-ignore
import request from "supertest";
import * as droneService from "../../src/services/drone-service";
import {DroneModel} from "../../src/enums/drone-model";
import {DroneState} from "../../src/enums/drone-state";

jest.mock('../../src/services/drone-service');

describe('Drone Controller Registering', () => {
    beforeEach(() => {
    })

    it('should register a new drone', async () => {
        const registerDroneRequest = {
            serialNumber: 'DRONE-100',
            model: DroneModel.Middleweight,
            weightLimit: 200,
            batteryCapacity: 90,
        };

        (droneService.registerDrone as jest.Mock).mockReturnValue({
            ...registerDroneRequest,
            id: "53b800db-a6d0-4baf-9ef1-15fee35d116e",
            droneState: DroneState.Loading,
        });

        const res = await request(app).post('/api/v1/drones').send(registerDroneRequest);
        expect(res.status).toBe(201);
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.serialNumber).toBe('DRONE-100');
        expect(res.body.data.model).toBe(DroneModel.Middleweight);
        expect(res.body.data.weightLimit).toBe(200);
        expect(res.body.data.droneState).toBe(DroneState.Loading);
    });

    it('should fail when required parameters are not provided', async () => {
        const registerDroneRequest = {
            model: DroneModel.Middleweight,
            weightLimit: 200,
            batteryCapacity: 90,
        };

        const res = await request(app).post('/api/v1/drones').send(registerDroneRequest);
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Something may be wrong with your request.');
        expect(res.body.errors.length > 0).toBe(true);
    });
})