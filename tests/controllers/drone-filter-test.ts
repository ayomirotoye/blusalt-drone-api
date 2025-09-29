// @ts-ignore
import request from 'supertest';
import app from "../../src";
import {DroneModel} from "../../src/enums/drone-model";
import {DroneState} from "../../src/enums/drone-state";
import * as droneService from "../../src/services/drone-service";
import * as medicationService from "../../src/services/medication-service";

jest.mock('../../src/services/drone-service');
jest.mock('../../src/services/medication-service');

describe('Drone Controller Filtering', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetch drones with specific battery level', async () => {
        const droneResultByBatteryLevel = [{
            serialNumber: "DRONE-0001",
            model: DroneModel.Lightweight,
            weightLimit: 100,
            batteryCapacity: 25,
            droneState: DroneState.Idle,
        }];

        (droneService.getDrones as jest.Mock).mockResolvedValue(droneResultByBatteryLevel);

        const response = await request(app).get('/api/v1/drones?batteryLevel=25');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length > 0).toBe(true);

        const zerothIndexDrone = response.body.data[0];

        expect(zerothIndexDrone).toHaveProperty('serialNumber');
        expect(zerothIndexDrone).toHaveProperty('model');
        expect(zerothIndexDrone).toHaveProperty('weightLimit');
        expect(zerothIndexDrone).toHaveProperty('batteryCapacity');
        expect(zerothIndexDrone).toHaveProperty('droneState');

        expect(zerothIndexDrone.batteryCapacity).toBe(25);
    });

    it('fetch drones with specific state', async () => {
        const droneResultByState = [
            {
                id: "53b800db-a6d0-4baf-9ef1-15fee35d116e",
                serialNumber: "DRONE-0001",
                model: DroneModel.Lightweight,
                weightLimit: 100,
                batteryCapacity: 40,
                droneState: DroneState.Loaded,
            }
        ];
        (droneService.getDrones as jest.Mock).mockResolvedValue(droneResultByState);

        const response = await request(app).get('/api/v1/drones?state=IDLE');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length > 0).toBe(true);

        const zerothIndexDrone = response.body.data[0];

        expect(zerothIndexDrone).toHaveProperty('serialNumber');
        expect(zerothIndexDrone).toHaveProperty('model');
        expect(zerothIndexDrone).toHaveProperty('weightLimit');
        expect(zerothIndexDrone).toHaveProperty('batteryCapacity');
        expect(zerothIndexDrone).toHaveProperty('droneState');

        expect(zerothIndexDrone.droneState).toBe(DroneState.Loaded);
    });

    it('fetch drones with multiple filters', async () => {
        const droneResultByMultipleFilters = [
            {
                id: "53b800db-a6d0-4baf-9ef1-15fee35d116e",
                serialNumber: "DRONE-0001",
                model: DroneModel.Lightweight,
                weightLimit: 100,
                batteryCapacity: 40,
                droneState: DroneState.Loaded,
            },
            {
                id: "53b800db-a6d0-4baf-9ef1-15fee35d116d",
                serialNumber: "DRONE-0002",
                model: DroneModel.Middleweight,
                weightLimit: 100,
                batteryCapacity: 40,
                droneState: DroneState.Loading,
            }
        ];
        (droneService.getDrones as jest.Mock).mockResolvedValue(droneResultByMultipleFilters);

        const response = await request(app).get('/api/v1/drones?state=LOADING&model=MIDDLEWEIGHT');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length > 0).toBe(true);

        const zerothIndexDrone = response.body.data[0];

        expect(zerothIndexDrone).toHaveProperty('serialNumber');
        expect(zerothIndexDrone).toHaveProperty('model');
        expect(zerothIndexDrone).toHaveProperty('weightLimit');
        expect(zerothIndexDrone).toHaveProperty('batteryCapacity');
        expect(zerothIndexDrone).toHaveProperty('droneState');

        expect(zerothIndexDrone.droneState).toBe(DroneState.Loaded);
    });

    it('fetch loaded medications for a specified drone', async () => {
        const loadedMedicationsForDrone = [
            {
                id: "550e8400-e29b-41d4-a716-446655440000",
                weight: 10,
                code: "MED-001",
                image: "https://example.com/images/drone-001.png",
                name: "Phytolin 1000"
            },
            {
                id: "6fa459ea-ee8a-3ca4-894e-db77e160355e",
                weight: 15.3,
                code: "MED-002",
                image: "https://example.com/images/drone-002.png",
                name: "Phytolin 2000"
            }
        ];

        (medicationService.getMedicationsByDroneSerialNumber as jest.Mock).mockResolvedValue(loadedMedicationsForDrone);

        const response = await request(app).get('/api/v1/drones/DRONE-001/medications');

        expect(response.status).toBe(200);
        expect(response.body.data.length > 0).toBe(true);
    });
});