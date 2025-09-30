// @ts-ignore
import request from 'supertest';
import * as droneService from '../../src/services/drone-service';
import app from "../../src";
import {DroneState} from "../../src/enums/drone-state";
import {DroneModel} from "../../src/enums/drone-model";

jest.mock('../../src/services/drone-service');

describe('Drone Controller Availability Check', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('available drones should return drones with IDLE status', async () => {
        const mockDrones = [
            {
                id: "53b800db-a6d0-4baf-9ef1-15fee35d116e",
                serialNumber: "DRONE-0001",
                model: DroneModel.Lightweight,
                weightLimit: 100,
                batteryCapacity: 85,
                droneState: DroneState.Idle,
            }
        ];
        (droneService.getAvailableDrones as jest.Mock).mockResolvedValue(mockDrones);

        const response = await request(app).get('/api/v1/drones/available');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length > 0).toBe(true);

        const zerothIndexDrone = response.body.data[0];

        expect(zerothIndexDrone).toHaveProperty('id');
        expect(zerothIndexDrone).toHaveProperty('serialNumber');
        expect(zerothIndexDrone).toHaveProperty('model');
        expect(zerothIndexDrone).toHaveProperty('weightLimit');
        expect(zerothIndexDrone).toHaveProperty('batteryCapacity');
        expect(zerothIndexDrone).toHaveProperty('droneState');

        expect(zerothIndexDrone.id).toBe('53b800db-a6d0-4baf-9ef1-15fee35d116e');
        expect(zerothIndexDrone.serialNumber).toBe("DRONE-0001");
        expect(zerothIndexDrone.model).toBe('Lightweight');
        expect(zerothIndexDrone.weightLimit).toBe(100);
        expect(zerothIndexDrone.batteryCapacity).toBe(85);
        expect(zerothIndexDrone.droneState).toBe('IDLE');
    });

    it('return empty db when no available drones', async () => {
        const mockDrones = [
            {
                id: "53b800db-a6d0-4baf-9ef1-15fee35d116e",
                serialNumber: 'DRONE-0002',
                model: DroneModel.Lightweight,
                weightLimit: 100,
                batteryCapacity: 85,
                droneState: DroneState.Idle,
            }
        ];

        (droneService.getAvailableDrones as jest.Mock).mockResolvedValue([]);

        const response = await request(app).get('/api/v1/drones/available');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length == 0).toBe(true);
    });
});