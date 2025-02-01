import { Injectable } from "@angular/core";
import Hashids from 'hashids';
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class EncoderService {
    private hashids = new Hashids(environment.privateKey, 6);

    encode(id: number): string {
        return this.hashids.encode(id);
    }

    decode(hash: string): number {
        const decode = this.hashids.decode(hash);
        return decode.length > 0 ? Number(decode[0]) : NaN;
    }
}