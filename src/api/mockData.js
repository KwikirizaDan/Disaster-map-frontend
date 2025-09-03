export const devices = [
  { id: 1, name: 'Sensor-A1', type: 'Temperature', location: 'Santander', status: 'Active', battery: 98, temp: 29, humidity: 28, pollution: 60, lat: 43.4623, lng: -3.8099 },
  { id: 2, name: 'Sensor-B2', type: 'Humidity', location: 'Madrid', status: 'Inactive', battery: 20, temp: 25, humidity: 35, pollution: 50, lat: 40.4168, lng: -3.7038 },
  { id: 3, name: 'Sensor-C3', type: 'Air Pollution', location: 'Barcelona', status: 'Active', battery: 75, temp: 22, humidity: 40, pollution: 70, lat: 41.3851, lng: 2.1734 },
  { id: 4, name: 'Sensor-D4', type: 'Water Level', location: 'Valencia', status: 'Error', battery: 5, temp: 30, humidity: 30, pollution: 45, lat: 39.4699, lng: -0.3763 },
  { id: 5, name: 'Sensor-E5', type: 'Temperature', location: 'Santander', status: 'Active', battery: 80, temp: 28, humidity: 29, pollution: 65, lat: 43.465, lng: -3.815 },
  { id: 6, name: 'Sensor-F6', type: 'Humidity', location: 'Madrid', status: 'Active', battery: 90, temp: 26, humidity: 33, pollution: 55, lat: 40.42, lng: -3.7 },
  { id: 7, name: 'Sensor-G7', type: 'Air Pollution', location: 'Barcelona', status: 'Inactive', battery: 15, temp: 23, humidity: 42, pollution: 75, lat: 41.39, lng: 2.18 },
  { id: 8, name: 'Sensor-H8', type: 'Water Level', location: 'Valencia', status: 'Active', battery: 60, temp: 31, humidity: 28, pollution: 40, lat: 39.47, lng: -0.38 },
];

export const alerts = [
    { id: 1, device: 'Sensor-A1', parameter: 'Temperature', value: '29°C', message: 'Above Average', timestamp: '2024-07-29T10:00:00Z' },
    { id: 2, device: 'Sensor-D4', parameter: 'Battery', value: '5%', message: 'Low Battery', timestamp: '2024-07-29T10:05:00Z' },
    { id: 3, device: 'Sensor-G7', parameter: 'Air Pollution', value: '75 AQI', message: 'High Pollution', timestamp: '2024-07-29T10:10:00Z' },
];

export const reports = [
    { id: 1, title: 'Weekly Temperature Report', type: 'Temperature', dateGenerated: '2024-07-28', downloadUrl: '#' },
    { id: 2, title: 'Monthly Humidity Report', type: 'Humidity', dateGenerated: '2024-07-01', downloadUrl: '#' },
    { id: 3, title: 'Air Pollution Analysis', type: 'Air Pollution', dateGenerated: '2024-07-25', downloadUrl: '#' },
    { id: 4, title: 'All Devices Status Report', type: 'All', dateGenerated: '2024-07-29', downloadUrl: '#' },
];
