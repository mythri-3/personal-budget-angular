import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataFromchartApi: any[] = [];  // To store data from /chart API

  private chartSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  // Fetch data from /chart API if not already fetched
  fetchchartDataIfNeeded(): void {
    if (this.dataFromchartApi.length === 0) {
      this.http.get('http://localhost:3000/chart').subscribe((response: any) => {
        this.dataFromchartApi = response;  // Store the fetched data
        this.chartSubject.next(this.dataFromchartApi);  // Update the BehaviorSubject
      });
    }
  }

  // Return the data from /chart API as an Observable
  getchartData(): Observable<any[]> {
    return this.chartSubject.asObservable();
  }
}
