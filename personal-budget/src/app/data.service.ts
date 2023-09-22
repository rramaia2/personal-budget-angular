import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private budgetData: any[] = [];

  constructor(private http: HttpClient) {}

  // Method to get budget data from the backend
  getBudgetData(): Observable<any> {
    return this.http.get('http://localhost:3000/budget-data');
  }

  // Method to set budget data
  setBudgetData(data: any[]): void {
    this.budgetData = data;
  }

  // Method to get stored budget data
  getStoredBudgetData(): any[] {
    return this.budgetData;
  }

  // Method to check if the budget data is empty
  isBudgetDataEmpty(): boolean {
    return this.budgetData.length === 0;
  }

  // Method to get initial budget data from the backend
  getBudget(): Observable<any> {
    return this.http.get('http://localhost:3000/budget');
  }
}