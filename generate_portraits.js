const fs = require('fs');
const https = require('https');
const path = require('path');

const races = [
    { id: 'human', name: 'Humano' },
    { id: 'elf', name: 'Elfo' },
    { id: 'dwarf', name: 'Enano' },
    { id: 'halfling', name: 'Halfling' },
    { id: 'dragonborn', name: 'Draconido' },
    { id: 'gnome', name: 'Gnomo' },
    { id: 'tiefling', name: 'Tiefling' },
    { id: 'orc', name: 'Orco' },
    { id: 'goliath', name: 'Goliat' },
    { id: 'aasimar', name: 'Aasimar' }
];

const classes = [
    { id: 'barbarian', name: 'Barbaro' },
    { id: 'bard', name: 'Bardo' },
    { id: 'cleric', name: 'Clerigo' },
    { id: 'druid', name: 'Druida' },
    { id: 'fighter', name: 'Guerrero' },
    { id: 'monk', name: 'Monje' },
    { id: 'paladin', name: 'Paladin' },
    { id: 'ranger', name: 'Explorador' },
    { id: 'rogue', name: 'Picaro' },
    { id: 'sorcerer', name: 'Hechicero' },
    { id: 'warlock', name: 'Brujo' },
    { id: 'wizard', name: 'Mago' }
];

const dir = path.join(__dirname, 'img', 'portraits');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                console.log(`Failed to download ${url}: ${res.statusCode}`);
                // Try to create a dummy file just in case
                fs.writeFileSync(dest, 'dummy png');
                resolve();
                return;
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    const tasks = [];
    for (const r of races) {
        for (const c of classes) {
            const fileName = `${r.id}_${c.id}.png`;
            const filePath = path.join(dir, fileName);
            const text = `${r.name}+${c.name}`;
            const url = `https://placehold.co/400x400/333333/FFFFFF/png?text=${text}`;
            tasks.push(downloadImage(url, filePath));
        }
    }
    console.log(`Downloading ${tasks.length} images...`);
    await Promise.all(tasks);
    console.log('Done!');
}

run();
