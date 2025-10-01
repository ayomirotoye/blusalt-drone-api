/**
 * @swagger
 * components:
 *   schemas:
 *     MedicationRequest:
 *       type: object
 *       required:
 *         - weight
 *         - code
 *         - image
 *         - name
 *       properties:
 *         weight:
 *           type: number
 *           description: The weight of the medication
 *           example: 50
 *         code:
 *           type: string
 *           description: The code of the medication
 *           example: "MED_001"
 *         image:
 *           type: string
 *           description: The image of the medication
 *           example: "paracetamol.png"
 *         name:
 *           type: string
 *           description: The name of the medication
 *           example: "Paracetamol"
 */
export interface MedicationRequest {
  weight: number;
  code: string;
  image: string;
  name: string;
}
