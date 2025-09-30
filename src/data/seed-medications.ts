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

for (const med of medications) {
    db.prepare(`
        INSERT
        OR IGNORE INTO medications (id, weight, code, image, name)
    VALUES (@id, @weight, @code, @image, @name)
    `).run(med);
}

console.log('Medications seeded successfully');
