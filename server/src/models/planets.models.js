const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");

const results = [];
let habitablePlanets = 0;

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.1 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )

      .pipe(parse({ comment: "#", columns: true }))
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          results.push(data);
          habitablePlanets++;
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", () => {
        console.log(`${habitablePlanets} habitable planets found!`);
        resolve();
      });
  });
}

function getAllPlanets() {
  return results;
}

module.exports = { loadPlanetsData, getAllPlanets };
