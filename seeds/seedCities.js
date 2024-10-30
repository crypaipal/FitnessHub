const Cities = require('../models/city'); // Import modelu Cities
const citiesData = require('./cities'); // Import listy miast
const { sequelize } = require('../config/database'); // Import połączenia z bazą danych

const seedCities = async () => {
  try {
    // Synchronizuj model Cities z bazą danych (tworzy tabelę, jeśli jej nie ma)
    await sequelize.sync();
    // Przejdź przez każdy element w citiesData i zapisz do bazy danych
    for (const city of citiesData) {
      await Cities.create({
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude
      });
    }
    console.log("City data has been successfully added to the database");
  }
  catch (error) {
    console.error("Error with adding cities to the database", error);
  }
  finally {
    // Zamknij połączenie z bazą danych
    sequelize.close();
  }
};

seedCities();

