import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThermalPrintModule } from 'ngx-thermal-print';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ThermalPrintModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
