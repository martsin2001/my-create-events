import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CreatePlacesInHallComponent } from './create-places-in-hall/create-places-in-hall.component';
import { CreatePlacesServeice } from './create-places-in-hall/create-places-in-hall.service';

@NgModule({
  declarations: [
    AppComponent,
    CreatePlacesInHallComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [CreatePlacesServeice],
  bootstrap: [AppComponent]
})
export class AppModule { }
