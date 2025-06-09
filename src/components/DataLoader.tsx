import React, { useState } from 'react';
import { loadEvaluations, loadEmployees, type Evaluation, type Employee } from '../services/evaluationService';

export const DataLoader: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeTab, setActiveTab] = useState<'evaluations' | 'employees'>('evaluations');

  const handleEvaluationsClick = () => {
    const data = loadEvaluations();
    setEvaluations(data);
    setActiveTab('evaluations');
  };

  const handleEmployeesClick = () => {
    const data = loadEmployees().filter(emp => emp.status === "completed");
    setEmployees(data);
    setActiveTab('employees');
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleEvaluationsClick}
          className={`px-4 py-2 rounded ${
            activeTab === 'evaluations' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Evaluations
        </button>
        <button
          onClick={handleEmployeesClick}
          className={`px-4 py-2 rounded ${
            activeTab === 'employees' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Active Employees
        </button>
      </div>

      {activeTab === 'evaluations' && evaluations.length > 0 && (
        <div className="space-y-4">
          {evaluations.map((evaluation) => (
            <div key={evaluation.employeeId} className="border p-4 rounded">
              <h3 className="text-lg font-bold">{evaluation.employeeName}</h3>
              <p>Department: {evaluation.department}</p>
              <p>Position: {evaluation.position}</p>
              <p>Overall Rating: {evaluation.overallRating}</p>
              <p>Reviewer: {evaluation.reviewer}</p>
              <p>Review Date: {evaluation.reviewDate}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'employees' && employees.length > 0 && (
        <div className="space-y-4">
          {employees.map((employee) => (
            <div key={employee.employeeId} className="border p-4 rounded">
              <h3 className="text-lg font-bold">{employee.employeeName}</h3>
              <p>Department: {employee.department}</p>
              <p>Position: {employee.position}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 