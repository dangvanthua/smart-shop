import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private baseUrl = 'https://esgoo.net/api-tinhthanh';

    constructor(private http: HttpClient) { }

    getCities(): Observable<any> {
        return this.http.get(`${this.baseUrl}/1/0.htm`);
    }

    getDistricts(cityId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/2/${cityId}.htm`);
    }

    getWards(districtId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/3/${districtId}.htm`);
    }
}