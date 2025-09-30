import {MedicationRequest} from "./medication-request";

export interface LoadingRequest {
    medicationIds?: string[]
    medications?: MedicationRequest[];
}
