import * as droneService from "../../src/services/drone-service";

// @ts-ignore
import request from "supertest";
import app from "../../src";
import {LoadingRequest} from "../../src/models/dtos/loading-request";
import {ApiError} from "../../src/utils/api-error";

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
        expect(res.body.data.medicationIds.length == 2).toBe(true);
    });

    it('should load a drone with new medications', async () => {

        const loadingRequest: LoadingRequest = {
            medications: [
                {weight: 50, code: 'MED_001', image: 'paracetamol.png', name: 'Paracetamol'},
                {weight: 30, code: 'MED_002', image: 'ibuprofen.png', name: 'Ibuprofen'}
            ]
        };

        (droneService.loadMedications as jest.Mock).mockReturnValue({
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
                {weight: 50, code: 'MED-001', image: 'paracetamol.png', name: 'Paracetamol'},
                {weight: 30, code: 'MED_002', image: 'ibuprofen.png', name: 'Ibuprofen'}
            ]
        };

        (droneService.loadMedications as jest.Mock).mockReturnValue({
            medicationIds: [
                "38eb24dc-d878-4f09-be7c-d8025ba9d05c",
                "38eb24dc-d878-4f09-be7c-d8025ba9d05d"
            ]
        });

        const res = await request(app).put('/api/v1/drones/DRONE-001/medications').send(loadingRequest);

        expect(res.status).toBe(400);
        expect(res.body.errors).toHaveLength(1);
    });

    it('should not load a drone with medications that exceed its weight limit directly', async () => {
        const loadingRequest = [
            {medicationId: '38eb24dc-d878-4f09-be7c-d8025ba9d05c'},
            {medicationId: '38eb24dc-d878-4f09-be7c-d8025ba9d05d'},
        ];

        (droneService.loadMedications as jest.Mock).mockRejectedValue(
            new ApiError(400, 'Weight limit exceeded: new load too heavy')
        );

        const res = await request(app)
            .put('/api/v1/drones/DRONE-001/medications')
            .send(loadingRequest);

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('Weight limit exceeded');
    });

    it('should not load a drone with medications if existing + new exceed capacity', async () => {
        const loadingRequest = [
            {medicationId: '38eb24dc-d878-4f09-be7c-d8025ba9d05f'},
        ];

        (droneService.loadMedications as jest.Mock).mockRejectedValue(
            new ApiError(400, 'Weight limit exceeded: current + new load too heavy')
        );

        const res = await request(app)
            .put('/api/v1/drones/DRONE-002/medications')
            .send(loadingRequest);

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('Weight limit exceeded');
    });

    it('should not load a drone with medications if battery level is below minimum', async () => {
        const loadingRequest = [
            {medicationId: '38eb24dc-d878-4f09-be7c-d8025ba9d05f'},
        ];

        // Mock the service to reject with battery error
        (droneService.loadMedications as jest.Mock).mockRejectedValue(
            new ApiError(422, 'Battery level too low to load medications')
        );

        const res = await request(app)
            .put('/api/v1/drones/DRONE-007/medications')
            .send(loadingRequest);

        expect(res.status).toBe(422);
        expect(res.body.message).toContain('Battery level too low');
    });

});