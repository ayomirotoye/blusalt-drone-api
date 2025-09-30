import * as droneService from "../../src/services/drone-service";
// @ts-ignore
import request from "supertest";
import app from "../../src";

jest.mock('../../src/services/drone-service');

describe('Drone Controller Battery Level', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a specific drone\'s battery level', async () => {

        (droneService.getBatteryLevel as jest.Mock).mockReturnValue(20);

        const response = await request(app).get('/api/v1/drones/:droneSerialNumber/battery-level');
        expect(response.status).toBe(200);
        expect(response.body.data.batteryLevel).toBe(20);
    });
});