import * as droneService from "../../src/services/drone-service";

// @ts-ignore
import request from "supertest";
import app from "../../src";

jest.mock('../../src/services/drone-service');

describe('Drone Controller Loading', () => {
    beforeEach(() => {
    })

    it('should load a drone with medications', async () => {

        (droneService.loadMedications as jest.Mock).mockResolvedValue([
            {
                medicationId: '38eb24dc-d878-4f09-be7c-d8025ba9d05c'
            },
            {
                medicationId: '38eb24dc-d878-4f09-be7c-d8025ba9d05d'
            }
        ]);

        const res = await request(app).put('/api/v1/drones/DRONE-001').send([
            {
                medicationId: '38eb24dc-d878-4f09-be7c-d8025ba9d05c'
            },
            {
                medicationId: '38eb24dc-d878-4f09-be7c-d8025ba9d05d'
            }
        ]);

        expect(res.status).toBe(200);
        expect(res.body.data.length == 2).toBe(true);
    });

});