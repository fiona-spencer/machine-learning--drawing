const draw=require('../common/draw.js');

const {createCanvas}=require('canvas');
const canvas =createCanvas(400, 400);
const ctx=canvas.getContext('2d');


const constants = {};

constants.DATA_DIR = "../data";
constants.RAW_DIR = constants.DATA_DIR + "/raw";
constants.DATASET_DIR = constants.DATA_DIR + "/dataset";
constants.JSON_DIR = constants.DATASET_DIR + "/json";
constants.IMG_DIR = constants.DATASET_DIR + "/img";
constants.SAMPLES = constants.DATASET_DIR + "/samples.json";

const fs = require('fs');

const fileNames = fs.readdirSync(constants.RAW_DIR);
const samples = [];
let id = 1;

fileNames.forEach(fn => {
    try {
        const content = fs.readFileSync(`${constants.RAW_DIR}/${fn}`);
        const { session, student, drawings } = JSON.parse(content);

        for (let label in drawings) {
            samples.push({
                id,
                label,
                student_name: student,
                student_id: session
            });

            fs.writeFileSync(
                constants.JSON_DIR+"/"+id+".json",
                JSON.stringify(drawings[label])
            );

            generateImageFile(
                constants.IMG_DIR+"/"+id+".png",
                paths
            );

            id++;
        }
    } catch (error) {
        console.error(`Error processing file ${fn}: ${error.message}`);
    }
});

try {
    fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples));
    console.log(`Dataset created successfully: ${constants.SAMPLES}`);
} catch (writeError) {
    console.error(`Error writing dataset file: ${writeError.message}`);
}

function generateImageFile(outFile, paths){
    ctx.clearRect(0, 0,
        canvas.width, canvas.height
        )
    draw.paths(ctx, paths);

    const buffer=canvas.toBuffer("image/png");
    fs.writeFileSync(outFile, buffer);
}
