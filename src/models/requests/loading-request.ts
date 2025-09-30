import {Medication} from "../medication";

export interface LoadingRequest {
    medicationIds?: string[]
    medications?: Medication[];
}
