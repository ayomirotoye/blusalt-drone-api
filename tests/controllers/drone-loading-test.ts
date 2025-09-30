import * as droneService from "../../src/services/drone-service";

// @ts-ignore
import request from "supertest";
import app from "../../src";

jest.mock('../../src/services/drone-service');

describe('Drone Controller Loading', () => {
    beforeEach(() => {
    })

    it('should load a drone with medications', async () => {

        const loadingRequest = [
            {
                medicationId: '38eb24dc-d878-4f09-be7c-d8025ba9d05c'
            },
            {
                medicationId: '38eb24dc-d878-4f09-be7c-d8025ba9d05d'
            }
        ];

        (droneService.loadMedications as jest.Mock).mockResolvedValue(loadingRequest);

        const res = await request(app).put('/api/v1/drones/DRONE-001').send(loadingRequest);

        expect(res.status).toBe(200);
        expect(res.body.data.length == 2).toBe(true);
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