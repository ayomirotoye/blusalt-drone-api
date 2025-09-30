import {v4 as uuidv4} from 'uuid';
import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.resolve(__dirname, '../../drone.db'));

const medications = [
    {id: uuidv4(), weight: 50, code: 'MED_001', image: 'paracetamol.png', name: 'Paracetamol'},
    {id: uuidv4(), weight: 30, code: 'MED_002', image: 'ibuprofen.png', name: 'Ibuprofen'},
    {id: uuidv4(), weight: 100, code: 'MED_003', image: 'aspirin.png', name: 'Aspirin'},
    {id: uuidv4(), weight: 45, code: 'MED_004', image: 'chloroquine.png', name: 'Chloroquine'},
];

const runSeeding = () => {
    for (const med of medications) {
        db.prepare(`
            INSERT
            OR IGNORE INTO medications (id, weight, code, image, name)
    VALUES (@id, @weight, @code, @image, @name)
        `).run(med);
    }
}

export const seedMedications = () => {

    if (process.env.NODE_ENV === 'test') {
        console.log('[Seed] Skipped (NODE_ENV=test)');
        return;
    }
    const stmt = db.prepare<{ c: number }>('SELECT COUNT(*) as c FROM medications');
    // @ts-ignore
    const row = stmt.get();
    // @ts-ignore
    const count = row?.c ?? 0;

    if (count > 0) {
        console.log('[Seed] Medications already exist, skipping...');
        return;
    }

    runSeeding();

    console.log('Medications seeded successfully');
}
