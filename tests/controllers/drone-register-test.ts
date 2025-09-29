import app from "../../src";
// @ts-ignore
import request from "supertest";
import * as droneService from "../../src/services/drone-service";

jest.mock('../../src/services/drone-service');

describe('Drone Controller Registering', () => {
    beforeEach(() => {
    })

    it('should register a new drone', async () => {
        const registerDroneRequest = {
            serialNumber: 'DRONE-100',
            model: 'Lightweight',
            weightLimit: 200,
            batteryCapacity: 90,
            droneState: 'IDLE'
        };

        (droneService.registerDrone as jest.Mock).mockResolvedValue({
            ...registerDroneRequest,
            id: "53b800db-a6d0-4baf-9ef1-15fee35d116e"
        });

        const res = await request(app).post('/api/v1/drones').send(registerDroneRequest);
        expect(res.status).toBe(201);
        expect(res.body.data.serialNumber).toBe('DRONE-100');
        expect(res.body.data.model).toBe('Lightweight');
        expect(res.body.data.weightLimit).toBe(200);
        expect(res.body.data.droneState).toBe('IDLE');
    });
})