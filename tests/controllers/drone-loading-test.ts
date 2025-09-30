import * as droneService from "../../src/services/drone-service";

// @ts-ignore
import request from "supertest";
import app from "../../src";
import {LoadingRequest} from "../../src/models/requests/loading-request";
import {v4 as uuidv4} from "uuid";

jest.mock('../../src/services/drone-service');

describe('Drone Controller Loading', () => {
    beforeEach(() => {
    })

    it('should load a drone with medications', async () => {

        const loadingRequest: LoadingRequest = {
            medicationIds: [
                "38eb24dc-d878-4f09-be7c-d8025ba9d05c",
                "38eb24dc-d878-4f09-be7c-d8025ba9d05d"
            ]
        };

        (droneService.loadMedications as jest.Mock).mockResolvedValue(loadingRequest);

        const res = await request(app).put('/api/v1/drones/DRONE-001/medications').send(loadingRequest);

        expect(res.status).toBe(200);
        expect(res.body.data.length == 2).toBe(true);
    });

    it('should load a drone with new medications', async () => {

        const loadingRequest: LoadingRequest = {
            medications: [
                {id: uuidv4(), weight: 50, code: 'MED_001', image: 'paracetamol.png', name: 'Paracetamol'},
                {id: uuidv4(), weight: 30, code: 'MED_002', image: 'ibuprofen.png', name: 'Ibuprofen'}
            ]
        };

        (droneService.loadMedications as jest.Mock).mockResolvedValue({
            medicationIds: [
                "38eb24dc-d878-4f09-be7c-d8025ba9d05c",
                "38eb24dc-d878-4f09-be7c-d8025ba9d05d"
            ]
        });

        const res = await request(app).put('/api/v1/drones/DRONE-001/medications').send(loadingRequest);

        expect(res.status).toBe(200);
        expect(res.body.data.medicationIds).toHaveLength(2);
    });

    it('should fail when new medications do not contain required/valid fields', async () => {

        const loadingRequest: LoadingRequest = {
            medications: [
                {id: uuidv4(), weight: 50, code: 'MED-001', image: 'paracetamol.png', name: 'Paracetamol'},
                {id: uuidv4(), weight: 30, code: 'MED_002', image: 'ibuprofen.png', name: 'Ibuprofen'}
            ]
        };

        (droneService.loadMedications as jest.Mock).mockResolvedValue({
            medicationIds: [
                "38eb24dc-d878-4f09-be7c-d8025ba9d05c",
                "38eb24dc-d878-4f09-be7c-d8025ba9d05d"
            ]
        });

        const res = await request(app).put('/api/v1/drones/DRONE-001/medications').send(loadingRequest);

        expect(res.status).toBe(400);
        expect(res.body.errors).toHaveLength(1);
    });

    it('should not load a drone with medications beyond its weight', async () => {
        const loadingRequest = [
            {
                medicationId: '38eb24dc-d878-4f09-be7c-d8025ba9d05c'
            },
            {
                medicationId: '38eb24dc-d878-4f09-be7c-d8025ba9d05d'
            },
            {
                medicationId: '38eb24dc-d878-4f09-be7c-d8025ba9d05f'
            }
        ];

        (droneService.loadMedications as jest.Mock).mockResolvedValue(loadingRequest);
    })

});