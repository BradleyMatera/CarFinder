// Import necessary modules and data
import data1 from './data.json';
import data2 from './car-dataset.json';
import './style.scss'; // Import styles

// Define custom error classes for exception handling
class InvalidInputTypeError extends Error {}
class InvalidInputValueError extends Error {}

// Normalize and merge data
function normalizeData(dataset) {
  return dataset.map((car) => {
    // Standardize the 'make' property
    if (car.Manufacturer && !car.make) {
      car.make = car.Manufacturer;
      delete car.Manufacturer;
    }
    // Ensure 'year' is a number
    car.year = parseInt(car.year, 10);
    return car;
  });
}

// Normalize both datasets
const normalizedData1 = normalizeData(data1);
const normalizedData2 = normalizeData(data2);

// Merge the datasets
const data = [...normalizedData1, ...normalizedData2];

// Vehicle class as a blueprint for all vehicles
class Vehicle {
  constructor(
    year,
    make,
    model,
    miles = 0,
    price = 0,
    transmission = 'Unknown',
    fuelType = 'Unknown',
    tax = 0,
    mpg = 0,
    engineSize = 0
  ) {
    // Initialize properties
    this.year = year;
    this.make = make;
    this.model = model;
    this.miles = miles;
    this.price = price;
    this.transmission = transmission;
    this.fuelType = fuelType;
    this.tax = tax;
    this.mpg = mpg;
    this.engineSize = engineSize;

    // Basic error handling example using a conditional
    let result;
    if (miles < 100) {
      result = 'Too new to sell';
    } else {
      result = 'It’s okay to sell';
    }
    console.log(result); // Logs the selling status based on mileage
  }

  // Method to display vehicle information
  start() {
    console.log(
      `Here is the data on the requested vehicle: ${this.year} ${this.make} ${this.model} with ${this.miles} miles.
Price: $${this.price}
Transmission: ${this.transmission}
Fuel Type: ${this.fuelType}
Tax: $${this.tax}
MPG: ${this.mpg}
Engine Size: ${this.engineSize}L
Thank you for choosing Bradley API Services!`
    );
  }
}

// Additional Classes
class Car {} // Empty class for Car
class Truck {} // Empty class for Truck

// DOM elements for dropdowns
const yearDropdown = document.getElementById('year');
const makeDropdown = document.getElementById('make');
const modelDropdown = document.getElementById('model');
const vehicleInfoDiv = document.getElementById('vehicle-info');

// Initially disable make and model dropdowns
makeDropdown.disabled = true;
modelDropdown.disabled = true;

// Function to populate the Year dropdown
function populateYearDropdown() {
  try {
    const years = [...new Set(data.map((car) => car.year))].sort((a, b) => a - b);
    years.forEach((year) => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearDropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error populating year dropdown:', error);
  }
}

// Event handler for year selection
yearDropdown.addEventListener('change', () => {
  try {
    const selectedYear = yearDropdown.value;
    if (!selectedYear) throw new InvalidInputValueError('Year is not selected');
    populateMakeDropdown(selectedYear);
    makeDropdown.disabled = false;
    modelDropdown.disabled = true;
    modelDropdown.innerHTML = '<option value="">Select Model</option>';
    vehicleInfoDiv.innerHTML = '';
  } catch (error) {
    console.error(error);
  }
});

// Function to populate the Make dropdown based on selected year
function populateMakeDropdown(selectedYear) {
  try {
    makeDropdown.innerHTML = '<option value="">Select Make</option>';
    const year = parseInt(selectedYear, 10);
    const filteredData = data.filter((car) => car.year === year);
    const makes = [...new Set(filteredData.map((car) => car.make))].sort();
    makes.forEach((make) => {
      const option = document.createElement('option');
      option.value = make;
      option.textContent = make;
      makeDropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error populating make dropdown:', error);
  }
}

// Event handler for make selection
makeDropdown.addEventListener('change', () => {
  try {
    const selectedYear = yearDropdown.value;
    const selectedMake = makeDropdown.value;
    if (!selectedMake) throw new InvalidInputValueError('Make is not selected');
    populateModelDropdown(selectedYear, selectedMake);
    modelDropdown.disabled = false;
    vehicleInfoDiv.innerHTML = '';
  } catch (error) {
    console.error(error);
  }
});

// Function to populate the Model dropdown based on selected year and make
function populateModelDropdown(selectedYear, selectedMake) {
  try {
    modelDropdown.innerHTML = '<option value="">Select Model</option>';
    const year = parseInt(selectedYear, 10);
    const filteredData = data.filter(
      (car) => car.year === year && car.make === selectedMake
    );
    const models = [...new Set(filteredData.map((car) => car.model))].sort();
    models.forEach((model) => {
      const option = document.createElement('option');
      option.value = model;
      option.textContent = model;
      modelDropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error populating model dropdown:', error);
  }
}

// Event handler for model selection
modelDropdown.addEventListener('change', () => {
  try {
    const selectedYear = parseInt(yearDropdown.value, 10);
    const selectedMake = makeDropdown.value;
    const selectedModel = modelDropdown.value;
    if (!selectedModel) throw new InvalidInputValueError('Model is not selected');

    // Find the vehicle data
    const vehicleData = data.find(
      (car) =>
        car.year === selectedYear &&
        car.make === selectedMake &&
        car.model === selectedModel
    );

    if (!vehicleData) throw new Error('Vehicle not found');

    // Create a new Vehicle instance with the data
    const vehicle = new Vehicle(
      vehicleData.year,
      vehicleData.make,
      vehicleData.model,
      vehicleData.mileage || 0,
      vehicleData.price || 0,
      vehicleData.transmission || 'Unknown',
      vehicleData.fuelType || 'Unknown',
      vehicleData.tax || 0,
      vehicleData.mpg || 0,
      vehicleData.engineSize || 0
    );
    vehicle.start(); // Display vehicle information

    // Display vehicle details on the front end
    displayVehicleInfo(vehicle);

    // Log the vehicle details to the console
    console.log(vehicle);
  } catch (error) {
    console.error(error);
  }
});

// Function to display vehicle information on the front end
function displayVehicleInfo(vehicle) {
  vehicleInfoDiv.innerHTML = `
    <h2>Vehicle Information</h2>
    <p><strong>Year:</strong> ${vehicle.year}</p>
    <p><strong>Make:</strong> ${vehicle.make}</p>
    <p><strong>Model:</strong> ${vehicle.model}</p>
    <p><strong>Mileage:</strong> ${vehicle.miles} miles</p>
    <p><strong>Price:</strong> $${vehicle.price}</p>
    <p><strong>Transmission:</strong> ${vehicle.transmission}</p>
    <p><strong>Fuel Type:</strong> ${vehicle.fuelType}</p>
    <p><strong>Tax:</strong> $${vehicle.tax}</p>
    <p><strong>MPG:</strong> ${vehicle.mpg}</p>
    <p><strong>Engine Size:</strong> ${vehicle.engineSize}L</p>
  `;
}

// Initialize the Year dropdown on page load
populateYearDropdown();