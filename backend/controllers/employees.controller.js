import * as employeeService from '../services/employees.service.js';

export async function httpGetAll(req, res) {
  try {
    const employees = await employeeService.getAll();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function httpCreate(req, res) {
  try {
    const newEmployee = await employeeService.create(req.body);
    res.status(201).json({ success: true, data: newEmployee });
  } catch (error) {
    // Use the status code from the service error if it exists
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
}
