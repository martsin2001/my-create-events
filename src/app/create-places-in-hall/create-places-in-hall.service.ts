import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CreatePlacesServeice {

    constructor(private http : HttpClient){

    }

    readonly URL_SECTION : string = 'http://localhost:3000/SectionPlaces';

    getDataSection(){
        return this.http.get( this.URL_SECTION )
    }

    postDataSection(data){
        return this.http.post( this.URL_SECTION, data )
    }
    
    updateSections(id , object){
        return this.http.put( this.URL_SECTION + '/' + id , object )
    }

    deleleSection(id){
        return this.http.delete(this.URL_SECTION + '/' + id)
    }
    
} 
